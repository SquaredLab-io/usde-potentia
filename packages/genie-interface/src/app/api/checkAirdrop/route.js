import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  try {
    const originalResp = await fetch("https://sql-faucet.squaredlabs.io/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const originalData = await originalResp.json();

    return NextResponse.json(originalData, { status: originalResp.status });
  } catch (error) {
    console.error("Error in proxy:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
