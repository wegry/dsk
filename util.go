// Copyright 2017 Atelier Disko. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"errors"
	"log"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	DirectoryTraversalError = errors.New("directory traversal attempted")
	PrettyPathRoot          string
)

// Does not include the tree root directort.
func prettyPath(path string) string {
	rel, _ := filepath.Rel(filepath.Dir(PrettyPathRoot), path)
	return rel
}

// Ensures given path is absolute and below root path, if not will
// return error. Used for preventing path traversal. Accepts absolute and
// relative paths.
//
// Although the Go http stack will resolve all kinds of dotted path
// segments and finally redirect to the non-relative path (i.e. `GET
// ../../etc/shadow` becomes `GET /etc/shadow`), this func is used as
// an additional safety measure. It can also be used on other parts of
// the URL that are not safe by default (i.e. the query string).
func checkSafePath(path string, root string) error {
	if !filepath.IsAbs(path) {
		path = filepath.Join(root, path)
	}
	path = filepath.Clean(path)

	if path == root {
		return nil
	}
	if strings.HasPrefix(path, root) {
		return nil
	}
	log.Printf("directory traversal detected, failed check: path %s, root %s", path, root)
	return DirectoryTraversalError
}

// Tries to find root directory either by looking at args or the
// current working directory. This function needs the full path to the
// binary as a first argument and optionally an explicitly given path
// as the second argument.
func detectRoot(binary string, given string) (string, error) {
	var here string

	if given != "" {
		here = given
	} else {
		// When no path is given as an argument, take the path to the
		// process itself. This makes sure that when opening the binary from
		// Finder the folder it is stored in is used.
		here = filepath.Dir(binary)
	}
	here, err := filepath.Abs(here)
	if err != nil {
		return here, err
	}
	return filepath.EvalSymlinks(here)
}

// Checks if any of the path segments in the given path, matches regexp.
func anyPathSegmentMatches(path string, r *regexp.Regexp) bool {
	for path != "." {
		b := filepath.Base(path)

		if IgnoreNodesRegexp.MatchString(b) {
			return true
		}
		path = filepath.Dir(path)
	}
	return false
}
