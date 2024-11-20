import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { QuestionList } from "./question-list.entity";

@Entity()
export class Question {
    private static CONTENT_MAX_LEN = 20;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: Question.CONTENT_MAX_LEN })
    content: string;

    @Column()
    index: number;

    @Column()
    questionListId: number;

    @ManyToOne(() => QuestionList, (questionList) => questionList.questions)
    questionList: QuestionList;
}
