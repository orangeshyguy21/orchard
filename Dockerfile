# ---------------
# Install Dependencies
# ---------------
FROM node:24-alpine as deps

WORKDIR /app

# Install dependencies necessary for pg_dump and psql
RUN apk add --update --no-cache \
  postgresql-client

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /app

# Set env variables
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ARG SERVER_HOST="0.0.0.0"
ENV SERVER_HOST=${SERVER_HOST}

# Copy source code
COPY . .

# Build the Angular and NestJS application
RUN npm run build

# Remove non production necessary modules
# RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM node:24-alpine as final

WORKDIR /app

# Set env variables
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Copy package files and production dependencies
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules/ ./node_modules

# Copy built files
COPY --from=build /app/dist/ ./dist

# Copy Angular public assets
COPY --from=build /app/public/ ./public

# # Create non-root user for security
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nestjs -u 1001
# RUN chown -R nestjs:nodejs /app
# USER nestjs

EXPOSE 3321

CMD ["npm", "run", "start"]