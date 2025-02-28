export interface QuestionList {
  id: number;
  title: string;
  usage: number;
  isStarred?: boolean;
  questionCount: number;
  categoryNames: string[];
}
