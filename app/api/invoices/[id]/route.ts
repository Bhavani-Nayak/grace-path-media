import { NextRequest, NextResponse } from "next/server";
import { getInvoice, getInvoiceByOrderId } from "@/services/invoice-service";
import { generateInvoicePdf } from "@/services/invoice-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get("uid") || "guest";
    const format = searchParams.get("format") || "json";

    let invoice = await getInvoice(uid, id);
    if (!invoice) {
      invoice = await getInvoiceByOrderId(id);
    }

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // ─── PDF format ───
    if (format === "pdf") {
      const pdfBuffer = generateInvoicePdf(invoice);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
          "Content-Length": pdfBuffer.length.toString(),
        },
      });
    }

    // ─── HTML format (printable view) ───
    if (format === "html") {
      const formattedTotal = (invoice.totalAmount / 100).toFixed(2);
      const itemsHtml = invoice.items
        .map(
          (item) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
          </tr>`
        )
        .join("");

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1e293b; padding: 40px 20px; margin: 0; }
            .container { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #c5a059; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1a1d20; }
            .logo span { color: #c5a059; }
            .status { background: #dcfce7; color: #15803d; font-weight: 700; padding: 6px 14px; border-radius: 20px; font-size: 13px; text-transform: uppercase; }
            .details { margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th { background: #faf5e8; color: #1a1d20; text-align: left; padding: 12px; font-size: 13px; font-weight: 700; border-bottom: 2px solid #c5a059; }
            .table th:last-child { text-align: right; }
            .total-section { text-align: right; font-size: 18px; font-weight: bold; color: #1a1d20; margin-top: 20px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
            .actions { text-align: center; margin-top: 30px; }
            .btn { display: inline-block; padding: 12px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px; cursor: pointer; border: none; }
            .btn-gold { background: linear-gradient(135deg, #c5a059, #d4b06a); color: #1a1d20; }
            .btn-gold:hover { opacity: 0.9; }
            @media print { body { background: #fff; padding: 0; } .container { box-shadow: none; border: none; } .actions { display: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Grace Path <span>Media</span></div>
              <div class="status">${invoice.status}</div>
            </div>
            
            <div class="details">
              <div>
                <strong>Billed To:</strong><br/>
                ${invoice.customerEmail}<br/>
              </div>
              <div style="text-align: right;">
                <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br/>
                <strong>Order ID:</strong> ${invoice.orderId}<br/>
                <strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                <strong>Payment Method:</strong> ${invoice.paymentMethod}
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-section">
              Total Paid: $${formattedTotal} ${invoice.currency}
            </div>

            <div class="actions">
              <a class="btn btn-gold" href="/api/invoices/${invoice.invoiceNumber}?uid=${invoice.uid}&format=pdf">
                ⬇ Download PDF Invoice
              </a>
            </div>

            <div class="footer">
              Thank you for your purchase with Grace Path Media.<br/>
              If you have questions regarding this invoice, please contact support@gracepathmedia.com.
            </div>
          </div>
        </body>
        </html>
      `;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // ─── JSON format (default) ───
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Fetch invoice error:", error);
    return NextResponse.json(
      { error: "Failed to load invoice" },
      { status: 500 }
    );
  }
}
