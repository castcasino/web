# Stage 1 - build
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN  npm install
COPY . .
RUN npm run build

# Stage 2 - production
FROM node:16-alpine AS final
WORKDIR /app
ADD package.json .
ADD nuxt.config.ts .
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
ENV NUXT_HOST=127.0.0.1
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
