import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class PaginateQueryDto {
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value ? parseInt(value) : 1))
    page?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value ? parseInt(value) : 4))
    limit?: number;

    @Expose()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value || "usage:DESC")
    sortBy?: string;

    @Expose()
    @IsOptional()
    @IsString()
    category?: string;
}
