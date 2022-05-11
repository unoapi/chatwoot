SERVICE=$1
TYPE=$2
TOKEN=$3
apk add --update --no-cache wget 
export IMAGE_ID=`cat image_$SERVICE.txt`
export PAYLOAD='{"updates":[{"type":"'"$TYPE"'","docker_image":"'"$IMAGE_ID"'"}]}'
export URL="https://api.heroku.com/apps/chatwoot-${SERVICE}/formation"
wget $URL \
  --server-response \
  --method=PATCH \
  --body-data=$PAYLOAD \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/vnd.heroku+json; version=3.docker-releases' \
  --header "Authorization: Bearer $TOKEN"
