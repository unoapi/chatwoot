FROM ruby:3-alpine3.15

WORKDIR /app/relay

RUN apk add --update --no-cache build-base icu-dev
RUN gem install charlock_holmes -v 0.7.7
RUN gem install sidekiq -v 6.4.2
RUN gem install gitlab-mail_room

ADD config/mailboxes.yml /app/mailboxes.yml
ADD bin/relay.sh /bin/relay.sh

CMD ["sh", "/bin/relay.sh"]