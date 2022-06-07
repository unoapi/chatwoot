#!/bin/bash

set -e

if [ "$CHATWOOT_PREPARE" == "true" ] ; then
  echo "Chatwoot prepare w3b..."
  bundle exec rails db:chatwoot_prepare
fi

echo "Starting Chatwoot w3b..."
bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0