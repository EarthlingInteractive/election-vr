FROM node:8-alpine as builder
RUN apk add --no-cache git
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM httpd:2.4
COPY --from=builder /app/dist /usr/local/apache2/htdocs/
