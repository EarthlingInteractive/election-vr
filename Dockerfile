# inspired by https://github.com/BretFisher/node-docker-good-defaults
FROM node:8-alpine as builder
RUN apk add --no-cache git

RUN mkdir -p /opt/app

# install dependencies first, in a different location
# so they don't conflict with the local (outside the container) node_modules
WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app
RUN npm run build

FROM httpd:2.4
COPY --from=builder /opt/app/dist /usr/local/apache2/htdocs/
