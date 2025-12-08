import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import puppeteer from "puppeteer";
import { createElement } from "react";
import SummonsForm from "@/components/documents/forms/SummonsForm";
import NoticeOfHearingForm from "@/components/documents/forms/NoticeOfHearingForm";
import CertificateToFileActionForm from "@/components/documents/forms/CertificateToFileActionForm";
import AmicableSettlementForm from "@/components/documents/forms/AmicableSettlementForm";
import ReferralForm from "@/components/documents/forms/ReferralForm";
import AbstractForm from "@/components/documents/forms/AbstractForm";
import { Evidence } from "@/types";

// Simple function to render React elements to HTML string without react-dom/server
type ReactElementLike = {
  type: string | ((props: Record<string, unknown>) => ReactElementLike);
  props: Record<string, unknown>;
};

function renderElement(
  element:
    | ReactElementLike
    | string
    | number
    | null
    | undefined
    | Array<ReactElementLike | string | number>,
): string {
  if (!element) return "";
  if (typeof element === "string" || typeof element === "number")
    return String(element);
  if (Array.isArray(element)) return element.map(renderElement).join("");

  const { type, props } = element;

  if (!type) return "";
  if (typeof type === "function") {
    return renderElement(type(props));
  }

  const { children, ...attributes } = props || {};
  const attrs = Object.entries(attributes || {})
    .filter(([key]) => key !== "key" && key !== "ref")
    .map(([key, value]) => {
      if (key === "className") return `class="${value}"`;
      if (typeof value === "boolean") return value ? key : "";
      if (typeof value === "string" || typeof value === "number")
        return `${key}="${value}"`;
      return "";
    })
    .filter(Boolean)
    .join(" ");

  const childrenHtml = children
    ? (Array.isArray(children) ? children : [children])
        .map(renderElement)
        .join("")
    : "";

  // Self-closing tags
  if (["img", "br", "hr", "input", "meta", "link"].includes(type)) {
    return `<${type}${attrs ? " " + attrs : ""} />`;
  }

  return `<${type}${attrs ? " " + attrs : ""}>${childrenHtml}</${type}>`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const caseId = searchParams.get("caseId");
  const formType = searchParams.get("formType");
  const includeEvidence = searchParams.get("includeEvidence") === "true";

  if (!caseId || !formType) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch case data
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("*")
      .eq("id", caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Fetch parties
    const { data: parties } = await supabase
      .from("involved_parties")
      .select("*")
      .eq("case_id", caseId);

    // Fetch settings
    const { data: settings } = await supabase
      .from("barangay_settings")
      .select("*")
      .single();

    const complainants = parties?.filter((p) => p.type === "Complainant") || [];
    const respondents = parties?.filter((p) => p.type === "Respondent") || [];

    // Select the appropriate form component (using type assertion for dynamic component selection)
    let FormComponent: React.ComponentType<Record<string, unknown>>;
    let filename = "";

    switch (formType) {
      case "summons":
        FormComponent = SummonsForm;
        filename = `Summons_${caseData.case_number || caseId}.pdf`;
        break;
      case "hearing":
        FormComponent = NoticeOfHearingForm;
        filename = `Notice_of_Hearing_${caseData.case_number || caseId}.pdf`;
        break;
      case "cfa":
        FormComponent = CertificateToFileActionForm;
        filename = `Certificate_to_File_Action_${caseData.case_number || caseId}.pdf`;
        break;
      case "settlement":
        FormComponent = AmicableSettlementForm;
        filename = `Amicable_Settlement_${caseData.case_number || caseId}.pdf`;
        break;
      case "referral":
        FormComponent = ReferralForm;
        filename = `Referral_${caseData.case_number || caseId}.pdf`;
        break;
      case "abstract":
        FormComponent = AbstractForm;
        filename = `Case_Abstract_${caseData.case_number || caseId}.pdf`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid form type" },
          { status: 400 },
        );
    }

    // Fetch evidence if needed for abstract form
    let evidence: Evidence[] = [];
    if (formType === "abstract" && includeEvidence) {
      const { data: evidenceData } = await supabase
        .from("evidence")
        .select("*")
        .eq("case_id", caseId);
      evidence = evidenceData || [];
    }

    // Render component to HTML string using our custom renderer
    let formElement;
    if (formType === "abstract") {
      formElement = createElement(FormComponent, {
        caseData,
        involvedParties: parties || [],
        settings,
        evidence,
      });
    } else {
      formElement = createElement(FormComponent, {
        caseData,
        complainants,
        respondents,
        settings,
      });
    }
    const formHtml = renderElement(formElement);

    // Create full HTML document with styles
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: Letter;
            margin: 0.5in;
        }
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 0;
            color: #000;
            background: white;
        }
        * { box-sizing: border-box; }
        img { max-width: 100%; }
        .print\\:block { display: block; }
        .print\\:hidden { display: none; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-justify { text-align: justify; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .font-black { font-weight: 900; }
        .font-serif { font-family: 'Times New Roman', serif; }
        .font-sans { font-family: Arial, sans-serif; }
        .font-mono { font-family: monospace; }
        .uppercase { text-transform: uppercase; }
        .underline { text-decoration: underline; }
        .italic { font-style: italic; }
        .tracking-wide { letter-spacing: 0.025em; }
        .indent-8 { text-indent: 2rem; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }
        .mt-12 { margin-top: 3rem; }
        .mt-16 { margin-top: 4rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-12 { margin-bottom: 3rem; }
        .mb-16 { margin-bottom: 4rem; }
        .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ml-8 { margin-left: 2rem; }
        .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
        .pt-2 { padding-top: 0.5rem; }
        .pt-4 { padding-top: 1rem; }
        .pb-4 { padding-bottom: 1rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .px-28 { padding-left: 7rem; padding-right: 7rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .p-2 { padding: 0.5rem; }
        .p-4 { padding: 1rem; }
        .p-8 { padding: 2rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .flex { display: flex; }
        .inline-block { display: inline-block; }
        .block { display: block; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .items-start { align-items: flex-start; }
        .items-center { align-items: center; }
        .items-end { align-items: flex-end; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-12 { gap: 3rem; }
        .border { border: 1px solid #9ca3af; }
        .border-2 { border: 2px solid #000; }
        .border-t { border-top: 1px solid #000; }
        .border-b { border-bottom: 1px solid #000; }
        .border-r { border-right: 1px solid #000; }
        .border-t-2 { border-top: 2px solid #000; }
        .border-b-2 { border-bottom: 2px solid #000; }
        .border-black { border-color: #000; }
        .border-gray-300 { border-color: #d1d5db; }
        .border-gray-400 { border-color: #9ca3af; }
        .border-dashed { border-style: dashed; }
        .rounded-full { border-radius: 9999px; }
        .w-full { width: 100%; }
        .w-20 { width: 5rem; }
        .w-24 { width: 6rem; }
        .w-32 { width: 8rem; }
        .w-48 { width: 12rem; }
        .w-1\\/2 { width: 50%; }
        .w-1\\/3 { width: 33.333%; }
        .w-2\\/3 { width: 66.666%; }
        .h-20 { height: 5rem; }
        .h-24 { height: 6rem; }
        .h-32 { height: 8rem; }
        .min-h-\\[100px\\] { min-height: 100px; }
        .min-h-\\[150px\\] { min-height: 150px; }
        .max-w-\\[210mm\\] { max-width: 210mm; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .min-h-screen { min-height: 100vh; }
        .bg-white { background: white; }
        .bg-gray-50 { background: #f9fafb; }
        .text-black { color: black; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-600 { color: #4b5563; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .list-disc { list-style-type: disc; }
        .list-inside { list-style-position: inside; }
        .text-\\[10px\\] { font-size: 10px; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-base { font-size: 1rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .leading-snug { line-height: 1.375; }
        .leading-tight { line-height: 1.25; }
        .leading-relaxed { line-height: 1.625; }
        .whitespace-pre-wrap { white-space: pre-wrap; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .object-contain { object-fit: contain; }
        .object-cover { object-fit: cover; }
        .rounded-lg { border-radius: 0.5rem; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .top-0 { top: 0; }
        .left-0 { left: 0; }
        .right-0 { right: 0; }
        .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
    </style>
</head>
<body>
    ${formHtml}
</body>
</html>
        `;

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    });

    await browser.close();

    // Return PDF as download
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: (error as Error).message || String(error),
      },
      { status: 500 },
    );
  }
}
