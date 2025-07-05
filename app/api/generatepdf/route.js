import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // ✅ Load the rendered HTML from your test paper page
    await page.goto('http://localhost:3000/dashboard/testpaper', {
      waitUntil: 'networkidle0',
    });

    // ✅ Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    // ✅ Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=test-paper.pdf',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
