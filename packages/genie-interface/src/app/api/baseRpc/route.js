import { BASE_SEPOLIA_RPC } from "@lib/keys";

export async function POST(request) {
  const body = await request.json();

  try {
    const response = await fetch(BASE_SEPOLIA_RPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to fetch from RPC endpoint" }, { status: 500 });
  }
}
