import { Test, TestingModule } from "@nestjs/testing";
import { RoomGateway } from "./room.gateway";
import { RoomService } from "./room.service";

describe("RoomGateway", () => {
    let gateway: RoomGateway;
    let roomService: RoomService;

    // Mock Socket.io 서버와 클라이언트
    let mockServer: any;
    let mockClient: any;

    beforeEach(async () => {
        // Mock Service 생성
        const mockRoomService = {
            createRoom: jest.fn(),
            joinRoom: jest.fn(),
            getRoomId: jest.fn(),
            checkHost: jest.fn(),
            leaveRoom: jest.fn(),
            deleteRoom: jest.fn(),
            delegateHost: jest.fn(),
            finishRoom: jest.fn(),
            checkAvailable: jest.fn(),
            getRoomMemberConnection: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomGateway,
                {
                    provide: RoomService,
                    useValue: mockRoomService,
                },
            ],
        }).compile();

        gateway = module.get<RoomGateway>(RoomGateway);
        roomService = module.get<RoomService>(RoomService);

        // Mock Socket.io 서버 설정
        mockServer = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };
        gateway.server = mockServer as any;

        // Mock 클라이언트 설정
        mockClient = {
            id: "test-client-id",
            join: jest.fn(),
            emit: jest.fn(),
        };
    });

    describe("handleCreateRoom", () => {
        it("방 생성 성공시 이벤트를 발생시켜야 한다", async () => {
            const createRoomData = {
                title: "Test Room",
                nickname: "Test User",
                status: "PUBLIC",
                maxParticipants: 5,
            };

            const mockRoomData = {
                roomId: "test-room-id",
                roomMetadata: {
                    title: createRoomData.title,
                    status: createRoomData.status,
                    maxParticipants: createRoomData.maxParticipants,
                },
            };

            roomService.createRoom = jest.fn().mockResolvedValue(mockRoomData);

            await gateway.handleCreateRoom(mockClient, createRoomData);

            expect(mockClient.join).toHaveBeenCalledWith(mockRoomData.roomId);
            expect(mockServer.to).toHaveBeenCalledWith(mockRoomData.roomId);
            expect(mockServer.emit).toHaveBeenCalledWith(
                "room_created",
                mockRoomData
            );
        });
    });

    describe("handleJoinRoom", () => {
        it("방이 가득 찼을 경우 ROOM_FULL 이벤트를 발생시켜야 한다", async () => {
            const joinRoomData = {
                roomId: "test-room-id",
                nickname: "Test User",
            };

            roomService.checkAvailable = jest.fn().mockResolvedValue(false);

            await gateway.handleJoinRoom(mockClient, joinRoomData);

            expect(mockClient.emit).toHaveBeenCalledWith("room_full");
        });

        it("방 참가 성공시 ALL_USERS 이벤트를 발생시켜야 한다", async () => {
            const joinRoomData = {
                roomId: "test-room-id",
                nickname: "Test User",
            };

            const mockRoom = {
                id: "test-room-id",
                title: "Test Room",
            };

            const mockUsers = {
                "user-1": { nickname: "User 1" },
            };

            roomService.checkAvailable = jest.fn().mockResolvedValue(true);
            roomService.joinRoom = jest.fn().mockResolvedValue(mockRoom);
            roomService.getRoomMemberConnection = jest
                .fn()
                .mockResolvedValue(mockUsers);

            await gateway.handleJoinRoom(mockClient, joinRoomData);

            expect(mockClient.join).toHaveBeenCalledWith(joinRoomData.roomId);
            expect(mockClient.emit).toHaveBeenCalledWith("all_users", {
                roomMetadata: mockRoom,
                users: mockUsers,
            });
        });
    });

    describe("handleLeaveRoom", () => {
        it("마지막 사용자가 나갈 경우 방을 삭제해야 한다", async () => {
            roomService.getRoomId = jest.fn().mockResolvedValue("test-room-id");
            roomService.checkHost = jest.fn().mockResolvedValue(false);
            roomService.leaveRoom = jest.fn().mockResolvedValue(0);

            await gateway.handleLeaveRoom(mockClient);

            expect(roomService.deleteRoom).toHaveBeenCalled();
        });

        it("호스트가 나갈 경우 새로운 호스트를 지정해야 한다", async () => {
            const mockRoomId = "test-room-id";
            const mockNewHost = {
                socketId: "new-host-id",
                nickname: "New Host",
            };

            roomService.getRoomId = jest.fn().mockResolvedValue(mockRoomId);
            roomService.checkHost = jest.fn().mockResolvedValue(true);
            roomService.leaveRoom = jest.fn().mockResolvedValue(1);
            roomService.delegateHost = jest.fn().mockResolvedValue(mockNewHost);

            await gateway.handleLeaveRoom(mockClient);

            expect(mockServer.to).toHaveBeenCalledWith(mockRoomId);
            expect(mockServer.emit).toHaveBeenCalledWith("master_changed", {
                masterSocketId: mockNewHost.socketId,
                masterNickname: mockNewHost.nickname,
            });
        });
    });

    describe("handleFinishRoom", () => {
        it("방 종료시 ROOM_FINISHED 이벤트를 발생시켜야 한다", async () => {
            const mockRoomId = "test-room-id";
            roomService.finishRoom = jest.fn().mockResolvedValue(mockRoomId);

            await gateway.handleFinishRoom(mockClient);

            expect(mockServer.to).toHaveBeenCalledWith(mockRoomId);
            expect(mockServer.emit).toHaveBeenCalledWith("room_finished");
        });
    });
});
