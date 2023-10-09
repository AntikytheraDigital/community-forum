FROM node:20
RUN mkdir -p /home/node/server && chown -R node:node /home/node/server
WORKDIR /home/node/server
COPY --chown=node:node . .
USER node
ENV MONGOMS_VERSION=6.1.0
RUN npm install
ENV PORT=3000
EXPOSE 3000
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"test\" ]; then npm test; else node app.js; fi" ]
