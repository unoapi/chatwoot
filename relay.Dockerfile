FROM ruby:3-alpine3.15

WORKDIR /app/relay

RUN gem install mail_room -s https://github.com/tpitale/mail_room/tree/v0.10.1
RUN gem install faraday -v 1.10.0

RUN touch /tmp/relay.log

ADD config/mailboxes.yml /app/mailboxes.yml

ADD bin/relay.sh /bin/relay.sh

CMD ["sh", "/bin/relay.sh"]