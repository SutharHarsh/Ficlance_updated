import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function POST() {
  try {
    await signOut({ redirect: false });
    return NextResponse.json({ success: true, data: "Logged out", error: null });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: err.message },
      { status: 500 }
    );
  }
}
