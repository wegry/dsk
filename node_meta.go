// Copyright 2017 Atelier Disko. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"path/filepath"

	"github.com/go-yaml/yaml"
)

// Parses given node configuration file into a NodeMeta.
func NewNodeMeta(file string) (NodeMeta, error) {
	m := NodeMeta{path: file}

	contents, err := ioutil.ReadFile(file)
	if err != nil {
		return m, err
	}

	switch filepath.Ext(file) {
	case ".json":
		if err := json.Unmarshal(contents, &m); err != nil {
			return m, fmt.Errorf("Failed parsing %s: %s", prettyPath(file), err)
		}
		return m, nil
	case ".yaml", ".yml":
		if err := yaml.Unmarshal(contents, &m); err != nil {
			return m, fmt.Errorf("Failed parsing %s: %s", prettyPath(file), err)
		}
		return m, nil
	}
	return m, fmt.Errorf("Config not in a supported format: %s", prettyPath(file))
}

// Metadata parsed from node configuration.
type NodeMeta struct {
	path        string
	Authors     []string // Email addresses of node authors.
	Description string
	Keywords    []string
	Related     []string
	Tags        []string
	Version     string // Freeform version string.
}
