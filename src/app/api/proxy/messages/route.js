import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const agentUrl = process.env.AGENT_URL || "http://127.0.0.1:8000";
    const targetUrl = `${agentUrl}/messages`;

    console.log(`[PROXY] Proxying request to: ${targetUrl}`);
    console.log("[PROXY] Payload:", JSON.stringify(body));

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log(`[PROXY] Response status: ${response.status}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[PROXY] Error (${response.status}):`, errorText);
        
        // Provide helpful error messages
        if (response.status === 404) {
          return NextResponse.json({ 
            error: "Python API endpoint not found", 
            details: `The endpoint ${targetUrl} returned 404. Please ensure your Python server is running and the /messages endpoint exists.`,
            pythonError: errorText 
          }, { status: 404 });
        }
        
        return NextResponse.json({ 
          error: `External API Error: ${response.status}`, 
          details: errorText 
        }, { status: response.status });
    }

    const data = await response.json();
    console.log("[PROXY] Success response:", JSON.stringify(data).substring(0, 200));
    return NextResponse.json(data);

  } catch (error) {
    console.error("[PROXY] Internal Error:", error.message);
    
    // Check if it's a connection error
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: "Cannot connect to Python server", 
        details: `Failed to connect to ${process.env.AGENT_URL || "http://127.0.0.1:8000"}. Please ensure your Python server is running.`
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: "Internal Proxy Error", 
      details: error.message 
    }, { status: 500 });
  }
}
