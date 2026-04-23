FROM node:22-alpine

WORKDIR /app

COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN npm install
RUN npm run prisma:generate -w apps/api

WORKDIR /app/apps/api
EXPOSE 4000

CMD ["npm", "run", "start:dev"]
