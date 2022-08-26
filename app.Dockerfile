FROM clairton/chatwoot:2.8.4

RUN gem install bundler
RUN echo "gem 'phonelib'" >> Gemfile
RUN bundle install

ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 1
ENV PORT 3000
ENV CHATWOOT_PREPARE false
ENV SECRET_KEY_BASE abc

ADD scripts/heroku-start.sh /bin/heroku-start

ADD bin/message_patch.rb /app/lib/message_patch.rb
RUN echo "$(cat /app/lib/message_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/message_patch.rb

ADD bin/message_builder_patch.rb /app/lib/message_builder_patch.rb
RUN echo "$(cat /app/lib/message_builder_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/message_builder_patch.rb

ADD bin/messages_controller_patch.rb /app/lib/messages_controller_patch.rb
RUN echo "$(cat /app/lib/messages_controller_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/messages_controller_patch.rb

ADD bin/inboxes_controller_patch.rb /app/lib/inboxes_controller_patch.rb
RUN echo "$(cat /app/lib/inboxes_controller_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/inboxes_controller_patch.rb

ADD bin/request_patch.rb /app/lib/request_patch.rb
RUN echo "$(cat /app/lib/request_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/request_patch.rb

ADD bin/contact_patch.rb /app/lib/contact_patch.rb
RUN echo "$(cat /app/lib/contact_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/contact_patch.rb

ADD bin/email_relay_job.rb /app/app/jobs/email_relay_job.rb
ADD bin/brazilian_number_validator.rb /app/app/models/concerns/brazilian_number_validator.rb

CMD heroku-start