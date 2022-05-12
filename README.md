Deploy on heroku
  sidekiq with chatwoot.worker@excellence.odo.br
  rails with chatwoot.web@excellence.odo.br
  mail_room with chatwoot.relay@excellence.odo.br

DataBase on elephantsql.com with clairton.rodrigo@gmail.com
  postgres://isilo.db.elephantsql.com/iiekibjq

Redis chatwoot.rails@excellence.odo.br
  redis://redis-19086.c80.us-east-1-2.ec2.cloud.redislabs.com:19086

Create a token in whatsapp-api

curl --location --request POST 'http://whatsapp-api.lvh.me/api/THISISMYSECURETOKEN/token' @todo

In Chatwoot create a channel api with com WebHook http://whatsapp-api.lvh.me/message/:token
Copy the token, inbox id and account id

Integrate with ChatWoot token, inbox id and account id

curl --location --request POST 'http://whatsapp-api.lvh.me/connect/:token' \
--data-raw '{
  "mobile_name": "Me",
  "mobile_number" "+5549988290955",
  "baseURL": "http://localhost:3000"
  "token": "KLo3Lupshver3GFTks4eRBjh",
  "account_id": "2",
  "inbox_id": "3"
}'