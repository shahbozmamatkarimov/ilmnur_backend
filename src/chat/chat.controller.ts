import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { ChatDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { SearchDto } from './dto/search.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

@ApiTags('chat')
@WebSocketGateway({ cors: { origin: '*', credentials: true } }) // cors
@Controller('chat')
export class ChatController
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
    // Handle connection
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected from chat:', client.id);
    // Handle disconnection
  }

  @ApiOperation({ summary: 'Create a new chat' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
        },
        icon: {
          type: 'number',
        },
        user_id: {
          type: 'number',
        },
        recipient_id: {
          type: 'number',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
        file_type: {
          type: 'object',
          properties: {
            size: {
              type: 'number',
            },
            type: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  // @UseGuards(AuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() chatDto: ChatDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.chatService.create(chatDto, file);
  }

  @ApiOperation({ summary: 'Get all chats' })
  // @UseGuards(AuthGuard)
  @SubscribeMessage('getAll/chats')
  async findAll(
    @MessageBody() { page }: { page: number },
    @ConnectedSocket() client: Socket,
  ) {
    const chats = await this.chatService.findAll(page);
    this.server.emit('chats', chats);
  }

  @ApiOperation({ summary: 'Get chat by ID' })
  @UseGuards(AuthGuard)
  @SubscribeMessage('getById/chats')
  async findById(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    const chat = await this.chatService.findById(id);
    client.emit('getById', chat);
  }

  @ApiOperation({ summary: 'Update chat by ID' })
  @UseGuards(AuthGuard)
  @SubscribeMessage('update/chats')
  async update(
    @MessageBody() { id, chat }: { id: string; chat: ChatDto },
    @ConnectedSocket() client: Socket,
  ) {
    const updated_chat = await this.chatService.update(id, chat);
    client.emit('updated', updated_chat);
    if (updated_chat.status !== 404) {
      this.server.emit('listener');
    }
  }

  @ApiOperation({ summary: 'Delete chat by ID' })
  @UseGuards(AuthGuard)
  @SubscribeMessage('delete/chats')
  async delete(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    const deleted_chat = await this.chatService.delete(id);
    this.server.emit('deleted', deleted_chat);
    if (deleted_chat.status !== 404) {
      this.server.emit('listener');
    }
  }
}
