import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuestionList } from "@/question-list/entity/question-list.entity";

export enum LoginType {
    LOCAL = "local",
    GITHUB = "github",
}

@Entity()
export class User {
    public static readonly URL_MAX_LEN = 320;
    public static readonly USERNAME_MAX_LEN = 20;
    private static LOGIN_ID_MAX_LEN = 20;
    private static PASSWORD_HASH_MAX_LEN = 256;
    private static REFRESH_TOKEN_MAX_LEN = 200;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: User.LOGIN_ID_MAX_LEN, nullable: true, unique: true })
    loginId: string;

    @Column({ length: User.PASSWORD_HASH_MAX_LEN, nullable: true })
    passwordHash: string;

    @Column({ length: User.USERNAME_MAX_LEN, unique: true })
    username: string;

    @Column({ length: User.REFRESH_TOKEN_MAX_LEN, nullable: true })
    refreshToken: string;

    @Column({ nullable: true, unique: true })
    githubId: number;

    @OneToMany(() => QuestionList, (questionList) => questionList.user, {
        cascade: true,
    })
    questionLists: QuestionList[];

    @ManyToMany(() => QuestionList, (questionList) => questionList.scrappedByUsers, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinTable({
        name: "user_question_list",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
    })
    scrappedQuestionLists: QuestionList[];

    @Column({
        type: "enum",
        enum: LoginType,
        default: LoginType.LOCAL,
    })
    loginType: LoginType;

    @Column({ length: User.URL_MAX_LEN, nullable: true })
    avatarUrl: string;
}
