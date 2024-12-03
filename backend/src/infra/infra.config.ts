import "dotenv/config";

export const gatewayConfig = {
    cors: {
        origin: process.env.DOMAIN || "*",
    },
};

export const redisConfig = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
};
