MAKE = make
NPM = npm

all:
	$(MAKE) install
	$(MAKE) build

build: dev dist

dev:
	webpack

dist:
	WEBPACK_ENV=dist webpack

install:
	$(NPM) install

.PHONY: dist dev install build
