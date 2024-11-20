import { Test, TestingModule } from "@nestjs/testing";
import { QuestionListService } from "./question-list.service";

describe("QuestionService", () => {
    let service: QuestionListService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuestionListService],
        }).compile();

        service = module.get<QuestionListService>(QuestionListService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
