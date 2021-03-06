// Copyright 2018 Atelier Disko. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"strings"
	"testing"
)

func TestParseAuthors(t *testing.T) {
	txt := `
Christoph Labacher <christoph@atelierdisko.de>
Marius Wilms <marius@atelierdisko.de>
`
	r := strings.NewReader(txt)

	as := &Authors{}
	result, err := as.parse(r)
	if err != nil {
		t.Error(err)
	}
	if len(result) != 2 {
		t.Errorf("parsed wrong number of authors; expected 2: %v", result)
	}
}

func TestLookupAuthor(t *testing.T) {
	txt := `
Christoph Labacher <christoph@atelierdisko.de>
Marius Wilms <marius@atelierdisko.de>
`
	r := strings.NewReader(txt)

	as := &Authors{}
	as.AddFrom(r)

	if ok, _, _ := as.Get("marius@atelierdisko.de"); !ok {
		t.Error("failed to lookup by mail")
	}
}

// > Use hash '#' for comments that are either on their own line, or after
//   the email address.
func TestParseAuthorsComments(t *testing.T) {
	txt := `
# this is a first comment
Christoph Labacher <christoph@atelierdisko.de>
	# this is an indented 2nd comment
Marius Wilms <marius@atelierdisko.de> # this is a 3rd comment
# this is the last comment
`
	r := strings.NewReader(txt)

	as := &Authors{}
	result, err := as.parse(r)

	if err != nil {
		t.Error(err)
	}
	if len(result) != 2 {
		t.Errorf("parsed wrong number of authors; expected 2: %v", result)
	}
}
