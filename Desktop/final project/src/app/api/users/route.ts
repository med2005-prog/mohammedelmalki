import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    
    const isBusiness = searchParams.get("isBusiness");
    const query: any = {};
    
    if (isBusiness === "true") query.isBusiness = true;

    const users = await User.find(query).select("-password");

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
