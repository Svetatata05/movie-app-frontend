FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

RUN npm install -g serve concurrently

EXPOSE 3000
EXPOSE 8000

CMD ["npm", "start"]
