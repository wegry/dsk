# Copyright 2017 Atelier Disko. All rights reserved.
#
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

PREFIX ?= /usr/local
VERSION ?= head-$(shell git rev-parse --short HEAD)
GOFLAGS = -X main.Version=$(VERSION)
GOBINDATA = $(shell go env GOPATH)/bin/go-bindata
ANY_DEPS = $(wildcard *.go)
FRONTEND ?= $(shell pwd)/frontend

.PHONY: test
test: data.go
	go test -race

.PHONY: dev
dev:
	$(GOBINDATA) -debug -prefix $(FRONTEND) -ignore=node_modules -o data.go $(FRONTEND)/...
	go build -race -ldflags "$(GOFLAGS)"
	@if [ ! -d _test ]; then mkdir _test; fi
	./dsk _test

.PHONY: install
install: $(PREFIX)/bin/dsk

.PHONY: uninstall
uninstall:
	rm -f $(PREFIX)/bin/dsk

.PHONY: clean
clean:
	if [ -d ./dist ]; then rm -r ./dist; fi
	if [ -f ./dsk ]; then rm ./dsk; fi
	if [ -f ./data.go ]; then rm ./data.go; fi

.PHONY: dist
dist: dist/dsk dist/dsk-darwin-amd64 dist/dsk-linux-amd64 dist/dsk-windows-386.exe

$(PREFIX)/bin/%: dist/%
	install -m 555 $< $@

dist/%-darwin-amd64: $(ANY_DEPS) | data.go
	GOOS=darwin GOARCH=amd64 go build -ldflags "$(GOFLAGS)" -o $@

dist/%-linux-amd64: $(ANY_DEPS) | data.go
	GOOS=linux GOARCH=amd64 go build -ldflags "$(GOFLAGS)" -o $@

dist/%-windows-386.exe: $(ANY_DEPS) | data.go
	GOOS=windows GOARCH=386 go build -ldflags "$(GOFLAGS)" -o $@

dist/%: $(ANY_DEPS) | data.go
	go build -ldflags "$(GOFLAGS)" -o $@

data.go: $(shell find $(FRONTEND) -type f) 
	$(GOBINDATA) -prefix $(FRONTEND) -ignore=node_modules -o data.go $(FRONTEND)/...
