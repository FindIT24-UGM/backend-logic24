FROM node:lts-alpine
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb+srv://timitfindit2024:timitFINDIT2024@findit2024.yq84zlv.mongodb.net/logicindit24?retryWrites=true&w=majority
ENV JWT_SECRET=j4w1r15451n1br0
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5001
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.js"]
