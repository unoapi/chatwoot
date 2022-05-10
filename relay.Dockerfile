FROM ruby:3-alpine3.15

WORKDIR /app/relay

ENV IMAP_SSL_VERIFY_MODE 'peer'

RUN echo '...' > /app/relay/log

RUN apk add --update --no-cache build-base
RUN apk add --update --no-cache icu-dev
RUN gem install charlock_holmes -v 0.7.7
RUN gem install mail_room -s https://github.com/tpitale/mail_room/tree/v0.10.1
RUN gem install sidekiq -v 6.4.2

ADD config/mailboxes.yml /app/mailboxes.yml

ADD bin/relay.sh /bin/relay.sh

CMD ["sh", "/bin/relay.sh"]