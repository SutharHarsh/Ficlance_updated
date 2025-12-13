import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, data: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session.user,
      error: null,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: err.message },
      { status: 500 }
    );
  }
}
