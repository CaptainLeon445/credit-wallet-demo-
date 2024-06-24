install:
	npm ci 

test:
	npm test

build:
	docker build -t demo-credit-wallet:latest .

docker-login:
	echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin "${DOCKER_REGISTRY}"

docker-push:
	docker push "${secrets.DOCKER_REGISTRY}/simple-app"

deploy:
	docker-compose -f docker-compose.yml up --build	