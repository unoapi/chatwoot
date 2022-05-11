Deploy on heroku
  sidekiq with chatwoot.worker@excellence.odo.br
  rails with chatwoot.web@excellence.odo.br
  mail_room with chatwoot.relay@excellence.odo.br

DataBase on elephantsql.com with clairton.rodrigo@gmail.com
  postgres://isilo.db.elephantsql.com/iiekibjq

Redis chatwoot.rails@excellence.odo.br
  redis://redis-19086.c80.us-east-1-2.ec2.cloud.redislabs.com:19086


Cria um Channel api com WebHook WPPCONNECT_URL/api/:session/chatwoot
Copiar o token, inbox id e account id

Generate wppconnect token

curl --location --request POST 'http://$HOST:$PORT/api/:session/$SECRET_KEY/generate-token'
curl --location --request POST 'http://$HOST:$PORT/api/start-session' --header 'Authorization: <API Key>' \
--data-raw '{
    "webhook": null,
    "waitQrCode": true,
    "chatWoot" : {
      "enable": true,
      "baseURL": "$FRONTEND_URL"
      "token": "",
      "inbox_id": "",
      "account_id": ""
    }
}'