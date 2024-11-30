import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents
} from "@squaredlab-io/sql-channel";
import { Bar, SubscribeBarsCallback } from "../lib/datafeedTypes";

export class SqlWS {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  public channelToSubscription = new Map<
    string,
    { callbacks: SubscribeBarsCallback[] }
  >();
  public lastBarCache?: Bar;

  constructor(url: string) {
    this.socket = io(url);

    this.socket.on("connect", () => {
      console.log("connected");
      console.log("[socket] Connected to SQL channel");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[socket] Disconnected:", reason);
    });

    this.socket.on("UpdateTradingViewPrice5M", (data) => {
      const { id, updates, isLong } = data;

      const val = this.channelToSubscription.get(id);
      if (val) {
        val.callbacks.forEach((cb) => {
          let update = isLong ? updates.longUpdated : updates.shortUpdated;
          //   console.log(update);

          const bar: Bar = {
            time: update.timestamp * 1000,
            open: update.open,
            high: update.high,
            low: update.low,
            close: update.close
          };

          cb(bar);
        });
      }
    });
  }
}
