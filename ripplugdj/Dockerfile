FROM node:12.18.1
ENV NODE_ENV=production

COPY "src" "/app"

WORKDIR /app

RUN npm install --production

RUN cp /app/config/config.json.example /app/config/config.json
CMD [ "node", "newserver.js" ]