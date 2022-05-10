#!/bin/bash

set -e

tail -f /app/relay/log &

echo "Starting app..."

mail_room -c /app/mailboxes.yml