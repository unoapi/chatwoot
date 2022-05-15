FROM chatwoot/chatwoot:hotfix-v2.4.1

RUN apk add --update --no-cache imagemagick

RUN gem install bundler
ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 2
ENV PORT 3000
ENV CHATWOOT_PREPARE false

ADD bin/w3b.sh /bin/w3b.sh

CMD ["sh", "/bin/w3b.sh"]