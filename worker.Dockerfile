FROM chatwoot/chatwoot:hotfix-v2.4.1

ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 2
ENV CHATWOOT_PREPARE false
ENV RETRAY_IN 30

ADD bin/worker.sh /bin/worker.sh
ADD bin/email_relay_job.rb /app/app/jobs/email_relay_job.rb


# to resolve
# redis.pipelined do
#  redis.get("key")
# end

# should be replaced by

# redis.pipelined do |pipeline|
#   pipeline.get("key")
# end
RUN sed -i "s/gem 'sidekiq-cron'/gem 'sidekiq-cron', '~> 1.3'/g" Gemfile
RUN gem install bundler
RUN bundle install

CMD ["sh", "/bin/worker.sh"]