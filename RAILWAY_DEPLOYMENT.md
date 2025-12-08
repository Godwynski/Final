# Railway Deployment Guide

## Problem Solved

Your app was crashing on Railway because **Puppeteer requires Chromium**, which wasn't installed in the default Railway environment. The container would start successfully but then crash when trying to generate PDFs.

## Files Created/Modified

### 1. `nixpacks.toml` (NEW)

Configures Railway's build environment to include Chromium and Node.js.

### 2. `.railwayignore` (NEW)

Excludes unnecessary files from deployment to reduce build size.

### 3. `app/api/documents/download/route.ts` (MODIFIED)

Updated Puppeteer configuration to use environment-specific Chromium path.

## Deployment Steps

### Step 1: Commit and Push Changes

```bash
git add nixpacks.toml .railwayignore app/api/documents/download/route.ts
git commit -m "Fix Railway deployment: Add Chromium support for Puppeteer"
git push
```

### Step 2: Configure Railway Environment Variables

In your Railway dashboard, ensure these environment variables are set:

**Required:**

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `MAILERSEND_API_KEY` - Your MailerSend API key (if using email)

**Automatically set by nixpacks.toml:**

- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
- `PUPPETEER_EXECUTABLE_PATH=/nix/var/nix/profiles/default/bin/chromium`

### Step 3: Deploy

Railway will automatically detect the push and start a new deployment. The build process will:

1. Install Node.js 20 and Chromium via Nix
2. Run `npm ci` to install dependencies
3. Run `npm run build` to build your Next.js app
4. Start the app with `npm start`

### Step 4: Verify Deployment

Once deployed, test the PDF generation feature to ensure Puppeteer works correctly.

## Troubleshooting

### If deployment still fails:

**1. Check Build Logs**
Look for errors during the build phase in Railway dashboard.

**2. Memory Issues**
If you see "Out of Memory" errors:

- Upgrade your Railway plan (free tier has limited memory)
- Puppeteer + Next.js can be memory-intensive

**3. Chromium Not Found**
If you see "Could not find Chromium" errors:

- Verify `PUPPETEER_EXECUTABLE_PATH` is set correctly
- Check Railway logs for Nix package installation

**4. Port Issues**
Railway automatically sets the `PORT` environment variable. Next.js should use it automatically.

### Alternative: Use Puppeteer Core + Chrome AWS Lambda

If Chromium installation continues to cause issues, consider using:

- `@sparticuz/chromium` package (optimized for serverless)
- `puppeteer-core` instead of `puppeteer`

This would require modifying the code but results in smaller deployments.

## Cost Considerations

- **Free Tier**: Limited to 500 hours/month, may have memory constraints
- **Hobby Plan** ($5/month): Recommended for production use with Puppeteer

## Next Steps

1. Push your changes to trigger a new deployment
2. Monitor the build logs in Railway dashboard
3. Test PDF generation once deployed
4. Set up custom domain (optional)
