Deploy on heroku
  sidekiq with chatwoot.worker@excellence.odo.br
  rails with chatwoot.web@excellence.odo.br
  mail_room with chatwoot.relay@excellence.odo.br

DataBase on elephantsql.com with clairton.rodrigo@gmail.com
  postgres://isilo.db.elephantsql.com/iiekibjq

Redis chatwoot.rails@excellence.odo.br
  redis://redis-19086.c80.us-east-1-2.ec2.cloud.redislabs.com:19086

In Chatwoot create a channel api with com WebHook http://whatsapp:8888/webhook/6e50e19a-37d4-4085-be7b-82c478e4dd0e
Copy the inbox id, account id and token in app/accounts/:account_id/profile/settings

Integrate with ChatWoot token, inbox id and account id

curl --location --request POST 'http://localhost:8888/connect/6e50e19a-37d4-4085-be7b-82c478e4dd0e' \
--header 'Content-Type: application/json' \
--header 'chatwoot_whatsapp_server_auth_token: $CHATWOOT_WHATSAPP_SERVER_AUTH_TOKEN'
--data-raw '{
  "auto_connect": true,
  "mobile_name": "Me",
  "mobile_number": "+5549988290955",
  "base_url": "http://w3b:3000",
  "token": "KLo3Lupshver3GFTks4eRBjh",
  "account_id": "2",
  "inbox_id": "3",
  "ignore_group_messages": true,
  "ignore_self_messages": true
}'

Todo List
* group messages
* copy messages sended trougth whatssap at chatwoot ok
* bots
* facebook messenger ok
* instagram direct
* qrcode connect user friendly
* security webhook ok -> add env CHATWOOT_WHATSAPP_SERVER_AUTH_TOKEN in worker and whatsapp to auth server to server