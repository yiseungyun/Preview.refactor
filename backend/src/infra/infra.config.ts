import "dotenv/config";

export const gatewayConfig = {
    cors: {
        origin: process.env.DOMAIN || "*",
    },
};

export const redisConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 50,
    enableReadyCheck: false,
};
