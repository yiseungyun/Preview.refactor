import { SelectQueryBuilder } from "typeorm";

export class PaginateDto {
    queryBuilder: SelectQueryBuilder<any>;
    skip: number;
    take: number;
    field: string;
    direction: "ASC" | "DESC";
}