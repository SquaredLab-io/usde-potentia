import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { type, text } = await request.json();

  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      pass: process.env.NEXT_PUBLIC_SMTP_USER_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      to: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      subject: `Hey, there's a new Feedback: ${type}`,
      text: text,
      html: `<p><strong>Feedback Type:</strong> ${type}</p><p><strong>Feedback:</strong> ${text}</p>`
    });

    return NextResponse.json({ message: "Feedback sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send feedback" }, { status: 500 });
  }
}
