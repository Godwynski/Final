"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, FileText, Clock } from "lucide-react";
import Link from "next/link";
import Mermaid from "@/components/Mermaid";

export default function DocsPage() {
  const [readmeContent, setReadmeContent] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // Fetch README on client side
    fetch("/README.md")
      .then((res) => res.text())
      .then((content) => {
        setReadmeContent(content);
        setLastUpdated(
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      })
      .catch((err) => console.error("Failed to load README:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Flowbite-style Navbar */}
      <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Link href="/" className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Documentation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Documentation Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!readmeContent ? (
          <div className="w-full p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div role="status" className="mb-6">
                  <svg
                    aria-hidden="true"
                    className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Loading documentation...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Info Banner */}
            <div
              className="flex p-4 mb-6 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">
                  Complete System Documentation
                </span>
                <div className="mt-1 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated: {lastUpdated}
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
              <article
                className="prose prose-slate max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-8 prose-h1:pb-5 prose-h1:border-b-2 prose-h1:border-blue-200
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:text-blue-900
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-gray-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-700 hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-em:text-gray-600 prose-em:italic
                prose-code:text-pink-700 prose-code:bg-pink-50 prose-code:px-2.5 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-pink-200
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:border prose-pre:border-gray-700
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:text-gray-700
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:text-gray-700
                prose-li:text-gray-700 prose-li:mb-2 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:my-5 prose-blockquote:rounded-r
                prose-table:border-collapse prose-table:w-full prose-table:mb-6 prose-table:text-sm prose-table:shadow-sm prose-table:rounded-lg
                prose-thead:bg-blue-50
                prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-gray-900
                prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700
                prose-tr:border-b prose-tr:border-gray-200 prose-tr:hover:bg-gray-50
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6 prose-img:border prose-img:border-gray-200
                prose-hr:border-gray-300 prose-hr:my-10
              "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({
                      inline,
                      className,
                      children,
                      ...props
                    }: React.HTMLAttributes<HTMLElement> & {
                      inline?: boolean;
                    }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "";

                      // Check if it's a mermaid code block
                      if (!inline && language === "mermaid") {
                        return (
                          <Mermaid
                            chart={String(children).replace(/\n$/, "")}
                          />
                        );
                      }

                      // Regular inline code
                      if (inline) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }

                      // Regular code block
                      return (
                        <div className="my-6">
                          <pre
                            className={`${className} bg-gray-900 text-gray-100 rounded-lg p-5 overflow-x-auto border border-gray-700`}
                            {...props}
                          >
                            <code className={className}>{children}</code>
                          </pre>
                        </div>
                      );
                    },
                    // Prevent p tag wrapping for certain elements
                    p({ children }) {
                      return (
                        <div className="mb-4 text-gray-700 leading-relaxed">
                          {children}
                        </div>
                      );
                    },
                  }}
                >
                  {readmeContent}
                </ReactMarkdown>
              </article>
            </div>
          </>
        )}

        {/* Flowbite Footer */}
        <footer className="mt-8">
          <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                BlotterSys™
              </span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Modern Barangay Incident Management System
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
