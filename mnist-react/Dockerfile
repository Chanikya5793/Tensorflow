FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build && npm install -g serve
EXPOSE 3501
CMD ["serve", "-s", "build", "-l", "3501"]