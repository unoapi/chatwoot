Deploy on heroku
  sidekiq with chatwoot.worker@excellence.odo.br
  rails with chatwoot.web@excellence.odo.br
  mail_room with chatwoot.relay@excellence.odo.br

DataBase on elephantsql.com with clairton.rodrigo@gmail.com
  postgres://isilo.db.elephantsql.com/iiekibjq

Redis chatwoot.rails@excellence.odo.br
  redis://redis-19086.c80.us-east-1-2.ec2.cloud.redislabs.com:19086

Rabbitmq clairton.rodrigo@gmail.com
  https://www.cloudamqp.com

Create a token in whatsapp-api

curl --location --request POST 'http://whatsapp:8888/api/THISISMYSECURETOKEN/token' @todo

In Chatwoot create a channel api with com WebHook http://localhost:8888/webhook/6e50e19a-37d4-4085-be7b-82c478e4dd0e
Copy the inbox id, account id and token in app/accounts/:account_id/profile/settings

Integrate with ChatWoot token, inbox id and account id

curl --location --request POST 'http://localhost:8888/connect/6e50e19a-37d4-4085-be7b-82c478e4dd0e' \
--header 'Content-Type: application/json' \
--data-raw '{
  "autoConnect": true,
  "mobile_name": "Me",
  "mobile_number": "+5549988290955",
  "baseURL": "http://w3b:3000",
  "token": "KLo3Lupshver3GFTks4eRBjh",
  "account_id": "2",
  "inbox_id": "3"
}'




Todo List
* group messages
* copy messages sended in directely in whatssap at chatwoot
* bots
* facebook app to create channel with facebook messenger and instagram direct