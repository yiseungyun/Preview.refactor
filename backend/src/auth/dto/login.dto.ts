import { IsNotEmpty, IsString } from "class-validator";

// TODO: 프론트에서 정의된 제약사항 이곳에서도 검증하도록 보완하기
export class LoginDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
