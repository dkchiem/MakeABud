# Install dependencies only when needed
FROM node:alpine AS deps
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD [ "npm", "run", "start" ]