import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate and download a Karat360 Gold Jewellery Tax Invoice PDF
 * @param {Object} invoice - The invoice data object
 */
export const downloadInvoicePDF = (invoice) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Luxury Gold Bar
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Secondary Deep Gold Bar
  doc.setFillColor(180, 83, 9); // Amber-700
  doc.rect(0, 6, pageWidth, 1.5, 'F');

  // Company Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('KARAT360', 14, 20);

  doc.setTextColor(217, 119, 6); // Amber-600
  doc.text('JEWELLERS', 62, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Certified BIS Hallmarked Gold & Diamond Ornaments', 14, 26);
  doc.text('104, Zaveri Bazaar, Kalbadevi, Mumbai - 400002, Maharashtra', 14, 31);
  doc.text('GSTIN: 27AABCK3601J1ZX | Contact: +91 98765 43210 | info@karat360.com', 14, 36);

  // Invoice Title Box (Right Side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text('TAX INVOICE', pageWidth - 14, 20, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Invoice No: ${invoice.invoiceNumber || invoice.id}`, pageWidth - 14, 27, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${invoice.date || new Date().toISOString().slice(0, 10)}`, pageWidth - 14, 32, { align: 'right' });
  doc.text(`Due Date: ${invoice.dueDate || 'Immediate'}`, pageWidth - 14, 37, { align: 'right' });

  // Status Badge in PDF
  const status = (invoice.status || 'PAID').toUpperCase();
  let badgeColor = [16, 185, 129]; // Emerald
  if (status === 'PENDING' || status === 'PARTIALLY PAID') badgeColor = [245, 158, 11]; // Amber
  if (status === 'OVERDUE') badgeColor = [239, 68, 68]; // Red

  doc.setFillColor(...badgeColor);
  doc.roundedRect(pageWidth - 46, 41, 32, 6, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(status, pageWidth - 30, 45.2, { align: 'center' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 50, pageWidth - 14, 50);

  // Billing To / Customer Details Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(217, 119, 6);
  doc.text('BILLED TO (BUYER DETAILS):', 14, 56);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.customer?.name || invoice.customerName || 'Valued Client', 14, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Phone: ${invoice.customer?.phone || invoice.customerPhone || 'N/A'}`, 14, 67);
  doc.text(`Email: ${invoice.customer?.email || invoice.customerEmail || 'N/A'}`, 14, 72);
  doc.text(`City: ${invoice.customer?.city || invoice.customerCity || 'Mumbai'}`, 14, 77);

  // Payment Details Info Box (Right Side)
  doc.setFillColor(254, 243, 199, 0.5); // Warm light gold tint
  doc.roundedRect(pageWidth - 85, 54, 71, 26, 2, 2, 'F');
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - 85, 54, 71, 26, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('PAYMENT SUMMARY', pageWidth - 80, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Payment Mode: ${invoice.paymentMethod || 'UPI / Bank Transfer'}`, pageWidth - 80, 66);
  doc.text(`Transaction Ref: ${invoice.transactionRef || 'TRX-' + Math.floor(100000 + Math.random() * 900000)}`, pageWidth - 80, 71);
  doc.text(`Hallmark License: BIS-MH-440912`, pageWidth - 80, 76);

  // Line Items Table
  const tableData = (invoice.items || []).map((item, idx) => [
    idx + 1,
    item.name || 'Gold Ornament',
    item.purity || '22K (91.6%)',
    item.huid || 'HUID-91823',
    `${Number(item.grossWeight || item.weight || 0).toFixed(2)}g`,
    `${Number(item.netWeight || item.weight || 0).toFixed(2)}g`,
    `INR ${Number(item.rate || 0).toLocaleString('en-IN')}`,
    `INR ${Number(item.makingCharges || 0).toLocaleString('en-IN')}`,
    `INR ${Number(item.total || item.amount || 0).toLocaleString('en-IN')}`,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [
      ['#', 'Item Description', 'Purity', 'HUID', 'Gross Wt', 'Net Wt', 'Rate/g', 'Making', 'Amount'],
    ],
    body: tableData.length > 0 ? tableData : [
      [1, '22K Traditional Bridal Necklace', '22K (91.6%)', 'HUID-92811', '32.40g', '32.00g', 'INR 6,950', 'INR 18,000', 'INR 2,40,400']
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [217, 119, 6], // Amber-600
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 42 },
      2: { halign: 'center', cellWidth: 22 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 16 },
      5: { halign: 'right', cellWidth: 16 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'right', cellWidth: 18 },
      8: { halign: 'right', cellWidth: 24, fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = doc.lastAutoTable?.finalY || 130;

  // Calculation Breakdown Box
  const subtotal = invoice.subtotal || invoice.totalAmount || 240400;
  const gstRate = invoice.gstRate ?? 3; // Standard 3% for Gold Jewellery in India
  const gstAmount = invoice.gstAmount ?? Math.round((subtotal * gstRate) / 100);
  const discount = invoice.discount || 0;
  const grandTotal = invoice.grandTotal || (subtotal + gstAmount - discount);

  const calcX = pageWidth - 90;
  let currentY = finalY + 8;

  // Left Note Box: BIS Hallmark & Terms
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, calcX - 22, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, calcX - 22, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.text('CERTIFICATE & TERMS OF SALE:', 18, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('1. All gold jewellery items are guaranteed 100% BIS Hallmarked (HUID compliant).', 18, currentY + 12);
  doc.text('2. Valuation is governed by bullion spot rates plus making charges & 3% GST.', 18, currentY + 17);
  doc.text('3. Buyback / exchange guaranteed at prevailing market gold rates subject to test.', 18, currentY + 22);
  doc.text('4. This invoice serves as proof of legal ownership and hallmark authenticity.', 18, currentY + 27);
  doc.text('5. Subject to Mumbai jurisdiction only.', 18, currentY + 32);

  // Right Side Totals Table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  doc.text('Subtotal (Net Weight + Making):', calcX, currentY + 5);
  doc.text(`INR ${Number(subtotal).toLocaleString('en-IN')}`, pageWidth - 14, currentY + 5, { align: 'right' });

  doc.text(`GST (CGST 1.5% + SGST 1.5% = 3%):`, calcX, currentY + 12);
  doc.text(`INR ${Number(gstAmount).toLocaleString('en-IN')}`, pageWidth - 14, currentY + 12, { align: 'right' });

  if (discount > 0) {
    doc.text('Discount / Promotional Rebate:', calcX, currentY + 19);
    doc.setTextColor(22, 163, 74);
    doc.text(`- INR ${Number(discount).toLocaleString('en-IN')}`, pageWidth - 14, currentY + 19, { align: 'right' });
    currentY += 7;
  }

  // Grand Total Banner
  const totalBoxY = currentY + 18;
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.roundedRect(calcX - 4, totalBoxY - 5, pageWidth - calcX - 6, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(calcX - 4, totalBoxY - 5, pageWidth - calcX - 6, 12, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(146, 64, 14); // Amber-800
  doc.text('GRAND TOTAL:', calcX, totalBoxY + 3);
  doc.text(`INR ${Number(grandTotal).toLocaleString('en-IN')}`, pageWidth - 14, totalBoxY + 3, { align: 'right' });

  // Signatures Section at Bottom
  const sigY = pageHeight - 32;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(14, sigY + 12, 60, sigY + 12);
  doc.line(pageWidth - 70, sigY + 12, pageWidth - 14, sigY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Customer's Signature", 22, sigY + 16);
  doc.text("For KARAT360 JEWELLERS", pageWidth - 65, sigY + 16);
  doc.text('(Authorized Signatory & Seal)', pageWidth - 61, sigY + 20);

  // Bottom Footer Gold Bar
  doc.setFillColor(245, 158, 11);
  doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

  // Trigger browser download
  const filename = `${invoice.invoiceNumber || 'Invoice'}_${(invoice.customer?.name || invoice.customerName || 'Customer').replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
};
