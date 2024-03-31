import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
export const sendEmail = async ({ email, emailType, userId }: any) => {
	try {
		const hashedToken = await bcryptjs.hash(userId.toString(), 10);
		if (emailType === "VERIFY") {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000,
			});
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			});
		}
		var transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "3956aab690c8e4", // ❌
				pass: "9bb1f6894d6ce5", // ❌
			},
		});

		const mailOptions = {
			from: "akashgautam@google.com",
			to: email,
			subject:
				emailType === "VERIFY"
					? "Verify Your email"
					: "reset your password",
			html: `<p>Click <a href = "${
				process.env.DOMAIN
			}/verifyemail?token=${hashedToken}"> here </a> to ${
				emailType === "Verify"
					? "verify your email"
					: "reset your password"
			} or copy and paste the link below in your browser. <br> ${
				process.env.DOMAIN
			}/verifyemail?token=${hashedToken} </p>`,
		};

		await transporter.sendMail(mailOptions);
	} catch (error: any) {
		throw new Error(error.message);
	}
};
