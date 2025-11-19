import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, data: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const newToken = jwt.sign(
      {
        sub: session.user.id,
        email: session.user.email,
        providerLinked: session.user.providerLinked || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json({
      success: true,
      data: { token: newToken },
      error: null,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: err.message },
      { status: 500 }
    );
  }
}
