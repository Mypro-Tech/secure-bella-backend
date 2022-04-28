FROM node:14.19.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD [ "npm", "run", "start.dev" ]