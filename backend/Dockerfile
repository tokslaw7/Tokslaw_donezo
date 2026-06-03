# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching).
# The "prisma generate" postinstall needs the schema, so copy it before installing.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# Copy the rest of the application source.
COPY . .

ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "start"]
