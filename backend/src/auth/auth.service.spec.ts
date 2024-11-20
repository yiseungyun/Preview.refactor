import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserRepository } from "../user/user.repository";
import { Profile } from "passport-github";

// typeorm-transactional 모킹
jest.mock("typeorm-transactional", () => ({
    Transactional: () => () => ({}),
    runOnTransactionCommit: () => () => ({}),
    runOnTransactionRollback: () => () => ({}),
    runOnTransactionComplete: () => () => ({}),
    initializeTransactionalContext: () => ({}),
}));

describe("AuthService", () => {
    let authService: AuthService;
    let userRepository: UserRepository;

    // Mock GitHub 프로필 데이터
    const mockGithubProfile: Profile = {
        id: "12345",
        displayName: "Test User",
        username: "testuser",
        profileUrl: "https://abcd/",
        photos: [],
        provider: "github",
        _raw: "",
        _json: {},
    };

    // Mock 유저 데이터
    const mockUser = {
        id: 1,
        loginId: null,
        passwordHash: null,
        githubId: 12345,
        username: "camper_12345",
    };

    beforeEach(async () => {
        // Mock Repository 생성
        const mockUserRepository = {
            getUserByGithubId: jest.fn(),
            createUser: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe("githubLogin", () => {
        it("기존 사용자가 있을 경우 해당 사용자를 반환해야 한다", async () => {
            // Given
            jest.spyOn(userRepository, "getUserByGithubId").mockResolvedValue(
                mockUser
            );

            // When
            const result = await authService.githubLogin(mockGithubProfile);

            // Then
            expect(userRepository.getUserByGithubId).toHaveBeenCalledWith(
                parseInt(mockGithubProfile.id)
            );
            expect(result).toEqual(mockUser);
            expect(userRepository.createUser).not.toHaveBeenCalled();
        });

        it("새로운 사용자의 경우 새 계정을 생성해야 한다", async () => {
            // Given
            jest.spyOn(userRepository, "getUserByGithubId").mockResolvedValue(
                null
            );
            jest.spyOn(userRepository, "createUser").mockResolvedValue(
                mockUser
            );

            // When
            const result = await authService.githubLogin(mockGithubProfile);

            // Then
            expect(userRepository.getUserByGithubId).toHaveBeenCalledWith(
                parseInt(mockGithubProfile.id)
            );
            expect(userRepository.createUser).toHaveBeenCalledWith({
                githubId: parseInt(mockGithubProfile.id),
                username: `camper_${mockGithubProfile.id}`,
            });
            expect(result).toEqual(mockUser);
        });

        it("getUserByGithubId 에러 발생 시 예외를 던져야 한다", async () => {
            // Given
            const error = new Error("Database error");
            jest.spyOn(userRepository, "getUserByGithubId").mockRejectedValue(
                error
            );

            // When & Then
            await expect(
                authService.githubLogin(mockGithubProfile)
            ).rejects.toThrow(error);
        });

        it("createUser 에러 발생 시 예외를 던져야 한다", async () => {
            // Given
            const error = new Error("Database error");
            jest.spyOn(userRepository, "getUserByGithubId").mockResolvedValue(
                null
            );
            jest.spyOn(userRepository, "createUser").mockRejectedValue(error);

            // When & Then
            await expect(
                authService.githubLogin(mockGithubProfile)
            ).rejects.toThrow(error);
        });
    });
});
