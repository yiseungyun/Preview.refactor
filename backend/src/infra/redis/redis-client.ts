import Redis from "ioredis";
import "dotenv/config";
import { redisConfig } from "../infra.config";

export const redisClient = new Redis(redisConfig);

redisClient.on('error', (err) => {
  console.error(err);
})