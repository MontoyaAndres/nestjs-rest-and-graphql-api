import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Client, Server } from "socket.io";

@WebSocketGateway(4000)
export class AppGateway {
  @WebSocketServer()
  wss: Server;

  private logger = new Logger("AppGateway");

  @SubscribeMessage("client")
  onEvent(client: Client, data: string): string {
    this.logger.log("New client connected" + client);

    return "Successfully connected to server" + data;
  }
}
