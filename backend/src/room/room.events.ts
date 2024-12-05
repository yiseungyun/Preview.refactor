export const LISTEN_EVENT = {
    CREATE: "client:room__create",
    JOIN: "client:room__join",
    LEAVE: "client:room__leave",
    FINISH: "client:room__finish",
    REACTION: "client:room__reaction",
    START_PROGRESS: "client:study__start_progress",
    STOP_PROGRESS: "client:study__stop_progress",
    NEXT_QUESTION: "client:study__next_question",
    CURRENT_INDEX: "client:study__current_index",
    MOVE_INDEX: "client:study__move_index",
} as const;

export const EMIT_EVENT = {
    CREATE: "server:room__create",
    QUIT: "server:room__quit",
    FULL: "server:room__full",
    NOT_FOUND: "server:room__not_found",
    JOIN: "server:room__join",
    IN_PROGRESS: "server:room__progress",
    FINISH: "server:room__finish",
    CHANGE_HOST: "server:room__change_host",
    REACTION: "server:room__reaction",
    START_PROGRESS: "server:study__start_progress",
    STOP_PROGRESS: "server:study__stop_progress",
    NEXT_QUESTION: "server:study__next_question",
    CURRENT_INDEX: "server:study__current_index",
    MOVE_INDEX: "server:study__move_index",
} as const;
