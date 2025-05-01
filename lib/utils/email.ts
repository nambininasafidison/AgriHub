import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderConfirmationEmail(to: string, order: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Confirmation de commande",
    text: `Votre commande ${order.id} a été confirmée. Merci pour votre achat !`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOrderStatusUpdateEmail(to: string, order: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Mise à jour de votre commande ${order.id}`,
    text: `Le statut de votre commande est maintenant : ${order.status}.`,
  };

  await transporter.sendMail(mailOptions);
}
