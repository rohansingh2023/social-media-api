FROM node:14-alpine

WORKDIR /

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]