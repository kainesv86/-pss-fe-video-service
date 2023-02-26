FROM node:15.14.0-alpine3.10

WORKDIR /usr/src/app


COPY package.json ./
RUN npm install -g cross-env

RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve

CMD [ "serve", "-s" ,"build"]