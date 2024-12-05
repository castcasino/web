FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "node", "server.js" ]
