all: dev dist

dev:
	webpack

dist:
	WEBPACK_ENV=dist webpack

.PHONY: dist
