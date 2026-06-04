.PHONY: build start

build:
	cd frontend && npm ci && npm run build

start:
	npx start-server -s frontend/dist
