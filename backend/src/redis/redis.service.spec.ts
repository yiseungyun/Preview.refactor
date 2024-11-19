import { Test, TestingModule } from "@nestjs/testing";
import { RedisService } from "./redis.service";

// Mock 함수들 생성
const mockSet = jest.fn().mockResolvedValue("OK");
const mockGet = jest.fn();
const mockTtl = jest.fn();
const mockExpire = jest.fn();
const mockHget = jest.fn();
const mockHset = jest.fn();
const mockDel = jest.fn();

const mockScan = jest.fn().mockImplementation(() => {
    return Promise.resolve(["0", ["key1", "key2"]]); // 배열 형태로 반환
});

const mockMget = jest.fn().mockImplementation(() => {
    return Promise.resolve(["value1", "value2"]); // 배열 형태로 반환
});

// Redis 모듈 모킹
jest.mock("ioredis", () => {
    return {
        default: jest.fn().mockImplementation(() => ({
            set: mockSet,
            get: mockGet,
            ttl: mockTtl,
            expire: mockExpire,
            scan: mockScan,
            hget: mockHget,
            hset: mockHset,
            del: mockDel,
            mget: mockMget,
        })),
    };
});

describe("RedisService", () => {
    let redisService: RedisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RedisService],
        }).compile();

        redisService = module.get<RedisService>(RedisService);

        // 각 테스트 전에 모든 mock 함수 초기화
        jest.clearAllMocks();
    });

    describe("set", () => {
        it("문자열 값을 저장해야 한다", async () => {
            const key = "test-key";
            const value = "test-value";
            const ttl = 3600;

            await redisService.set(key, value, ttl);

            expect(mockSet).toHaveBeenCalledWith(key, value, "KEEPTTL");
            expect(mockExpire).toHaveBeenCalledWith(key, ttl);
        });

        it("객체를 JSON 문자열로 변환하여 저장해야 한다", async () => {
            const key = "test-key";
            const value = { name: "test" };
            const ttl = 3600;

            await redisService.set(key, value, ttl);

            expect(mockSet).toHaveBeenCalledWith(
                key,
                JSON.stringify(value),
                "KEEPTTL"
            );
            expect(mockExpire).toHaveBeenCalledWith(key, ttl);
        });
    });

    describe("get", () => {
        it("저장된 값을 조회해야 한다", async () => {
            const key = "test-key";
            const value = "test-value";
            mockGet.mockResolvedValue(value);

            const result = await redisService.get(key);

            expect(mockGet).toHaveBeenCalledWith(key);
            expect(result).toBe(value);
        });
    });

    describe("getTTL", () => {
        it("키의 TTL을 반환해야 한다", async () => {
            const key = "test-key";
            const ttlValue = 3600;
            mockTtl.mockResolvedValue(ttlValue);

            const result = await redisService.getTTL(key);

            expect(mockTtl).toHaveBeenCalledWith(key);
            expect(result).toBe(ttlValue);
        });
    });

    describe("getKeys", () => {
        it("패턴에 맞는 모든 키를 반환해야 한다", async () => {
            const query = "test*";
            mockScan
                .mockResolvedValueOnce(["1", ["key1", "key2"]])
                .mockResolvedValueOnce(["0", ["key3"]]);

            const result = await redisService.getKeys(query);

            expect(result).toEqual(["key1", "key2", "key3"]);
            expect(mockScan).toHaveBeenCalledWith(
                "0",
                "MATCH",
                query,
                "COUNT",
                "100"
            );
        });
    });

    describe("getHashValueByField", () => {
        it("해시 필드의 값을 반환해야 한다", async () => {
            const key = "hash-key";
            const field = "field1";
            const value = "value1";
            mockHget.mockResolvedValue(value);

            const result = await redisService.getHashValueByField(key, field);

            expect(mockHget).toHaveBeenCalledWith(key, field);
            expect(result).toBe(value);
        });
    });

    describe("setHashValueByField", () => {
        it("해시 필드에 문자열 값을 저장해야 한다", async () => {
            const key = "hash-key";
            const field = "field1";
            const value = "test-value";

            await redisService.setHashValueByField(key, field, value);

            expect(mockHset).toHaveBeenCalledWith(key, field, value);
        });

        it("해시 필드에 객체를 JSON 문자열로 변환하여 저장해야 한다", async () => {
            const key = "hash-key";
            const field = "field1";
            const value = { test: "value" };

            await redisService.setHashValueByField(key, field, value);

            expect(mockHset).toHaveBeenCalledWith(
                key,
                field,
                JSON.stringify(value)
            );
        });
    });

    describe("delete", () => {
        it("키들을 삭제해야 한다", async () => {
            const keys = ["key1", "key2"];

            await redisService.delete(...keys);

            expect(mockDel).toHaveBeenCalledWith(...keys);
        });
    });

    describe("getValues", () => {
        it("키 패턴에 해당하는 모든 값을 반환해야 한다", async () => {
            const query = "test*";
            const keys = ["key1", "key2"];
            const values = ["value1", "value2"];

            mockScan.mockResolvedValueOnce(["0", keys]);
            mockMget.mockResolvedValue(values);

            const result = await redisService.getValues(query);

            expect(result).toEqual(values);
        });

        it("키가 없을 경우 null을 반환해야 한다", async () => {
            const query = "test*";
            mockScan.mockResolvedValueOnce(["0", []]);

            const result = await redisService.getValues(query);

            expect(result).toBeNull();
        });
    });

    describe("getMap", () => {
        it("객체 타입으로 맵을 반환해야 한다", async () => {
            const query = "test*";
            const keys = ["key1", "key2"];
            const values = ['{"value":1}', '{"value":2}'];

            // getKeys 모킹
            mockScan.mockResolvedValueOnce(["0", keys]);
            // getValues를 위한 mget 모킹
            mockMget.mockResolvedValueOnce(values);

            const result = await redisService.getMap(query);

            expect(result).toEqual({
                key1: { value: 1 },
                key2: { value: 2 },
            });
        });

        it("primitive 타입으로 맵을 반환해야 한다", async () => {
            const query = "test*";
            const keys = ["key1", "key2"];
            const values = ["value1", "value2"];

            // getKeys 모킹
            mockScan.mockResolvedValueOnce(["0", keys]);
            // getValues를 위한 mget 모킹
            mockMget.mockResolvedValueOnce(values);

            const result = await redisService.getMap(query, "primitive");

            expect(result).toEqual({
                key1: "value1",
                key2: "value2",
            });
        });

        it("값이 없을 경우 null을 반환해야 한다", async () => {
            const query = "test*";

            // getKeys가 빈 배열을 반환하도록 모킹
            mockScan.mockResolvedValueOnce(["0", []]);

            // getValues가 null을 반환하도록 모킹
            mockMget.mockResolvedValueOnce(null);
            
            const result = await redisService.getMap(query);

            expect(result).toBeNull();
        });
    });
});
