import { PONDER_URL } from "@lib/keys";
import {
  cacheExchange,
  Client,
  createClient,
  fetchExchange,
  SSRExchange,
  ssrExchange
} from "urql";

/**
 * URQL Client and SSR Setup
 */
export default function getUrqlClient(): [Client, SSRExchange] {
  const ssr = ssrExchange({
    isClient: typeof window !== "undefined"
  });

  const client = createClient({
    url: PONDER_URL,
    exchanges: [cacheExchange, ssr, fetchExchange],
    suspense: true
  });

  return [client, ssr];
}
