import { IsInt, IsNumberString, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class PaginateMetaDto {
    @Expose()
    @IsInt()
    itemsPerPage: number;

    @Expose()
    @IsInt()
    totalItems: number;

    @Expose()
    @IsNumberString()
    currentPage: string;

    @Expose()
    @IsInt()
    totalPages: number;

    @Expose()
    @IsString()
    sortBy: string;
}
