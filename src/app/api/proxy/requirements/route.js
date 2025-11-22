import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const agentUrl = process.env.AGENT_URL || "http://127.0.0.1:8000";
    
    const response = await fetch(`${agentUrl}/requirements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `External API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
