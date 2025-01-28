FROM node:21-alpine AS base

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

ENV PNPM_HOME=/pnpm
ENV PATH=$PATH:$PNPM_HOME
RUN corepack enable

WORKDIR /app

COPY frontend/package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY frontend frontend/

WORKDIR /app/frontend
RUN pnpm run build

ENV HOST=0.0.0.0
EXPOSE 5173
CMD ["pnpm", "run", "dev"]