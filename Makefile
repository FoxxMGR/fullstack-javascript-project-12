.PHONY: build start

build:
	cd frontend && npm ci && npm run build

start:
	cd frontend && npx serve -s dist 