FROM node:22-alpine AS installer
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm install

FROM node:22-alpine AS builder
COPY . /app/
COPY --from=installer /app/node_modules /app/node_modules
WORKDIR /app

ARG VITE_API_URL

RUN npm run build

FROM node:22-alpine
COPY ./package.json package-lock.json /app/
COPY --from=installer /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
WORKDIR /app
RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
