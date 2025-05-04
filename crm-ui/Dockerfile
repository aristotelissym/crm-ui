FROM node:23-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base AS dev
ENV NODE_ENV=development
RUN npm install 
COPY . .
CMD ["npm", "run", "dev"]