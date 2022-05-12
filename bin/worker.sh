#!/bin/bash

set -e

if [ "$CHATWOOT_PREPARE" == "true" ] ; then
  echo "Chatwoot prepare worker..."
  bundle exec rails db:chatwoot_prepare
fi

echo "Starting worker..."
bundle exec sidekiq -C config/sidekiq.yml