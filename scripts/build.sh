#!/bin/sh
SERVICE=$1
TOKEN=$2

export TAG_NAME="$(git describe --abbrev=0 --tags | cut -d"v" -f2)"
export CONTAINER_IMAGE="registry.gitlab.com/clairton/chatwoot/${SERVICE}:${TAG_NAME}"
docker login -u gitlab-ci-token -p $CI_JOB_TOKEN registry.gitlab.com
docker build -f $SERVICE.Dockerfile -t $CONTAINER_IMAGE .
docker push $CONTAINER_IMAGE
docker login --username=_ --password=$TOKEN registry.heroku.com
export HEROKU_IMAGE="registry.heroku.com/chatwoot-${SERVICE}:${TAG_NAME}"
docker tag $CONTAINER_IMAGE $HEROKU_IMAGE
docker push $HEROKU_IMAGE
export IMAGE_ID=`docker inspect $HEROKU_IMAGE --format={{.Id}}`
echo $IMAGE_ID > "image_${SERVICE}.txt"