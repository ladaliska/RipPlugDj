FROM node:12.18.1
ENV NODE_ENV=production

COPY "src" "/app"

WORKDIR /app

RUN npm ci
RUN tsc --project tsconfig.json
RUN cp -r /app/public /app/dist/public
RUN cp -r /app/config /app/dist/config

RUN cp /app/dist/config/config.json.example /app/dist/config/config.json
CMD [ "node", "./dist/server/main.js" ]