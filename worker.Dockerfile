FROM chatwoot/chatwoot:v2.5.0

RUN gem install bundler

ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 1
ENV CHATWOOT_PREPARE false
ENV CHATWOOT_WHATSAPP_SERVER_AUTH_TOKEN 123

ADD bin/worker.sh /bin/worker.sh
ADD bin/email_relay_job.rb /app/app/jobs/email_relay_job.rb
ADD bin/request_patch.rb /app/lib/request_patch.rb

RUN echo "$(cat /app/lib/request_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/request_patch.rb
RUN echo "RestClient::Request.include(RequestPatch)" >> /app/config/application.rb

CMD ["sh", "/bin/worker.sh"]