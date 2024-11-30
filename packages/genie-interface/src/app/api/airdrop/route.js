import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  try {
    const response = await fetch("https://sql-faucet.squaredlabs.io/airdrop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in proxy:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
