install:
	npm ci 

install-dep:
	npm install

dev:
	npm run dev

lint:
	npm lint

lint-fix:
	npm lint --fix



test:
	npm test

build:
	docker build -t demo-credit-wallet:latest .

