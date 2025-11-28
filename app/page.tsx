import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">

      {/* 1. FLOWBITE NAVBAR */}
      <nav className="fixed w-full z-20 top-0 left-0 border-b border-gray-200 bg-white/90 backdrop-blur dark:bg-gray-900/90 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center">
            <div className="bg-blue-700 text-white p-1.5 rounded-lg mr-3">
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.414.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Blotter<span className="text-blue-700">Sys</span></span>
          </a>
          <div className="flex md:order-2">
            <Link href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Staff Portal
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">

        {/* 2. HERO SECTION */}
        <section className="bg-white dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                The New Standard for <br />
                <span className="text-blue-700 dark:text-blue-500">Barangay Incident Management</span>
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                Securely record blotters, generate subpoenas, and collect digital evidence via secure links. Built for accountability.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link href="/login" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                  Access Dashboard
                  <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </Link>
                <Link href="#features" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                  Learn More
                </Link>
              </div>
            </div>

            {/* VISUAL: Stylized Browser Window (CSS Only) */}
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <div className="w-full rounded-lg border border-gray-200 shadow-xl bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden transform rotate-1 hover:rotate-0 transition duration-500">
                {/* Browser Header */}
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 px-3 py-0.5 bg-white dark:bg-gray-600 rounded text-xs text-gray-500 dark:text-gray-300 flex-grow text-center">app.blotter-sys.gov/dashboard</div>
                </div>
                {/* Browser Body (Mock Interface) */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg dark:text-white">Incident Reports</h3>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Live System</div>
                  </div>
                  {/* Mock Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded dark:bg-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">#102</div>
                        <div className="text-sm font-medium dark:text-white">Theft Complaint</div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-300">Hearing</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded dark:bg-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">#101</div>
                        <div className="text-sm font-medium dark:text-white">Noise Complaint</div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-300">Settled</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex gap-2">
                        <div className="h-2 w-1/3 bg-gray-200 rounded dark:bg-gray-600"></div>
                        <div className="h-2 w-1/4 bg-gray-200 rounded dark:bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ROLES SECTION (Flowbite Cards) */}
        <section id="features" className="bg-gray-50 dark:bg-gray-800">
          <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for your Team</h2>
              <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">We separated the concerns to ensure security for admins, speed for staff, and ease-of-use for the public.</p>
            </div>
            <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-3">

              {/* Card 1: Admin */}
              <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-6 flex-col text-center hover:bg-white transition duration-300">
                <div className="p-3 mb-4 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">Admin & Security</a>
                </h3>
                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                  Manage staff accounts and view uneditable <strong>Audit Logs</strong> to see exactly who did what and when.
                </p>
              </div>

              {/* Card 2: Staff */}
              <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-6 flex-col text-center hover:bg-white transition duration-300">
                <div className="p-3 mb-4 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">Desk Officer</a>
                </h3>
                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                  Full control over Blotters. Create cases, update status workflows, and print <strong>Official Summons</strong> instantly.
                </p>
              </div>

              {/* Card 3: Guest */}
              <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700 border border-gray-200 p-6 flex-col text-center hover:bg-white transition duration-300">
                <div className="p-3 mb-4 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">Guest Uploads</a>
                </h3>
                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                  Send a <strong>Magic Link</strong> to residents. They can upload evidence photos/videos securely without creating an account.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. WORKFLOW / STEPS SECTION */}
        <section className="bg-white dark:bg-gray-900">
          <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16">
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight leading-tight text-center text-gray-900 dark:text-white md:text-4xl">
              How the <span className="text-blue-700">Secure Link</span> works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="text-lg font-bold mb-2 dark:text-white">Staff Generates Link</h3>
                <p className="text-gray-500 dark:text-gray-400">Desk officer clicks "Request Evidence" on a specific case ID.</p>
              </div>
              <div>
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="text-lg font-bold mb-2 dark:text-white">Resident Receives Link</h3>
                <p className="text-gray-500 dark:text-gray-400">Link is sent via SMS/Email. No login or password required.</p>
              </div>
              <div>
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="text-lg font-bold mb-2 dark:text-white">Evidence Syncs</h3>
                <p className="text-gray-500 dark:text-gray-400">Uploaded files are automatically attached to the correct blotter.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
            <div className="max-w-screen-sm mx-auto">
              <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">Ready to modernize?</h2>
              <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Deploy the Blotter System today for a more transparent and efficient community.</p>
              <Link href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Log In to System
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 6. FOOTER */}
      <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-screen-xl text-center">
          <a href="#" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
            Blotter<span className="text-blue-700">Sys</span>
          </a>
          <p className="my-6 text-gray-500 dark:text-gray-400">A secure project built for Community Accountability.</p>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="#" className="hover:underline">BlotterSys™</a>. All Rights Reserved.</span>
        </div>
      </footer>

    </div>
  );
}