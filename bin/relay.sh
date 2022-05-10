#!/bin/bash

tail -f /app/relay/log &

echo "Starting app..."

/usr/local/bundle/gems/gitlab-mail_room-0.0.20/bin/mail_room -c /app/mailboxes.yml