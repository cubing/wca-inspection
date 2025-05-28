.PHONY: dev
dev: setup
	bun x serve src

all: deploy open

.PHONY: deploy
deploy: setup
	bun x @cubing/deploy

.PHONY: lint
lint: setup
	bun x @biomejs/biome check ./src

.PHONY: format
format: setup
	bun x @biomejs/biome format --write ./src

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: open
open:
	open ${URL}
