

# SECRET_KEY, HOST, PORT, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD

echo "Update SECRET_KEY -> $SECRET_KEY"
sed -i s/\$SECRET_KEY/$SECRET_KEY/g /home/node/app/src/config.json
echo "Update HOST -> $HOST"
sed -i s/\$HOST/$HOST/g /home/node/app/src/config.json
echo "Update PORT -> $PORT"
sed -i s/\$PORT/$PORT/g /home/node/app/src/config.json
echo "Update REDIS_HOST -> $REDIS_HOST"
sed -i s/\$REDIS_HOST/$REDIS_HOST/g /home/node/app/src/config.json
echo "Update REDIS_PORT -> $REDIS_PORT"
sed -i s/\$REDIS_PORT/$REDIS_PORT/g /home/node/app/src/config.json
echo "Update REDIS_PASSWORD -> $REDIS_PASSWORD"
sed -i s/\$REDIS_PASSWORD/$REDIS_PASSWORD/g /home/node/app/src/config.json


yarn start