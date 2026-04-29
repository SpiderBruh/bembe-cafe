import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers for local development
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, ...data } = req.body;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "le.advena08@gmail.com";

  try {
    if (type === 'order') {
      const { customerName, total, items, customerPhone } = data;
      const itemsHtml = items
        .map((item: any) => `<li>${item.name} x${item.qty} - £${item.price.toFixed(2)}</li>`)
        .join('');

      await resend.emails.send({
        from: "Bembe Cafe <notifications@bembecafe.com>",
        to: [RECIPIENT_EMAIL],
        subject: `New Order from ${customerName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2C1810; background-color: #FDFCF8;">
            <h1 style="color: #D4A373;">New Order Received!</h1>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <hr style="border: 0; border-top: 1px solid #E5E1D8;" />
            <h3>Items:</h3>
            <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
            <p style="font-size: 1.2em;"><strong>Total:</strong> £${total.toFixed(2)}</p>
            <hr style="border: 0; border-top: 1px solid #E5E1D8;" />
            <p style="font-size: 0.8em; color: #8C867D;">Processed by Bembe Cafe Digital</p>
          </div>
        `,
      });
    } else if (type === 'booking') {
      const { name, date, time, guests, phone } = data;
      await resend.emails.send({
        from: "Bembe Cafe <bookings@bembecafe.com>",
        to: [RECIPIENT_EMAIL],
        subject: `New Table Booking: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2C1810; background-color: #FDFCF8;">
            <h1 style="color: #D4A373;">New Booking Received!</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${guests}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <hr style="border: 0; border-top: 1px solid #E5E1D8;" />
            <p>Please confirm this booking in your admin panel.</p>
            <p style="font-size: 0.8em; color: #8C867D;">Processed by Bembe Cafe Digital</p>
          </div>
        `,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Resend Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
