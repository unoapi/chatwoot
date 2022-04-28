FROM ruby:3-alpine3.15

WORKDIR /app/getmail

ENV IMAP_SERVER imap.gmail.com
ENV IMAP_PORT 993
ENV IMAP_USER minhaodontoexcellence@gmail.com
ENV IMAP_PASSWORD kzqmahbryevylilf
ENV INGRESS_PASSWORD kzqmahbryevylilf
ENV CHATWOOT_URL https://chat.excellence.odo.br

RUN gem install mail_room
RUN gem install faraday

RUN touch /tmp/mail_room.log

ADD config/mailbox.yml /app/getmail/config.yml

ADD bin/getmail.sh /bin/getmail.sh

CMD ["sh", "/bin/getmail.sh"]