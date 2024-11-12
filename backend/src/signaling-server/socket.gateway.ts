import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*", // CORS 설정
    },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(socket: any) {
        console.log(`Client connected in signaling server: ${socket.id}`);
    }

    handleDisconnect(socket: any) {
        console.log(`Client disconnected signaling server: ${socket.id}`);
    }

    @SubscribeMessage("offer")
    handleOffer(
        @MessageBody()
        data: {
            offerReceiveID: string;
            sdp: any;
            offerSendID: string;
            offerSendNickname: string;
        }
    ) {
        this.server.to(data.offerReceiveID).emit("getOffer", {
            sdp: data.sdp,
            offerSendID: data.offerSendID,
            offerSendNickname: data.offerSendNickname,
        });
    }

    @SubscribeMessage("answer")
    handleAnswer(
        @MessageBody()
        data: {
            answerReceiveID: string;
            sdp: any;
            answerSendID: string;
        }
    ) {
        this.server.to(data.answerReceiveID).emit("getAnswer", {
            sdp: data.sdp,
            answerSendID: data.answerSendID,
        });
    }

    @SubscribeMessage("candidate")
    handleCandidate(
        @MessageBody()
        data: {
            candidateReceiveID: string;
            candidate: any;
            candidateSendID: string;
        }
    ) {
        this.server.to(data.candidateReceiveID).emit("getCandidate", {
            candidate: data.candidate,
            candidateSendID: data.candidateSendID,
        });
    }
}
