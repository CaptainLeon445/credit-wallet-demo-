FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk --no-cache add \
        python3 \
        make \
        g++ && \
    npm ci && \
    npm cache clean --force && \
    apk del \
        python3 \
        make \
        g++

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

