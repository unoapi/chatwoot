FROM clairton/chatwoot:2.8.4

RUN gem install bundler
RUN echo "" >> Gemfile
RUN bundle install

ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 1
ENV PORT 3000
ENV CHATWOOT_PREPARE false
ENV SECRET_KEY_BASE abc