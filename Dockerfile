FROM node:22-slim AS install
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-slim AS build
WORKDIR /app
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]