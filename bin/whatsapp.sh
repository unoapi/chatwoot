

# SECRET_KEY, HOST, PORT, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD

echo "Update SECRET_KEY -> $SECRET_KEY"
sed -i s/\$SECRET_KEY/$SECRET_KEY/g /home/node/app/dist/config.json
echo "Update HOST -> $HOST"
ESCAPED_HOST=$(printf '%s\n' "$HOST" | sed -e 's/[\/&:]/\\&/g')
sed -i s/\$HOST/"$ESCAPED_HOST"/g /home/node/app/dist/config.json
echo "Update PORT -> $PORT"
sed -i s/\$PORT/$PORT/g /home/node/app/dist/config.json
echo "Update REDIS_HOST -> $REDIS_HOST"
sed -i s/\$REDIS_HOST/$REDIS_HOST/g /home/node/app/dist/config.json
echo "Update REDIS_PORT -> $REDIS_PORT"
sed -i s/\$REDIS_PORT/$REDIS_PORT/g /home/node/app/dist/config.json
echo "Update REDIS_PASSWORD -> $REDIS_PASSWORD"
sed -i s/\$REDIS_PASSWORD/$REDIS_PASSWORD/g /home/node/app/dist/config.json
echo "Update LOG_LEVEL -> $LOG_LEVEL"
sed -i s/\$LOG_LEVEL/$LOG_LEVEL/g /home/node/app/dist/config.json

# node dist/server.js
yarn start