FROM chatwoot/chatwoot:hotfix-v2.4.1

ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 2

# RUN apk add tzdata
# RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
# RUN echo "America/Sao_Paulo" >  /etc/timezone
# RUN date
# RUN apk del tzdata

ENV CHATWOOT_PREPARE false

ADD bin/sidekiq.sh /bin/sidekiq.sh

CMD ["sh", "/bin/sidekiq.sh"]