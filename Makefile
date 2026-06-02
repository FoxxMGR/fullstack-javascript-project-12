.PHONY: build start

build:
	cd frontend && npm ci && npm run build

start:
	npx @hexlet/chat-server && cd frontend && npx serve -s dist 