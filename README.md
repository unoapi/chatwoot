Deploy on heroku
  sidekiq with chatwoot.worker@excellence.odo.br
  rails with chatwoot.web@excellence.odo.br
  mail_room with chatwoot.relay@excellence.odo.br

DataBase on elephantsql.com with clairton.rodrigo@gmail.com
  postgres://isilo.db.elephantsql.com/iiekibjq

Redis chatwoot.rails@excellence.odo.br
  redis://redis-19086.c80.us-east-1-2.ec2.cloud.redislabs.com:19086


In Chatwoot create a channel api with com WebHook http://whatsapp.lvh.me/api/clairton/chatwoot
Copy the token, inbox id and account id

Generate whatsapp token

curl --location --request POST 'http://whatsapp.lvh.me/api/clairton/THISISMYSECURETOKEN/generate-token'

Integrate with ChatWoot token, inbox id and account id

curl --location --request POST 'http://localhost:21465/api/clairton/start-session' \
--header 'Authorization: Bearer $2b$10$wizTQTgUX4Pl1_L1.iTJf.WXUMDJh2nld6tEZfJK.1qQqPgcklaUm' \
--data-raw '{
    "webhook": null,
    "waitQrCode": true,
    "chatWoot" : {
      "enable": true,
      "mobile_number": "5549988290955",
      "mobile_name": "Clairton",
      "baseURL": "http://localhost:3000"
      "token": "KLo3Lupshver3GFTks4eRBjh",
      "account_id": "2",
      "inbox_id": "3"
    }
}'