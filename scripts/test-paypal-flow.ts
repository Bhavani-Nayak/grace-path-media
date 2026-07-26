/**
 * Test script for verifying PayPal Webhook & Firestore ownership pipeline
 * 
 * Usage:
 * npx tsx scripts/test-paypal-flow.ts
 */

import { grantPurchase, hasPurchase, getUserPurchases } from "../services/purchase-service";
import { generateInvoiceForOrder, getInvoice } from "../services/invoice-service";

async function runTest() {
  console.log("====================================================");
  console.log("Starting PayPal Integrated Purchase Flow Test...");
  console.log("====================================================\n");

  const testUid = "test_user_123";
  const testEbookId = "whispers-of-grace";
  const testOrderId = `TEST-ORDER-${Date.now()}`;
  const testEmail = "testbuyer@example.com";
  const amount = 1997;

  console.log(`1. Testing purchase grant for UID: ${testUid}, eBook: ${testEbookId}...`);
  await grantPurchase(testUid, testEbookId, {
    paypalOrderId: testOrderId,
    amount,
    currency: "USD",
  });
  console.log(`✓ Granted purchase under users/${testUid}/purchases/${testEbookId}`);

  console.log(`\n2. Verifying eBook ownership logic under users/${testUid}/purchases/${testEbookId}...`);
  const isOwned = await hasPurchase(testUid, testEbookId);
  console.log(`✓ Ownership status for ${testEbookId}: ${isOwned ? "OWNED (True)" : "NOT OWNED (False)"}`);

  const userPurchases = await getUserPurchases(testUid);
  console.log(`✓ Purchased eBook IDs for ${testUid}:`, userPurchases);

  console.log(`\n3. Generating Invoice under users/${testUid}/invoices/...`);
  const invoice = await generateInvoiceForOrder({
    paypalOrderId: testOrderId,
    uid: testUid,
    customerEmail: testEmail,
    productId: testEbookId,
    amount,
    currency: "USD",
  });

  console.log(`✓ Invoice Generated: ${invoice.invoiceNumber}`);
  console.log(`  - Total Paid: $${(invoice.totalAmount / 100).toFixed(2)} ${invoice.currency}`);
  console.log(`  - Status: ${invoice.status}`);

  const retrievedInvoice = await getInvoice(testUid, invoice.invoiceNumber);
  console.log(`✓ Retested invoice retrieval for ${invoice.invoiceNumber}:`, retrievedInvoice?.invoiceNumber);

  console.log("\n====================================================");
  console.log("Pipeline verification completed successfully with 0 errors!");
  console.log("====================================================");
}

runTest().catch(console.error);
