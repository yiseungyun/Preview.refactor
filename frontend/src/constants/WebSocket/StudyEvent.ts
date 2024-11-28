export const STUDY_EMIT_EVENT = {
  NEXT: "client:study__next_question",
  CURRENT: "client:study__current_index",
  INDEX: "client:study__move_index",
  START: "client:study__start_progress",
  STOP: "client:study__stop_progress",
};

export const STUDY_LISTEN_EVENT = {
  NEXT: "server:study__next_question",
  CURRENT: "server:study__current_index",
  INDEX: "server:study__move_index",
  START: "server:study__start_progress",
  STOP: "server:study__stop_progress",
  PROGRESS: "server:room__progress",
};
