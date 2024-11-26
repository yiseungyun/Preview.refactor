import { Module } from "@nestjs/common";
import { SigServerGateway } from "@/signaling-server/sig-server.gateway";

@Module({
    providers: [SigServerGateway],
})
export class SigServerModule {}
