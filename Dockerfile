FROM node:22-alpine AS installer
RUN corepack enable
COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
RUN corepack enable
COPY . /app/
COPY --from=installer /app/node_modules /app/node_modules
WORKDIR /app

ARG VITE_API_URL

RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]