import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  FileText,
  Users,
  Zap,
  Lock,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  FileCheck,
  Bell,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl dark:bg-gray-950/70 dark:border-gray-800/50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl flex items-center justify-between mx-auto px-6 py-4">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Image
                src="/logo.png"
                alt="Blotter System Logo"
                width={48}
                height={48}
                className="relative rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="ml-3 text-2xl font-black tracking-tight">
              <span className="text-gray-900 dark:text-white">Blotter</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sys
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Staff Portal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DILG-Compliant Barangay Management System
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                <span className="text-gray-900 dark:text-white">
                  Transform Your
                </span>
                <br />
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-30"></span>
                  <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Barangay Operations
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mb-10 text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-medium">
                The complete platform for modern incident management. Digitize
                blotters, secure evidence, and generate legal documents
                instantly.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/login"
                  className="group relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <a
                  href="#features"
                  className="group px-8 py-4 text-lg font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-full hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    Explore Features
                    <Shield className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                  </span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>DILG Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>24/7 Uptime</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="mt-20 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 scale-105"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                {/* Browser Chrome */}
                <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 mx-4 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg text-xs text-gray-500 text-center font-mono border border-gray-200 dark:border-gray-700">
                    🔒 secure.blottersys.gov/dashboard
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                        Active Cases
                      </div>
                      <div className="text-4xl font-black text-gray-900 dark:text-white">
                        127
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg">
                      <div className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                        Settled Today
                      </div>
                      <div className="text-4xl font-black text-gray-900 dark:text-white">
                        15
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl border border-green-200 dark:border-green-800 shadow-lg">
                      <div className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2">
                        Resolution Rate
                      </div>
                      <div className="text-4xl font-black text-gray-900 dark:text-white">
                        94%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          JD
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            Theft Complaint
                          </div>
                          <div className="text-sm text-gray-500">
                            Case #2025-127 • 2 mins ago
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-bold rounded-full">
                        In Progress
                      </span>
                    </div>
                    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          MA
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            Noise Complaint
                          </div>
                          <div className="text-sm text-gray-500">
                            Case #2025-126 • 1 hour ago
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-bold rounded-full">
                        Settled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          id="features"
          className="py-24 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="mb-6 text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                Everything You Need,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nothing You Don't
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Built specifically for Barangay operations with security,
                compliance, and ease-of-use at the core.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Smart Case Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Track every case from filing to resolution with automated
                    workflows and real-time status updates.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Instant Documents
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Generate official summons, hearing notices, and certificates
                    in seconds. Print-ready and standardized.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Secure Evidence Links
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Share magic links with residents to upload photos and videos
                    securely without creating accounts.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    People Directory
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Maintain comprehensive profiles with case history and
                    engagement records for better service delivery.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Audit Trail System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Complete transparency with comprehensive logs of every
                    action, edit, and access for accountability.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Real-Time Updates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Stay informed with instant notifications and live status
                    updates on all your active cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* CTA SECTION */}
        <section className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800 rounded-full mb-6">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Ready to Get Started?
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                Modernize Your Barangay{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Today
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                Join hundreds of progressive communities building trust,
                efficiency, and transparency with BlotterSys.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="group relative px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Access Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-green-500" />
                <span>DILG Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                <span>Data Privacy Compliant</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Link href="/" className="flex items-center mb-6 group">
              <Image
                src="/logo.png"
                alt="Blotter System Logo"
                width={40}
                height={40}
                className="mr-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-2xl font-black tracking-tight">
                <span className="text-gray-900 dark:text-white">Blotter</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sys
                </span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Modern Justice for Modern Communities
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © 2025 BlotterSys™ Inc. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
