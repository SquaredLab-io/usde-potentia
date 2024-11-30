import { COINGECKO_API_KEY } from "@lib/keys";

// Makes requests to Coingecko API
export async function makeMarketDataApiRequest(path: string) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/${path}`, {
      method: "GET",
      headers: { Accept: "application/json", "x-cg-demo-api-key": COINGECKO_API_KEY }
    });
    return response.json();
  } catch (error: any) {
    throw new Error(`Coingecko request error: ${error.status}`);
  }
}
