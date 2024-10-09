import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport"; // Import the SMTPTransport type

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    post: Number(process.env.EMAIL_PORT), // if secure false port = 587
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  } as SMTPTransport.Options);

  const mailOpts = {
    from: "E-shop App <trendx.ecommerce24@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOpts);
};

export default sendEmail;
