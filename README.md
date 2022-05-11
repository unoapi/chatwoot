Deploy on heroku
  sidekiq with chatwoot.worker@excellence.odo.br
  rails with chatwoot.web@excellence.odo.br
  mail_room with chatwoot.relay@excellence.odo.br

DataBase on elephantsql.com with clairton.rodrigo@gmail.com
  postgres://isilo.db.elephantsql.com/iiekibjq

Redis chatwoot.rails@excellence.odo.br
  redis://redis-19086.c80.us-east-1-2.ec2.cloud.redislabs.com:19086


In Chatwoot create a channel api with com WebHook https://whatsapp.excellence.odo.br/api/clairton-pessoal/chatwoot
Copy the token, inbox id and account id

Generate whatsapp token

curl --location --request POST 'https://whatsapp.excellence.odo.br/api/clairton-pessoal/vshaksdoabdgasuFUGDFYSUDW875E68GWQKDNLD/generate-token'


Integrate with ChatWoot token, inbox id and account id

curl --location --request POST 'https://whatsapp.excellence.odo.br/api/clairton-pessoal/start-session' \
--header 'Authorization: Bearer $2b$10$KmSNWJRSQfV8fX6GQ.HbkeoIM9O29eG8TQxUm6jpOaTbRZoeMvbVa' \
--data-raw '{
    "webhook": null,
    "waitQrCode": true,
    "chatWoot" : {
      "enable": true,
      "baseURL": "https://chat.excellence.odo.br"
      "token": "PFrJ3Bqma9xDmeWxDYvYMM3v",
      "inbox_id": "10",
      "account_id": "2"
    }
}'