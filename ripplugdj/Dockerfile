FROM node:12.18.1
ENV NODE_ENV=production

COPY "src" "/app"

WORKDIR /app

RUN npm install --production

CMD [ "node", "server.js" ]