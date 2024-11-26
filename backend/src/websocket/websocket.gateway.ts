import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import { WebsocketService } from "@/websocket/websocket.service";
import { WebsocketRepository } from "@/websocket/websocket.repository";

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    private server: Server;

    private logger: Logger = new Logger("Websocket");

    public constructor(
        private readonly websocketService: WebsocketService,
        private readonly websocketRepository: WebsocketRepository
    ) {}

    public afterInit() {
        const pubClient = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        });

        const subClient = pubClient.duplicate();

        const redisAdapter = createAdapter(pubClient, subClient);
        this.server.adapter(redisAdapter);

        this.websocketService.setRedisClient(pubClient);
        this.websocketService.setServer(this.server);
    }

    public async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        await this.websocketRepository.register(client);
    }

    public async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        await this.websocketRepository.clean(client);
    }
}
