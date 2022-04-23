FROM chatwoot/chatwoot:v2.4.1


ENV NODE_ENV production
ENV RAILS_ENV production
ENV INSTALLATION_ENV docker
ENV ACTIVE_STORAGE_SERVICE amazon
ENV RAILS_MAX_THREADS 5

ENTRYPOINT [ "docker/entrypoints/rails.sh" ]

CMD ["bundle", "exec", "rails", "s", "-p", "3000", "-b", "0.0.0.0"]