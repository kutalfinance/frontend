FROM node:24-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY ./package.json pnpm-lock.yaml ./
COPY ./package*.json ./
RUN npm i
COPY . .
RUN pnpm run build

FROM nginx

COPY  --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
