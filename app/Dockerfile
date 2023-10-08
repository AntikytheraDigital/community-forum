FROM node:20
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
RUN npm install
ENV PORT=3005
EXPOSE 3005
CMD [ "node", "src/app.js" ]
