NPM = npm

all: install dev dist

dev:
	webpack

dist:
	WEBPACK_ENV=dist webpack

install:
	$(NPM) install

.PHONY: dist
