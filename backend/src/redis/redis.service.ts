import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { redisConfig } from "../config/redis.config";

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
        });
    }
    getClient(): Redis {
        return this.client;
    }
}
