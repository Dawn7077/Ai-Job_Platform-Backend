FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV PORT=8080
EXPOSE 8080

CMD [ "npm", "start" ]