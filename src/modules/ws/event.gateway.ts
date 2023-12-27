import {
    Inject,
    Injectable,
    UnauthorizedException,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Server, Socket } from 'socket.io';

import { Logger } from 'winston';

import { MemberService } from '../circle/services';
import { WsAuthGuard } from '../user/guards/ws-auth.guard';

import { BadRequestTransformationFilter } from './common/BadRequestTransformation.filter';
import { GroupMessageDto } from './dtos/groupMessage.dto';
import { JoinDto } from './dtos/join.dto';
import { ConnectedEvent } from './events/connected.event';
import { WsService } from './services/ws.service';

@Injectable()
@UsePipes(new ValidationPipe())
@UseFilters(BadRequestTransformationFilter)
@UseGuards(WsAuthGuard)
@WebSocketGateway(3300, {
    cors: true,
    transports: ['polling', 'websocket'],
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly jwtService: JwtService,
        private readonly wsService: WsService,
        private readonly eventEmiter: EventEmitter2,
        private readonly memberService: MemberService,
    ) {}

    async afterInit(ws: Server) {
        this.wsService.setServer(ws);
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.headers.authorization.replace('Bearer ', '');
            const { sub } = (await this.jwtService.decode(token)) as any;
            client.user = {
                id: sub,
                lastActiveTime: client.handshake.issued,
                circles: new Map(), // 暂时不支持多端在线，每次建立连接都重置socket信息
            };
            this.wsService.addUserSocket(sub, client);
        } catch (error) {
            console.log('connection error');
            console.log(error);
            throw new UnauthorizedException();
        }

        this.logger.info(`user(${client.user.id}) connect`);
        console.log(`connect ${client.user.id}`);
        this.eventEmiter.emit(
            'ws.connected',
            new ConnectedEvent({
                userId: client.user.id,
            }),
        );
    }

    async handleDisconnect(client: Socket) {
        this.wsService.removeUserSocket(client.user.id);
        console.log('disconnect');
    }

    @SubscribeMessage('join')
    join(@ConnectedSocket() client: Socket, @MessageBody() data: JoinDto): void {
        console.log('join circle');
        console.log(data, client.user, typeof data);
        // is in circle
        if (!this.memberService.isMember(data.circleId, client.user.id)) {
            console.log(false);
            client.emit('error', 'not in circle');
        }

        client.join(`room:${data.circleId}`);
        client.user.circles.set(data.circleId, Date.now());
        client.emit('test');
        console.log(true);
    }

    @SubscribeMessage('heartbeat')
    heartbeat(@ConnectedSocket() client: Socket, @MessageBody() data: { circleId: string }): void {
        console.log(
            `heartbeat: ${client.user.id} : ${this.wsService.getUserSocketId(client.user.id)}`,
        );
        client.user.lastActiveTime = Date.now();
        client.user.circles.set(data.circleId, Date.now());
    }

    @SubscribeMessage('chat')
    chat(@ConnectedSocket() client: Socket, @MessageBody() message: GroupMessageDto): void {
        console.log('send message:');
        console.log(message);
        this.wsService.sendMessageToRoom(client, message);
    }
}
