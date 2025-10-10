# ---------------
# Install Dependencies
# ---------------
FROM node:22-alpine as deps

WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /app

# Copy source code
COPY . .

# Build the Angular and NestJS application
RUN npm run build

# Remove .env file after build is complete
RUN rm -f .env

# ---------------
# Release App
# ---------------
FROM node:22-alpine as final

WORKDIR /app

# Install dependencies necessary for pg_dump and psql
RUN apk add --update --no-cache postgresql-client

# Copy package files and production dependencies
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules/ ./node_modules

# Copy built files
COPY --from=build /app/dist/ ./dist

# Copy proto files
COPY --from=build /app/proto/ ./proto

# Copy Angular public assets
COPY --from=build /app/public/ ./public


ARG SERVER_PORT=3321
EXPOSE ${SERVER_PORT}

CMD ["npm", "run", "start"]