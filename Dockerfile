# ---------------
# Install Dependencies
# ---------------
FROM node:22-alpine as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------
# Build App
# ---------------
FROM deps as build
WORKDIR /app
COPY . .
RUN npm run build
RUN rm -f .env

# ---------------
# Release App
# ---------------
FROM node:22-alpine as final-postgres
WORKDIR /app
RUN apk add --update --no-cache postgresql-client
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules/ ./node_modules
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/proto/ ./proto
COPY --from=build /app/public/ ./public
ARG SERVER_PORT=3321
EXPOSE ${SERVER_PORT}
CMD ["npm", "run", "start"]

FROM node:22-alpine as final-sqlite
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules/ ./node_modules
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/proto/ ./proto
COPY --from=build /app/public/ ./public
ARG SERVER_PORT=3321
EXPOSE ${SERVER_PORT}
CMD ["npm", "run", "start"]