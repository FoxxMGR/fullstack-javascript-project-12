.PHONY: install build start

install:
	cd frontend && npm ci
	npm ci

build: install
	cd frontend && npm run build
	mkdir -p build
	cp -r frontend/dist/* build/

start:
	npx @hexlet/chat-server