# base image
FROM node:alpine

# working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY . /app

# expose Vite dev port
# EXPOSE 5173

# start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]

EXPOSE 5173
