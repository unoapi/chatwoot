#!/bin/bash

set -e

if [ "$CHATWOOT_PREPARE" == "true" ] ; then
  echo "Chatwoot prepare app..."
  bundle exec rails db:chatwoot_prepare
  bundle exec rails db:prepare
fi

echo "Starting app..."
bundle exec sidekiq -C config/sidekiq.yml