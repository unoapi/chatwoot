FROM chatwoot/chatwoot:hotfix-v2.4.1

RUN gem install bundler
ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 2
ENV PORT 3000
ENV CHATWOOT_PREPARE false

ADD bin/rails.sh /bin/rails.sh

EXPOSE 80
EXPOSE 3000

CMD ["sh", "/bin/rails.sh"]