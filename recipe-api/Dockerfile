FROM node:alpine3.16

WORKDIR /srv
COPY . .
RUN npm ci --only=production

EXPOSE 1337
ENV HOST 0.0.0.0
ENV PORT 1337
CMD [ "node", "producer-http-basic.js"]
