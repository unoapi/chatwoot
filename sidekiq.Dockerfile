FROM chatwoot/chatwoot:v2.4.1

CMD ["bundle", "exec", "sidekiq", "-C", "config/sidekiq.yml"]