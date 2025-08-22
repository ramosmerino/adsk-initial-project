FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]