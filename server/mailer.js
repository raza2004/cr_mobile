import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import Client from "./models/clientModel.js";

// Ported from CR_Client/src/helpers/sendgrid.tsx. Links point at the mobile
// app's deep-link scheme instead of the web app.
export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await Client.findByIdAndUpdate(userId, {
        verifyEmailToken: hashedToken,
        verifyEmailTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await Client.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const base = process.env.APP_LINK_BASE || "crmobile://";
    const token = encodeURIComponent(hashedToken);
    const link =
      emailType === "VERIFY"
        ? `${base}verifyEmail?token=${token}`
        : `${base}setPassword?token=${token}`;

    return await transport.sendMail({
      from: "hello@checkroom.io",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
          ? `<p>Click <a href="${link}">here</a> to verify your email or open this link on your phone: <br> ${link}</p>`
          : `<p>Click <a href="${link}">here</a> to reset your password or open this link on your phone: <br> ${link}</p>`,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Error sending confirmation email");
  }
};
