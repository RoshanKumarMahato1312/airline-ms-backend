const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

async function generateTicketPdf(booking) {
  const qrCodeDataUrl = await QRCode.toDataURL(
    JSON.stringify({
      bookingId: booking._id,
      ticketCode: booking.ticketId || booking.ticketCode,
      seatNumber: booking.seatNumber
    })
  );

  const pdf = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks = [];

  pdf.on('data', (chunk) => chunks.push(chunk));

  const done = new Promise((resolve) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
  });

  pdf.fontSize(22).text('Airline Ticket', { align: 'center' });
  pdf.moveDown();
  pdf.fontSize(12).text(`Passenger: ${booking.passenger?.name || 'N/A'}`);
  pdf.text(`Flight Number: ${booking.flight?.flightNumber || 'N/A'}`);
  pdf.text(`Source: ${booking.flight?.source?.airportCode || booking.flight?.source?.airportName || 'N/A'}`);
  pdf.text(`Destination: ${booking.flight?.destination?.airportCode || booking.flight?.destination?.airportName || 'N/A'}`);
  pdf.text(`Seat Number: ${booking.seatNumber}`);
  pdf.text(`Booking ID: ${booking._id}`);
  pdf.text(`Boarding Time: ${booking.flight?.departureTime || 'N/A'}`);
  pdf.moveDown();
  pdf.text('QR Verification', { align: 'center' });
  pdf.image(qrCodeDataUrl, { fit: [140, 140], align: 'center' });
  pdf.end();

  return done;
}

module.exports = { generateTicketPdf };
