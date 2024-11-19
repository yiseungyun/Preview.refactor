import { Test, TestingModule } from "@nestjs/testing";
import { QuestionListController } from "./question-list.controller";

describe("QuestionController", () => {
    let controller: QuestionListController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuestionListController],
        }).compile();

        controller = module.get<QuestionListController>(QuestionListController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
