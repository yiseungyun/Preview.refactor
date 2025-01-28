FROM node:21-alpine AS base

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

ENV PNPM_HOME=/pnpm
ENV PATH=$PATH:$PNPM_HOME
RUN corepack enable

WORKDIR /app

COPY backend/package.json pnpm-lock.yaml ./

RUN pnpm install

COPY backend backend/

WORKDIR /app/backend
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start:prod"]