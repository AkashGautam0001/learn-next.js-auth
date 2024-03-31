import mongoose from "mongoose";

export async function connect() {
	try {
		mongoose.connect(process.env.MONGO_URI!);
		const connection = mongoose.connection;
		connection.on("connected", () => {
			console.log("MONGODB connected");
		});
		connection.on("error", (error) => {
			console.log(
				"MONOGO connection error, please make sure db is up and running : ",
				error
			);
			process.exit();
		});
	} catch (error) {
		console.log("Something went wrong while connectinto DB", error);
	}
}
