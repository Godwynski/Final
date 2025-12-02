import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* 1. NAVBAR */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-gray-200/80 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-2 rounded-xl mr-3 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.414.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white tracking-tight">Blotter<span className="text-blue-600 dark:text-blue-500">Sys</span></span>
          </Link>
          <div className="flex md:order-2">
            <Link href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Staff Portal
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">

        {/* 2. HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-white dark:bg-gray-900">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-blue-900/20 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-purple-900/20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-pink-900/20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 grid max-w-screen-xl px-4 mx-auto lg:gap-12 xl:gap-0 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span className="w-2 h-2 mr-2 bg-blue-600 rounded-full animate-pulse"></span>
                v2.0 is now live
              </div>
              <h1 className="max-w-2xl mb-6 text-5xl font-extrabold tracking-tight leading-tight md:text-6xl xl:text-7xl dark:text-white">
                Modern Justice for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Modern Communities</span>
              </h1>
              <p className="max-w-2xl mb-8 font-light text-gray-500 lg:mb-10 md:text-lg lg:text-xl dark:text-gray-400 leading-relaxed">
                The all-in-one platform for Barangay Incident Management. Securely record blotters, manage digital evidence, and generate legal documents in seconds.
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link href="/login" className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                  Access Dashboard
                  <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </Link>
                <Link href="#features" className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-800 transition-all">
                  View Features
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Bank-Grade Security
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  DILG Compliant
                </div>
              </div>
            </div>

            {/* VISUAL: Enhanced Mock Interface */}
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20 transform rotate-3 scale-105"></div>
              <div className="relative w-full rounded-xl border border-gray-200/50 shadow-2xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700 overflow-hidden transform transition-all hover:scale-[1.02] duration-500">
                {/* Browser Header */}
                <div className="bg-gray-50/80 dark:bg-gray-900/80 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 bg-white dark:bg-gray-800 rounded-md text-xs text-gray-400 flex-grow text-center font-mono border border-gray-100 dark:border-gray-700">
                    secure.blottersys.gov/dashboard
                  </div>
                </div>
                {/* Browser Body */}
                <div className="p-6 space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Active Cases</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase mb-1">Settled Today</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-700/50 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">JD</div>
                        <div>
                          <div className="text-sm font-bold dark:text-white">Theft Complaint</div>
                          <div className="text-xs text-gray-500">Case #2024-001 • Just now</div>
                        </div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">Hearing</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-700/50 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">AS</div>
                        <div>
                          <div className="text-sm font-bold dark:text-white">Noise Complaint</div>
                          <div className="text-xs text-gray-500">Case #2024-002 • 2h ago</div>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">Settled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURES GRID */}
        <section id="features" className="bg-gray-50 dark:bg-gray-800 py-20 lg:py-28">
          <div className="max-w-screen-xl px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Everything you need to run a Barangay</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">We separated the concerns to ensure security for admins, speed for staff, and ease-of-use for the public.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-700">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 dark:bg-blue-900/50 dark:text-blue-400">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Case Management</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Track cases from filing to resolution. Automated status workflows ensure no case is left behind.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-700">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.414.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 dark:bg-purple-900/50 dark:text-purple-400">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant Documents</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Generate official Summons, Hearing Notices, and Certificates in one click. Print-ready and standardized.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-700">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6 dark:bg-green-900/50 dark:text-green-400">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure Evidence Links</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Send magic links to residents. They can upload photos and videos securely without creating an account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. STATS SECTION */}
        <section className="bg-blue-900 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-screen-xl px-4 mx-auto relative z-10">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-extrabold text-white mb-2">50%</div>
                <div className="text-blue-200 font-medium">Faster Resolution</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-2">100%</div>
                <div className="text-blue-200 font-medium">Paperless Option</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-2">24/7</div>
                <div className="text-blue-200 font-medium">System Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-2">Bank-Grade</div>
                <div className="text-blue-200 font-medium">Data Encryption</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. WORKFLOW SECTION */}
        <section className="bg-white dark:bg-gray-900 py-20 lg:py-28">
          <div className="max-w-screen-xl px-4 mx-auto">
            <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white md:text-4xl">
              How the <span className="text-blue-600">Secure Link</span> works
            </h2>
            <div className="relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>

              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                <div className="bg-white dark:bg-gray-900 p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 border-4 border-white dark:border-gray-900">1</div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Request Evidence</h3>
                  <p className="text-gray-500 dark:text-gray-400">Desk officer generates a unique, time-limited link for a specific case.</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 border-4 border-white dark:border-gray-900">2</div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Resident Uploads</h3>
                  <p className="text-gray-500 dark:text-gray-400">Resident opens the link on their phone and uploads photos or videos instantly.</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 border-4 border-white dark:border-gray-900">3</div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Auto-Sync</h3>
                  <p className="text-gray-500 dark:text-gray-400">Files are automatically encrypted and attached to the case file.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-20">
          <div className="max-w-screen-xl px-4 mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="mb-6 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Ready to modernize your Barangay?</h2>
              <p className="mb-8 font-light text-gray-500 dark:text-gray-400 text-xl">Join hundreds of forward-thinking communities using BlotterSys to build trust and efficiency.</p>
              <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-center text-white rounded-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                Log In to System
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto p-8 md:p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Product</h3>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Security</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h3>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li><a href="#" className="hover:underline">Documentation</a></li>
                <li><a href="#" className="hover:underline">API Reference</a></li>
                <li><a href="#" className="hover:underline">Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h3>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h3>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-2">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <a href="#" className="flex justify-center items-center text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Blotter<span className="text-blue-600">Sys</span>
            </a>
            <p className="text-gray-500 dark:text-gray-400 text-sm">© 2024 BlotterSys™ Inc. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}