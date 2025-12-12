-- ENABLE pgcrypto extension if not already enabled
create extension if not exists "pgcrypto";
-- Set your desired credentials here
DO $$
DECLARE
  new_email text := 'admin@barangay.gov.ph';
  new_password text := 'admin123';
  new_role text := 'admin';
  new_full_name text := 'System Administrator';
  new_user_id uuid;
BEGIN
  -- 1. Check if user already exists
  SELECT id INTO new_user_id FROM auth.users WHERE email = new_email;
  -- 2. If user does not exist, insert into auth.users
  IF new_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      new_email,
      crypt(new_password, gen_salt('bf')), -- Hash the password
      now(), -- Confirm email immediately
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', new_full_name, 'role', new_role),
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO new_user_id;
  END IF;
  -- 3. Ensure profile is Admin (Trigger creates it as 'staff' by default, so we update)
  -- Wait a moment for trigger (optional in single transaction, but good for safety) or just UPSERT
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new_user_id, new_email, new_full_name, new_role)
  ON CONFLICT (id) DO UPDATE
  SET role = new_role, full_name = new_full_name;
  RAISE NOTICE 'Admin user created/updated: % (ID: %)', new_email, new_user_id;
END $$;

--Godwyn was here