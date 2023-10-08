FROM node:20
RUN mkdir -p /home/node/server && chown -R node:node /home/node/server
WORKDIR /home/node/server
COPY --chown=node:node . .
USER node
RUN npm install
ENV PORT=3000
EXPOSE 3000
CMD [ "node", "app.js" ]
