# Build context adalah ROOT repo, bukan apps/web: install butuh package-lock.json
# root dan workspace packages/types.
#   docker build -f apps/web/Dockerfile -t wijaya-web .
#   docker run -p 8080:80 wijaya-web

FROM node:22-alpine AS build
WORKDIR /repo

# Manifest dulu supaya layer npm ci ter-cache selama dependency tidak berubah.
COPY package.json package-lock.json ./
COPY packages/types/package.json packages/types/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY packages/types packages/types
COPY apps/web apps/web
RUN npm run build -w apps/web

FROM nginx:1.27-alpine AS serve
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
