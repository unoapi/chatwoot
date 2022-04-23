#!/bin/bash

set -e

if [ "$CHATWOOT_MIGRATE" == "true" ] ; then
  echo "Chatwoot prepare database..."
  bundle exec rails db:chatwoot_prepare
fi

echo "Starting app..."
bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0