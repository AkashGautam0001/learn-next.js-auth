import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bycrupt from "bcryptjs";
import jwt from "jsonwebtoken";
connect();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { email, password } = reqBody;

		//validation
		console.log(reqBody);
		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json(
				{ error: "User does not exists" },
				{ status: 400 }
			);
		}
		console.log("user : ", user);
		const validPassword = await bycrupt.compare(password, user.password);
		if (!validPassword) {
			return NextResponse.json(
				{ error: "Password does not match" },
				{ status: 401 }
			);
		}
		const tokenData = {
			id: user._id,
			username: user.username,
			email: user.email,
		};
		const token = await jwt.sign(tokenData, process.env.TOKEN_SCERET!, {
			expiresIn: "id",
		});
		const response = NextResponse.json({
			message: "logged in success",
			success: true,
		});
		response.cookies.set("token", token, {
			httpOnly: true,
		});

		return response;
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
