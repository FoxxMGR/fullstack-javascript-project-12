.PHONY: build start

build:
	cd frontend && npm ci && npm run build
	mkdir -p build
	cp -r frontend/dist/* build/

start:
	npx @hexlet/chat-server
