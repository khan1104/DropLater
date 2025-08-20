FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app

CMD ["node", "server.js"]  # ya tumhara worker entry file
