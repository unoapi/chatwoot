FROM chatwoot/chatwoot:hotfix-v2.4.1

ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 2

ENV CHATWOOT_PREPARE false

ADD bin /bin

CMD ["sh", "/bin/sidekiq.sh"]