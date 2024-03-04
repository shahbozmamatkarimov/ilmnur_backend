// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: { origin: '*', credentials: true } })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   handleConnection(client: any) {
//     // Handle connection event
//   }

//   handleDisconnect(client: any) {
//     // Handle disconnection event
//   }

//   @SubscribeMessage('message')
//   handleMessage(
//     @MessageBody() data: string,
//     @ConnectedSocket() client: Socket,
//   ) {
//     // Handle received message
//     this.server.emit('message', data); // Broadcast the message to all connected clients
//   }
// }
