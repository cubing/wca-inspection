.PHONY: dev
dev:
	bun x serve src

all: deploy open

.PHONY: deploy
deploy:
	bun x @cubing/deploy

.PHONY: lint
lint:
	bun x @biomejs/biome check ./src

.PHONY: format
format:
	bun x @biomejs/biome format --write ./src

.PHONY: open
open:
	open ${URL}
