#!/bin/bash

set -e

echo "Starting app..."

mail_room -c /app/mailboxes.yml & tail -f /tmp/relay.log