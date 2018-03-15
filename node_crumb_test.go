// Copyright 2017 Atelier Disko. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import "testing"

func TestCrumbURLs(t *testing.T) {
	n := &Node{root: "/tmp/xyz", path: "/tmp/xyz/foo/bar/baz/"}

	result := n.Crumbs()
	expected := []*NodeCrumb{
		&NodeCrumb{URL: "foo"},
		&NodeCrumb{URL: "foo/bar"},
		&NodeCrumb{URL: "foo/bar/baz"},
	}
	for k, v := range expected {
		if result[k].URL != v.URL {
			t.Errorf("failed to parse crumbs, expectation for key %d failed", k)
			t.Logf("expected: %s, result: %s", v.URL, result[k].URL)
		}
	}
}

func TestCrumbSimpleTitles(t *testing.T) {
	n := &Node{root: "/tmp/xyz", path: "/tmp/xyz/foo/bar/baz/"}

	result := n.Crumbs()
	expected := []*NodeCrumb{
		&NodeCrumb{Title: "foo"},
		&NodeCrumb{Title: "bar"},
		&NodeCrumb{Title: "baz"},
	}
	for k, v := range expected {
		if result[k].Title != v.Title {
			t.Errorf("failed to parse crumbs, expectation for key %d failed", k)
			t.Logf("expected: %s, result: %s", v.Title, result[k].Title)
		}
	}
}

func TestCrumbOrderedTitles(t *testing.T) {
	n := &Node{root: "/tmp/xyz", path: "/tmp/xyz/01_foo/2-bar/baz/"}

	result := n.Crumbs()
	expected := []*NodeCrumb{
		&NodeCrumb{Title: "foo"},
		&NodeCrumb{Title: "bar"},
		&NodeCrumb{Title: "baz"},
	}
	for k, v := range expected {
		if result[k].Title != v.Title {
			t.Errorf("failed to parse crumbs, expectation for key %d failed", k)
			t.Logf("expected: %s, result: %s", v.Title, result[k].Title)
		}
	}
}
