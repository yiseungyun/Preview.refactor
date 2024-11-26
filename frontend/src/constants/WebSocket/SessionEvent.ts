export const SESSION_EMIT_EVENT = {
  CREATE: "client:room__create",
  JOIN: "client:room__join",
  LEAVE: "client:room__leave",
  FINISH: "client:room__finish",
  REACTION: "client:room__reaction",
} as const;

export const SESSION_LISTEN_EVENT = {
  CREATE: "server:room__create",
  QUIT: "server:room__quit",
  FULL: "server:room__full",
  JOIN: "server:room__join",
  FINISH: "server:room__finish",
  CHANGE_HOST: "server:room__change_host",
  REACTION: "server:room__reaction",
} as const;
