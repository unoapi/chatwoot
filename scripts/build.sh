#!/bin/sh
SERVICE=$1
TOKEN=$2

export TAG_NAME="$(git describe --abbrev=0 --tags | cut -d"v" -f2)"
export BASE_CONTAINER_IMAGE="registry.gitlab.com/clairton/${SERVICE}"
export CONTAINER_IMAGE="${BASE_CONTAINER_IMAGE}:${TAG_NAME}"
export LATEST_CONTAINER_IMAGE="${BASE_CONTAINER_IMAGE}:latest"
echo "$CI_JOB_TOKEN" | docker login --username=gitlab-ci-token registry.gitlab.com --password-stdin
docker build -f $SERVICE.Dockerfile -t $CONTAINER_IMAGE .
docker push $CONTAINER_IMAGE
docker tag $CONTAINER_IMAGE $LATEST_CONTAINER_IMAGE
docker push $LATEST_CONTAINER_IMAGE
echo "$TOKEN" | docker login --username=_ registry.heroku.com --password-stdin
export HEROKU_IMAGE="registry.heroku.com/chatwoot-${SERVICE}:${TAG_NAME}"
docker tag $CONTAINER_IMAGE $HEROKU_IMAGE
docker push $HEROKU_IMAGE
export IMAGE_ID=`docker inspect $HEROKU_IMAGE --format={{.Id}}`
echo $IMAGE_ID > "image_${SERVICE}.txt"