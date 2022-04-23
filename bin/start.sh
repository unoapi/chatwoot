#!/bin/bash

set -e
echo "Starting app..."
bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0