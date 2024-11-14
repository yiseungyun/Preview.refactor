import { createHash } from "node:crypto";
import "dotenv/config";

let id = parseInt(process.env.SESSION_HASH_START);
export function generateRoomId() {
    return createHash("sha256")
        .update(id++ + process.env.SESSION_HASH)
        .digest("hex");
}