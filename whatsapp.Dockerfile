FROM node:14.17-alpine3.13 as builder

ENV PORT 21465

RUN apk add --no-cache --update wget git

WORKDIR /home/node

RUN git clone https://github.com/wppconnect-team/wppconnect-server.git /home/node/app
WORKDIR /home/node/app
RUN git checkout v1.3.1

COPY ./config/config.json /home/node/app/src
RUN yarn add redis@3.1.2
RUN yarn install
RUN yarn build

FROM registry.gitlab.com/clairton/chromium:0.1.0

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV SECRET_KEY abcdef
ENV HOST 'http://localhost'
ENV PORT 21465
ENV REDIS_HOST 'localhost'
ENV REDIS_PORT 6379
ENV REDIS_PASSWORD ''

WORKDIR /home/node/app

COPY --from=builder /home/node/app/ .

ADD bin/whatsapp.sh /bin/whatsapp.sh
# ADD bin/deviceController.js /home/node/app/src/controller/deviceController.js
# ADD bin/chatWootClient.js /home/node/app/src/util/chatWootClient.js

CMD ["sh", "/bin/whatsapp.sh" ]
