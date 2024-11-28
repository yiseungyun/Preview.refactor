import "dotenv/config";

export const websocketConfig = {
    cors: {
        origin: process.env.DOMAIN || "*",
    },
};
