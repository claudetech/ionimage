MAKE = make
NPM = npm

all:
	$(MAKE) install
	$(MAKE) build

build: dev dist

dev:
	npm run build

dist:
	WEBPACK_ENV=dist npm run build

install:
	$(NPM) install

.PHONY: dist dev install build
