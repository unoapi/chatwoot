#!/bin/bash

set -e

echo "Starting app..."

mail_room -c /app/mailboxes.yml & tail -f /app/relay/log