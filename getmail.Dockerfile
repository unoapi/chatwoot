FROM ruby:3-alpine3.15

WORKDIR /app/getmail

RUN gem install mail_room --source https://github.com/tpitale/mail_room
RUN gem install faraday -v 1.10.0

RUN touch /tmp/mail_room.log

ADD config/mailbox.yml /app/mail_room/config.yml

ADD bin/mail_room.sh /bin/mail_room.sh

CMD ["sh", "/bin/mail_room.sh"]