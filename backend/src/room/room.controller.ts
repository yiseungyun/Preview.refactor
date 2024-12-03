import { Controller, Get, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { RoomService } from "./room.service";
import { AllRoomQueryParamDto } from "@/room/dto";

@Controller("rooms")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    public async getPublicRoom(@Query() query: AllRoomQueryParamDto) {
        const rooms = await this.roomService.getPublicRoom(query.inProgress);
        return rooms.map((room) => ({
            ...room,
            connectionMap: undefined,
        }));
    }
}
