import { jsPDF } from "jspdf";
import type { InvoiceRecord } from "./invoice-service";

/**
 * Generate a downloadable PDF invoice buffer from an InvoiceRecord.
 * Uses jsPDF for server-side PDF generation without browser dependency.
 */
export function generateInvoicePdf(invoice: InvoiceRecord): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Header: Grace Path Media Logo Text ───
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 29, 32); // #1a1d20
  doc.text("Grace Path", margin, y);
  doc.setTextColor(197, 160, 89); // #c5a059
  doc.text("Media", margin + doc.getTextWidth("Grace Path "), y);

  // Status badge
  const statusColor =
    invoice.status === "PAID"
      ? { r: 21, g: 128, b: 61 }
      : invoice.status === "REFUNDED"
      ? { r: 220, g: 38, b: 38 }
      : { r: 202, g: 138, b: 4 };
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const statusText = invoice.status;
  const statusWidth = doc.getTextWidth(statusText) + 12;
  const statusX = pageWidth - margin - statusWidth;
  doc.setFillColor(statusColor.r, statusColor.g, statusColor.b);
  doc.roundedRect(statusX, y - 6, statusWidth, 10, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, statusX + 6, y + 1);

  // Gold line separator
  y += 8;
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);

  // ─── Invoice Details ───
  y += 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // #64748b

  // Left column - Billed To
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 29, 32);
  doc.text("Billed To:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(invoice.customerEmail || "customer@example.com", margin, y + 6);

  // Right column - Invoice details
  const rightX = pageWidth - margin;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 29, 32);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, rightX, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Order ID: ${invoice.orderId}`, rightX, y + 6, { align: "right" });

  const dateStr = new Date(invoice.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Date: ${dateStr}`, rightX, y + 12, { align: "right" });
  doc.text(`Payment: ${invoice.paymentMethod}`, rightX, y + 18, { align: "right" });

  // ─── Items Table ───
  y += 32;

  // Table header
  doc.setFillColor(250, 245, 232); // #faf5e8
  doc.rect(margin, y, contentWidth, 10, "F");
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 10, pageWidth - margin, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 29, 32);
  doc.text("Item Description", margin + 4, y + 7);
  doc.text("Amount", pageWidth - margin - 4, y + 7, { align: "right" });

  y += 14;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  for (const item of invoice.items) {
    const itemPrice = `$${(item.price / 100).toFixed(2)}`;
    doc.text(item.title, margin + 4, y);
    doc.text(itemPrice, pageWidth - margin - 4, y, { align: "right" });

    // Row separator
    doc.setDrawColor(226, 232, 240); // #e2e8f0
    doc.setLineWidth(0.2);
    doc.line(margin, y + 4, pageWidth - margin, y + 4);

    y += 10;
  }

  // ─── Totals Section ───
  y += 4;
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - margin - 80, y, pageWidth - margin, y);

  y += 8;
  const formattedSubtotal = `$${(invoice.subtotal / 100).toFixed(2)}`;
  const formattedTax = `$${(invoice.tax / 100).toFixed(2)}`;
  const formattedTotal = `$${(invoice.totalAmount / 100).toFixed(2)}`;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", pageWidth - margin - 50, y);
  doc.text(formattedSubtotal, pageWidth - margin - 4, y, { align: "right" });

  y += 6;
  doc.text("Tax:", pageWidth - margin - 50, y);
  doc.text(formattedTax, pageWidth - margin - 4, y, { align: "right" });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 29, 32);
  doc.text("Total Paid:", pageWidth - margin - 50, y);
  doc.text(`${formattedTotal} ${invoice.currency}`, pageWidth - margin - 4, y, { align: "right" });

  // ─── Footer ───
  y = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text("Thank you for your purchase with Grace Path Media.", pageWidth / 2, y, { align: "center" });
  doc.text(
    "If you have questions regarding this invoice, please contact support@gracepathmedia.com.",
    pageWidth / 2,
    y + 5,
    { align: "center" }
  );

  // Return as Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
