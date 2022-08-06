FROM chatwoot/chatwoot:v2.7.0

RUN gem install bundler
ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 1
ENV PORT 3000
ENV CHATWOOT_PREPARE false

ADD scripts/heroku-start.sh /bin/heroku-start

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

ADD bin/email_relay_job.rb /app/app/jobs/email_relay_job.rb

ADD bin/request_patch.rb /app/lib/request_patch.rb
RUN echo "$(cat /app/lib/request_patch.rb)" >> /app/config/application.rb
RUN rm /app/lib/request_patch.rb

ADD ./bin/CloudWhatsapp.vue /app/app/javascript/dashboard/routes/dashboard/settings/inbox/channels/CloudWhatsapp.vue
RUN sed -i "s/https\:\/\/graph\.facebook\.com/#{whatsapp_channel\.provider_config\['url'] || 'https\:\/\/graph\.facebook\.com'}/g" /app/app/services/whatsapp/providers/whatsapp_cloud_service.rb

ADD ./bin/Message.vue /app/app/javascript/dashboard/components/widgets/conversation/Message.vue
ADD ./bin/Actions.vue /app/app/javascript/dashboard/components/widgets/conversation/bubble/Actions.vue
ADD ./bin/inboxMixin.js /app/app/javascript/shared/mixins/inboxMixin.js
RUN echo "json.status message.status" >> app/views/api/v1/models/_message.json.jbuilder

CMD heroku-start