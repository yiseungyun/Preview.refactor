import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { QuestionList } from "./question-list.entity";

@Entity()
export class Category {
    private static NAME_MAX_LEN = 20;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: Category.NAME_MAX_LEN })
    name: string;

    @ManyToMany(() => QuestionList, (questionList) => questionList.categories)
    questionLists: QuestionList[];
}
