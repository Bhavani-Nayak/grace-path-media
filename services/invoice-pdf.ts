import type { InvoiceRecord } from "./invoice-service";

/**
 * Generate a downloadable PDF invoice buffer from an InvoiceRecord.
 * (DISABLED FOR STATIC SITE MODE)
 */
export async function generateInvoicePdf(invoice: InvoiceRecord): Promise<Buffer> {
  return Buffer.from("");
}

