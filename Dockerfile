FROM node:14

WORKDIR /usr/src/app

RUN npm install

CMD [ "npm", "run", "start" ]

EXPOSE 3001