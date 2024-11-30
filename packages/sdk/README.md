# SDK

## How to run test?

```bash
pnpm tsx ./src/tests/fileName
```

## How to use?

```ts
const sdk = new PotentiaSdk(publicClient, walletClient, graphUrl, ponderUrl, sqlChannelUrl):

// For pool related functions.
sdk.pool.openPosition(...);
sdk.pool.closePosition(...);
sdk.pool.removeLiquidity(...);
sdk.pool.addLiquidity(...);
sdk.pool.getP(...);

```

### How to use DataFeed ?

```ts

import { ConfigurationData, PotentiaSdk } from "@squaredlab-io/sdk";
import { getPotentiaDataFeed } from "@squaredlab-io/sdk";


...
useEffect(() => {
    async function fetchData() {
      if (!potentia) return;
      console.log("potentia exists...");
      const widgetOptions: ChartingLibraryWidgetOptions = {
        // symbol: `Kraken:${selectedPool.symbol}` ?? "Kraken:USDC/USDT",
        datafeed: await getPotentiaDataFeed(potentia, ConfigurationData),

...

```

The last parameter in getPotentiaDataFeed is a boolean that indicates if the ponder should be use rather than subgraph.
