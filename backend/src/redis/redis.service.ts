import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { redisConfig } from "../config/redis.config";

@Injectable()
export class RedisService {
    private readonly client: Redis = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
    });

    async set(key: string, value: any, ttl: number = 0) {
        if (typeof value === "object") value = JSON.stringify(value);

        await this.client.set(key, value, "KEEPTTL");
        await this.client.expire(key, ttl);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async getTTL(key: string) {
        return this.client.ttl(key);
    }

    async getKeys(query: string) {
        const keys: string[] = [];
        let cursor = "0";

        do {
            const [nextCursor, matchedKeys] = await this.client.scan(
                cursor,
                "MATCH",
                query,
                "COUNT",
                "100"
            );
            cursor = nextCursor;
            keys.push(...matchedKeys);
        } while (cursor !== "0");
        return keys;
    }

    async delete(...keys: string[]) {
        return this.client.del(...keys);
    }

    async getValues(query: string) {
        const keys = await this.getKeys(query);
        if (!keys.length) return null;
        return this.client.mget(keys);
    }

    async getMap(query: string, valueType: "object" | "primitive" = "object") {
        const keys = await this.getKeys(query);
        const values = await this.getValues(query);
        if (!values) return null;

        return keys.reduce((acc, key, index) => {
            acc[key] =
                valueType === "object"
                    ? JSON.parse(values[index])
                    : values[index];
            return acc;
        }, {});
    }
}
