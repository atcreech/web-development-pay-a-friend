FROM node:latest

WORKDIR /Homework3

COPY ./package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]