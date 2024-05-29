.PHONY: dev
dev:
	npx serve src

all: deploy open

.PHONY: deploy
deploy:
	bun x @cubing/deploy

.PHONY: lint
lint:
	npx @biomejs/biome check ./src

.PHONY: format
format:
	npx @biomejs/biome format --write ./src

.PHONY: open
open:
	open ${URL}
