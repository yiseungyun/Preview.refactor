import { Test, TestingModule } from "@nestjs/testing";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

describe("RoomController", () => {
    let controller: RoomController;
    let roomService: RoomService;

    // RoomService Mock 생성
    const mockRoomService = {
        getPublicRoom: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoomController],
            providers: [
                {
                    provide: RoomService,
                    useValue: mockRoomService,
                },
            ],
        }).compile();

        controller = module.get<RoomController>(RoomController);
        roomService = module.get<RoomService>(RoomService);
    });

    describe("getPublicRooms", () => {
        it("공개방 목록을 반환해야 한다", async () => {
            // Given
            const mockRooms = {
                room1: {
                    title: "Room 1",
                    status: "PUBLIC",
                    maxParticipants: 5,
                },
                room2: {
                    title: "Room 2",
                    status: "PUBLIC",
                    maxParticipants: 3,
                },
            };
            mockRoomService.getPublicRoom.mockResolvedValue(mockRooms);

            // When
            const result = await controller.getPublicRooms();

            // Then
            expect(roomService.getPublicRoom).toHaveBeenCalled();
            expect(result).toEqual(mockRooms);
        });

        it("빈 방 목록을 반환해야 한다", async () => {
            // Given
            const mockEmptyRooms = {};
            mockRoomService.getPublicRoom.mockResolvedValue(mockEmptyRooms);

            // When
            const result = await controller.getPublicRooms();

            // Then
            expect(roomService.getPublicRoom).toHaveBeenCalled();
            expect(result).toEqual({});
        });

        it("서비스 에러 발생 시 예외를 던져야 한다", async () => {
            // Given
            const error = new Error("Service error");
            mockRoomService.getPublicRoom.mockRejectedValue(error);

            // When & Then
            await expect(controller.getPublicRooms()).rejects.toThrow(error);
        });
    });
});
