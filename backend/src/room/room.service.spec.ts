import { Test, TestingModule } from "@nestjs/testing";
import { RoomService } from "./room.service";
import { RoomRepository } from "./room.repository";
import { CreateRoomDto } from "./dto/create-room.dto";

describe("RoomService", () => {
    let roomService: RoomService;

    // Mock Repository 생성
    const mockRoomRepository = {
        getAllRoom: jest.fn(),
        findMyRoomId: jest.fn(),
        createRoom: jest.fn(),
        addUser: jest.fn(),
        getRoomById: jest.fn(),
        getRoomMemberConnection: jest.fn(),
        checkHost: jest.fn(),
        deleteUser: jest.fn(),
        getRoomMemberCount: jest.fn(),
        getNewHost: jest.fn(),
        setNewHost: jest.fn(),
        deleteRoom: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomService,
                {
                    provide: RoomRepository,
                    useValue: mockRoomRepository,
                },
            ],
        }).compile();

        roomService = module.get<RoomService>(RoomService);
    });

    describe("getPublicRoom", () => {
        it("공개방만 반환해야 한다", async () => {
            const mockRooms = {
                room1: { status: "PUBLIC", title: "Room 1" },
                room2: { status: "PRIVATE", title: "Room 2" },
            };
            mockRoomRepository.getAllRoom.mockResolvedValue(mockRooms);

            const result = await roomService.getPublicRoom();

            expect(result.room1).toBeDefined();
            expect(result.room2).toBeUndefined();
        });
    });

    describe("createRoom", () => {
        it("새로운 방을 생성해야 한다", async () => {
            const createRoomDto: CreateRoomDto = {
                status: "PUBLIC",
                title: "Test Room",
                socketId: "socket-123",
                nickname: "User1",
            };
            const mockRoomId = "room-123";

            mockRoomRepository.createRoom.mockResolvedValue(mockRoomId);

            const result = await roomService.createRoom(createRoomDto);

            expect(result.roomId).toBe(mockRoomId);
            expect(result.roomMetadata.title).toBe(createRoomDto.title);
            expect(mockRoomRepository.addUser).toHaveBeenCalled();
        });
    });

    describe("joinRoom", () => {
        it("존재하는 방에 참가할 수 있어야 한다", async () => {
            const mockRoom = { id: "room-123", title: "Test Room" };
            mockRoomRepository.getRoomById.mockResolvedValue(mockRoom);

            const result = await roomService.joinRoom(
                "socket-123",
                "room-123",
                "User1"
            );

            expect(result).toBe(mockRoom);
            expect(mockRoomRepository.addUser).toHaveBeenCalled();
        });

        it("존재하지 않는 방에 참가할 수 없어야 한다", async () => {
            mockRoomRepository.getRoomById.mockResolvedValue(null);

            const result = await roomService.joinRoom(
                "socket-123",
                "invalid-room",
                "User1"
            );

            expect(result).toBeNull();
        });
    });

    describe("leaveRoom", () => {
        it("방을 떠날 수 있어야 한다", async () => {
            const mockRoomId = "room-123";
            mockRoomRepository.findMyRoomId.mockResolvedValue(mockRoomId);
            mockRoomRepository.getRoomMemberCount.mockResolvedValue(2);

            const result = await roomService.leaveRoom("socket-123");

            expect(mockRoomRepository.deleteUser).toHaveBeenCalled();
            expect(result).toBe(2);
        });
    });

    describe("getRoomMemberConnection", () => {
        it("자신을 제외한 멤버 연결 정보를 반환해야 한다", async () => {
            const mockConnections = {
                "socket-123": { nickname: "User1" },
                "socket-456": { nickname: "User2" },
            };
            mockRoomRepository.getRoomMemberConnection.mockResolvedValue(
                mockConnections
            );

            const result = await roomService.getRoomMemberConnection(
                "socket-123",
                "room-123"
            );

            expect(result["socket-123"]).toBeUndefined();
            expect(result["socket-456"]).toBeDefined();
        });
    });
});
