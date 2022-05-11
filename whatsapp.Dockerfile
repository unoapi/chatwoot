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

FROM node:14.17-alpine3.13

RUN apk add --no-cache --update  chromium

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV SECRET_KEY abcdef
ENV HOST 'localhost'
ENV PORT 21465
ENV REDIS_HOST 'localhost'
ENV REDIS_PORT 6379
ENV REDIS_PASSWORD ''

WORKDIR /home/node/app

COPY --from=builder /home/node/app/ .
# RUN rm -rf node_modules
# RUN yarn install --prod

ADD bin/whatsapp.sh /bin/whatsapp.sh

CMD ["sh", "/bin/whatsapp.sh" ]
