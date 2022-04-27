#!/bin/bash

set -e

if [ "$CHATWOOT_PREPARE" == "true" ] ; then
  echo "Chatwoot prepare app..."
  bundle exec rails db:chatwoot_prepare
  bundle exec rails db:prepare
fi

echo "Starting app..."
bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0