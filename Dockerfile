FROM node:8
WORKDIR /bitgesell
WORKDIR /opt/bitgesell
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD node server.js
EXPOSE 5000
