import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // ... other methods

  afterInit() {
    // Initialization logic here
  }

  handleDisconnect(client: Socket) {
    // Handling client disconnection here
  }
}
