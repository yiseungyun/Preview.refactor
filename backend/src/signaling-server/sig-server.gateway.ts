import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { EMIT_EVENT, LISTEN_EVENT } from "@/signaling-server/sig-server.event";
import { gatewayConfig } from "@/infra/infra.config";

@WebSocketGateway(gatewayConfig)
export class SigServerGateway {
    @WebSocketServer()
    private server: Server;

    @SubscribeMessage(LISTEN_EVENT.OFFER)
    handleOffer(
        @MessageBody()
        data: {
            offerReceiveID: string;
            sdp: any;
            offerSendID: string;
            offerSendNickname: string;
        }
    ) {
        this.server.to(data.offerReceiveID).emit(EMIT_EVENT.OFFER, {
            sdp: data.sdp,
            offerSendID: data.offerSendID,
            offerSendNickname: data.offerSendNickname,
        });
    }

    @SubscribeMessage(LISTEN_EVENT.ANSWER)
    handleAnswer(
        @MessageBody()
        data: {
            answerReceiveID: string;
            sdp: any;
            answerSendID: string;
        }
    ) {
        this.server.to(data.answerReceiveID).emit(EMIT_EVENT.ANSWER, {
            sdp: data.sdp,
            answerSendID: data.answerSendID,
        });
    }

    @SubscribeMessage(LISTEN_EVENT.CANDIDATE)
    handleCandidate(
        @MessageBody()
        data: {
            candidateReceiveID: string;
            candidate: any;
            candidateSendID: string;
        }
    ) {
        this.server.to(data.candidateReceiveID).emit(EMIT_EVENT.CANDIDATE, {
            candidate: data.candidate,
            candidateSendID: data.candidateSendID,
        });
    }
}
