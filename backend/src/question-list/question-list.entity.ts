import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "../user/user.entity";
import { Question } from "./question.entity";
import { Category } from "./category.entity";

@Entity()
export class QuestionList {
    private static QUESTION_LIST_TITLE_MAX_LEN = 100;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: QuestionList.QUESTION_LIST_TITLE_MAX_LEN })
    title: string;

    @Column()
    isPublic: boolean;

    @Column({ default: 0 })
    usage: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.questionLists)
    user: User;

    @OneToMany(() => Question, (question) => question.questionList)
    questions: Question[];

    @ManyToMany(() => Category, (category) => category.questionLists, {
        cascade: true,
    })
    @JoinTable({
        name: "question_list_category",
        joinColumn: {
            name: "questionListId",
            referencedColumnName: "id",
        },
    })
    categories: Category[];
}
