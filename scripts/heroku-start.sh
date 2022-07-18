#!/bin/sh

if [ "$CHATWOOT_PREPARE" == "true" ] ; then
  echo "Chatwoot prepare ${DYNO}..."
  bundle exec rails db:chatwoot_prepare
fi

if [[ $DYNO == "web"* ]]; then
  echo "Starting Chatwoot Web..."
  bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0
elif  [[ $DYNO == "worker"* ]]; then
  echo "Starting Chatwoot Worker..."
  bundle exec sidekiq -C config/sidekiq.yml
fi