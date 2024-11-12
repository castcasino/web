FROM node:22-alpine

# Set the working directory to /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Install packages
#RUN apk add --no-cache <package_name>

COPY package.json /app/package.json
RUN yarn install --silent

COPY . /app
RUN yarn run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
