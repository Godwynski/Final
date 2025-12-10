"use client";

import { useEffect } from "react";
import { TERMS_VERSION, TERMS_EFFECTIVE_DATE } from "@/constants/terms-content";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Terms and Conditions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Guest Evidence Upload Portal • Version {TERMS_VERSION}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 bg-white dark:bg-gray-800">
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            {/* Introduction */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                <strong>Version {TERMS_VERSION}</strong> – Effective{" "}
                {TERMS_EFFECTIVE_DATE}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-2">
                By accessing this guest upload portal and checking the
                acceptance box, you acknowledge that you have read, understood,
                and agree to be bound by these Terms and Conditions.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">1.</span>
                ACCEPTANCE OF TERMS
              </h3>
              <p className="text-sm leading-relaxed">
                These Terms and Conditions (&quot;Terms&quot;) govern your use
                of the Barangay Blotter Case Management System&apos;s Guest
                Upload Portal (&quot;Portal&quot;). By accessing this Portal
                through a secure guest link, you agree to comply with and be
                bound by these Terms. If you do not agree to these Terms, you
                must not use this Portal.
              </p>
              <p className="text-sm leading-relaxed mt-2">
                Your acceptance is recorded with a timestamp for legal and audit
                purposes.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">2.</span>
                PURPOSE AND SCOPE
              </h3>
              <p className="text-sm leading-relaxed">
                This Portal is provided by the Barangay Government to facilitate
                the secure collection of photographic and video evidence related
                to barangay cases. The Portal allows authorized guests
                (complainants, respondents, witnesses, or other involved
                parties) to upload evidence directly to case records.
              </p>
              <p className="text-sm leading-relaxed mt-2 font-semibold text-blue-700 dark:text-blue-300">
                This system is for official barangay proceedings only.
              </p>
              <p className="text-sm leading-relaxed mt-1">
                Evidence submitted through this Portal may be used in mediation,
                conciliation, arbitration, hearings, and other legal proceedings
                as governed by Philippine law and local barangay regulations.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">3.</span>
                USER RESPONSIBILITIES
              </h3>
              <p className="text-sm leading-relaxed mb-2">
                By using this Portal, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>
                  <strong>Provide Truthful Information:</strong> All evidence
                  and accompanying descriptions must be accurate, truthful, and
                  relevant to the case.
                </li>
                <li>
                  <strong>Authenticate Evidence:</strong> You affirm that any
                  photos or videos you upload are genuine, unaltered (except for
                  reasonable resizing), and accurately represent the events,
                  persons, or property depicted.
                </li>
                <li>
                  <strong>Respect Privacy:</strong> You will not upload
                  materials that violate the privacy rights of individuals not
                  involved in the case.
                </li>
                <li>
                  <strong>Cooperate with Officials:</strong> You agree to
                  cooperate with barangay officials regarding any evidence you
                  submit and may be required to provide additional clarification
                  or testimony.
                </li>
                <li>
                  <strong>Use the Link Responsibly:</strong> Your access link
                  and PIN are confidential. You must not share them with
                  unauthorized persons.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">4.</span>
                DATA PRIVACY AND CONFIDENTIALITY
              </h3>
              <p className="text-sm leading-relaxed mb-2">
                Your use of this Portal is subject to the{" "}
                <strong>
                  Data Privacy Act of 2012 (Republic Act No. 10173)
                </strong>{" "}
                and related Philippine data protection regulations.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  How We Handle Your Data:
                </p>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    • <strong>Evidence Storage:</strong> All uploaded files are
                    stored securely in encrypted cloud storage accessible only
                    to authorized barangay staff and administrators.
                  </li>
                  <li>
                    • <strong>Personal Information:</strong> Your name, email
                    address, and contact details provided via the guest link are
                    stored in our database and associated with your uploads.
                  </li>
                  <li>
                    • <strong>Access Logging:</strong> We record your IP
                    address, access times, and upload activities for security
                    and audit purposes.
                  </li>
                  <li>
                    • <strong>Retention:</strong> Evidence is retained for the
                    duration of the case and for a legally required period
                    thereafter as mandated by barangay record-keeping policies.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">5.</span>
                FILE REQUIREMENTS AND LIMITATIONS
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-sm font-semibold mb-2">
                    Accepted File Types:
                  </p>
                  <p className="text-sm">Images: JPEG, JPG, PNG, GIF, WebP</p>
                  <p className="text-sm">Videos: MP4, MOV, AVI, WebM</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-sm font-semibold mb-2">Size Limits:</p>
                  <p className="text-sm">Maximum 5 MB per file</p>
                  <p className="text-sm">Up to 5 photos per guest link</p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-3">
                6. PROHIBITED CONTENT
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300 mb-2">
                You must NOT upload any of the following:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-red-800 dark:text-red-300 ml-2">
                <li>Illegal content that violates Philippine criminal law</li>
                <li>Defamatory or harassing content</li>
                <li>
                  Obscene or pornographic materials (unless directly relevant
                  and authorized)
                </li>
                <li>Irrelevant materials unrelated to the case</li>
                <li>Malicious files containing viruses or malware</li>
                <li>Copyrighted material without permission</li>
              </ul>
              <p className="text-sm text-red-900 dark:text-red-200 font-semibold mt-3">
                Violation may result in immediate access revocation and referral
                to law enforcement.
              </p>
            </div>

            {/* Remaining sections in compact format */}
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  7. INTELLECTUAL PROPERTY
                </h3>
                <p className="leading-relaxed">
                  By uploading evidence, you grant the Barangay Government a
                  non-exclusive, royalty-free, perpetual license to use the
                  materials for case management and legal proceedings while
                  retaining ownership rights.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  8. SYSTEM SECURITY
                </h3>
                <p className="leading-relaxed">
                  While we implement industry-standard security measures
                  (encrypted storage, HTTPS, access controls), we cannot
                  guarantee absolute security. You acknowledge the inherent
                  risks of electronic data transmission.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  9. LIMITATION OF LIABILITY
                </h3>
                <p className="leading-relaxed">
                  To the fullest extent permitted by law, the Barangay
                  Government is not liable for indirect, incidental, or
                  consequential damages arising from your use of this Portal.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  10. MODIFICATION OF TERMS
                </h3>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time.
                  Changes are effective immediately upon posting. Continued use
                  constitutes acceptance.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  11. GOVERNING LAW
                </h3>
                <p className="leading-relaxed">
                  These Terms are governed by Philippine law. Disputes are
                  subject to barangay dispute resolution mechanisms and
                  Philippine courts.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  12. CONTACT INFORMATION
                </h3>
                <p className="leading-relaxed">
                  For questions or technical support, contact your barangay
                  secretary or the staff member who sent you the guest link.
                </p>
              </div>
            </div>

            {/* Final Acknowledgment */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-bold text-green-900 dark:text-green-200 mb-2">
                13. ACKNOWLEDGMENT
              </h3>
              <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                By checking the &quot;I agree to the Terms and Conditions&quot;
                box and clicking &quot;Access Portal&quot;, you acknowledge
                that:
              </p>
              <ul className="list-decimal list-inside space-y-1 text-sm text-green-800 dark:text-green-300 mt-2 ml-2">
                <li>
                  You have read and understood these Terms in their entirety
                </li>
                <li>You agree to be bound by these Terms</li>
                <li>You are authorized to upload evidence on your behalf</li>
                <li>
                  The evidence you upload is truthful, authentic, and relevant
                </li>
                <li>
                  Your acceptance is recorded with a timestamp for legal
                  purposes
                </li>
              </ul>
            </div>

            <p className="text-center text-sm italic text-gray-500 dark:text-gray-400 pt-4">
              Thank you for your cooperation in the barangay&apos;s case
              management process.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Effective Date: {TERMS_EFFECTIVE_DATE} • Version {TERMS_VERSION}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
