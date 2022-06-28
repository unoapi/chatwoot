FROM chatwoot/chatwoot:v2.6.0

RUN gem install bundler
ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 1
ENV PORT 3000
ENV CHATWOOT_PREPARE false

ADD bin/w3b.sh /bin/w3b.sh

ADD bin/add_external_source_ids_whatsapp_to_message.rb /app/lib/add_external_source_ids_whatsapp_to_message.rb
RUN echo "$(cat /app/lib/add_external_source_ids_whatsapp_to_message.rb)" >> /app/config/application.rb
RUN rm /app/lib/add_external_source_ids_whatsapp_to_message.rb

ADD bin/message_builder_patch.rb /app/lib/message_builder_patch.rb
RUN echo "$(cat /app/lib/message_builder_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/message_builder_patch.rb

ADD bin/messages_controller_patch.rb /app/lib/messages_controller_patch.rb
RUN echo "$(cat /app/lib/messages_controller_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/messages_controller_patch.rb

ADD bin/inboxes_controller_patch.rb /app/lib/inboxes_controller_patch.rb
RUN echo "$(cat /app/lib/inboxes_controller_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/inboxes_controller_patch.rb

CMD ["sh", "/bin/w3b.sh"]