import nodemailer from "nodemailer";

export const sendEmail= async ({
  to,
  cc,
  bcc,
  subject = "DashBoard-EngAhmedKamel",
  text,
  html,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host:"smtp.google.com",
    port:465,
    secure:true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD, // استخدم App Password
    },
    tls: {
      rejectUnauthorized: false, // احذفها في الإنتاج
    },
  }); // ← هنا كان ناقص القوس

  const info = await transporter.sendMail({
    from: `"Welcome in DashBoard 👻" <${process.env.EMAIL}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments,
  });

  return info.rejected.length==0?true:false;
};
