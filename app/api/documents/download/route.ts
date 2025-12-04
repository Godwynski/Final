import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import puppeteer from 'puppeteer'
import { createElement } from 'react'
import SummonsForm from '@/components/documents/forms/SummonsForm'
import NoticeOfHearingForm from '@/components/documents/forms/NoticeOfHearingForm'
import CertificateToFileActionForm from '@/components/documents/forms/CertificateToFileActionForm'
import AmicableSettlementForm from '@/components/documents/forms/AmicableSettlementForm'
import ReferralForm from '@/components/documents/forms/ReferralForm'

// Simple function to render React elements to HTML string without react-dom/server
function renderElement(element: any): string {
    if (!element) return ''
    if (typeof element === 'string' || typeof element === 'number') return String(element)
    if (Array.isArray(element)) return element.map(renderElement).join('')

    const { type, props } = element

    if (!type) return ''
    if (typeof type === 'function') {
        return renderElement(type(props))
    }

    const { children, ...attributes } = props || {}
    const attrs = Object.entries(attributes || {})
        .filter(([key]) => key !== 'key' && key !== 'ref')
        .map(([key, value]) => {
            if (key === 'className') return `class="${value}"`
            if (typeof value === 'boolean') return value ? key : ''
            if (typeof value === 'string' || typeof value === 'number') return `${key}="${value}"`
            return ''
        })
        .filter(Boolean)
        .join(' ')

    const childrenHtml = children ? (Array.isArray(children) ? children : [children]).map(renderElement).join('') : ''

    // Self-closing tags
    if (['img', 'br', 'hr', 'input', 'meta', 'link'].includes(type)) {
        return `<${type}${attrs ? ' ' + attrs : ''} />`
    }

    return `<${type}${attrs ? ' ' + attrs : ''}>${childrenHtml}</${type}>`
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const caseId = searchParams.get('caseId')
    const formType = searchParams.get('formType')

    if (!caseId || !formType) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    try {
        const supabase = await createClient()

        // Verify user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch case data
        const { data: caseData, error: caseError } = await supabase
            .from('cases')
            .select('*')
            .eq('id', caseId)
            .single()

        if (caseError || !caseData) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 })
        }

        // Fetch parties
        const { data: parties } = await supabase
            .from('involved_parties')
            .select('*')
            .eq('case_id', caseId)

        // Fetch settings
        const { data: settings } = await supabase
            .from('barangay_settings')
            .select('*')
            .single()

        const complainants = parties?.filter(p => p.type === 'Complainant') || []
        const respondents = parties?.filter(p => p.type === 'Respondent') || []

        // Select the appropriate form component
        let FormComponent: any
        let filename = ''

        switch (formType) {
            case 'summons':
                FormComponent = SummonsForm
                filename = `Summons_${caseData.case_number || caseId}.pdf`
                break
            case 'hearing':
                FormComponent = NoticeOfHearingForm
                filename = `Notice_of_Hearing_${caseData.case_number || caseId}.pdf`
                break
            case 'cfa':
                FormComponent = CertificateToFileActionForm
                filename = `Certificate_to_File_Action_${caseData.case_number || caseId}.pdf`
                break
            case 'settlement':
                FormComponent = AmicableSettlementForm
                filename = `Amicable_Settlement_${caseData.case_number || caseId}.pdf`
                break
            case 'referral':
                FormComponent = ReferralForm
                filename = `Referral_${caseData.case_number || caseId}.pdf`
                break
            default:
                return NextResponse.json({ error: 'Invalid form type' }, { status: 400 })
        }

        // Render component to HTML string using our custom renderer
        const formElement = createElement(FormComponent, {
            caseData,
            complainants,
            respondents,
            settings
        })
        const formHtml = renderElement(formElement)


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
        * {
            box-sizing: border-box;
        }
        .print\\:block { display: block; }
        .print\\:hidden { display: none; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        .underline { text-decoration: underline; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .border-b { border-bottom: 1px solid #000; }
        .border-b-2 { border-bottom: 2px solid #000; }
        .w-full { width: 100%; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-base { font-size: 1rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .leading-tight { line-height: 1.25; }
        .leading-relaxed { line-height: 1.625; }
    </style>
</head>
<body>
    ${formHtml}
</body>
</html>
        `

        // Launch Puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })

        const page = await browser.newPage()
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        })

        await browser.close()

        // Return PDF as download
        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pdfBuffer.length.toString()
            }
        })


    } catch (error: any) {
        console.error('PDF Generation Error:', error)
        return NextResponse.json({
            error: 'Failed to generate PDF',
            details: error.message
        }, { status: 500 })
    }
}
