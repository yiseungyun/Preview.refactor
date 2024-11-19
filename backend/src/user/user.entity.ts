import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    private static LOGIN_ID_MAX_LEN = 20;
    private static PASSWORD_HASH_MAX_LEN = 256;
    private static USERNAME_MAX_LEN = 20;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: User.LOGIN_ID_MAX_LEN, nullable: true, unique: true })
    loginId: string;

    @Column({ length: User.PASSWORD_HASH_MAX_LEN, nullable: true })
    passwordHash: string;

    @Column({ length: User.USERNAME_MAX_LEN, unique: true })
    username: string;

    @Column({ nullable: true, unique: true })
    githubId: number;
}
