/**
 * Copyright 2019 Atelier Disko. All rights reserved. This source
 * code is distributed under the terms of the BSD 3-Clause License.
 */

import React, { useState, useEffect } from 'react';
import { routeNode, BaseLink } from 'react-router5'
import { useGlobal } from 'reactn';
import { Helmet } from 'react-helmet';

import { Client } from '@atelierdisko/dsk';
import TreeNavigation from './TreeNavigation';

import './Variables.css';
import './App.css';
import Page from './Page';
import ErrorPage from './ErrorPage';
import Search from './Search';

import HamburgerIcon from './HamburgerIcon.svg'
import CloseIcon from './CloseIcon.svg'

function App(props) {
  const [tree, setTree] = useState(null);
  const [node, setNode] = useState(null);
  const [error, setError] = useState(null);
  const [config, setConfig] = useGlobal("config");
  const [mobileSidebarIsActive, setMobileSidebarIsActive] = useState(false);

  // Establish WebSocket connection, once. By appending to the sync messages
  // (state), we're triggering a full re-render of the App. We're intentionally
  // not displaying notifications, as we consider them to be too intrusive.
  useEffect(() => {
    let socket = Client.messages();
    console.log('Connected to messages WebSocket.');

    socket.addEventListener('message', (ev) => {
      let m = JSON.parse(ev.data);

      if (m.type === 'tree-synced') {
        loadTree();

        // The node might have gone away.
        checkNode().then((isExistent) => {
          if (isExistent) {
            loadNode();
          } else {
            console.log('Current node has gone away after tree sync.');
            props.router.navigate('home');
          }
        })
      }
    });
  }, [props.router]);

  function loadTree() {
    Client.tree().then((data) => {
      setTree(data.root);
    }).catch((err) => {
      console.log(`Failed to load tree: ${err}`);
    });
  }

  function loadNode() {
    Client.get(nodeURLFromRouter(props.route)).then((data) => {
      setNode(data);
      setError(null);
    }).catch((err)  =>{
      console.log(`Failed to set node data: ${err}`);
      setError("Design aspect not found.");
    });
  }

  function checkNode() {
    return Client.has(nodeURLFromRouter(props.route));
  }

  function nodeURLFromRouter(route) {
    switch (route.name) {
      case 'home':
        return ''; // Is a valid node URL.
      case 'node':
        return route.params.node;
      default:
        return null;
    }
  }

  // This hook may run several times. We might receive an empty configuration
  // object from the API. We must differentiate between this case and initially
  // empty object.
  useEffect(() => {
    if (config._populated) {
      return;
    }
    Client.config()
      .then((data) => {
        setConfig({
          ...data,
          _populated: true,
        });
      });
  }, [config, setConfig]);

  // Initialize tree navigation.
  useEffect(loadTree, []);

  // Load the current node being displayed. Reload it whenever the route changes.
  useEffect(loadNode, [props.route]);

  let content;
  if (error) {
    content = <ErrorPage>{error}</ErrorPage>;
  } else if (node) {
    content = <Page {...node} activeTab={props.route.params.t || undefined} baseTitle={config.org + " / " + config.project} />;
  }

  let refToMain = React.createRef();

  return (
    <div className="app">
      <Helmet htmlAttributes={{ lang: config.lang }} />

      <button className="app_skip-to-content" onClick={() => { if (refToMain.current) { console.log(refToMain); refToMain.current.focus() } }}>Skip to Content (Press Enter)</button>

      <div className={`app__sidebar ${mobileSidebarIsActive ? "app__sidebar--is-visible" : ""}`}>
        <div className="app__header">
          <div>{config.org || "DSK"} / <BaseLink router={props.router} routeName="home" className="app__title">{config.project}</BaseLink></div>
        </div>
        <div className="app__nav">
          <TreeNavigation tree={tree} hideMobileSidebar={() => {setMobileSidebarIsActive(false)}} />
        </div>
        <div className="app__shoutout">
          Powered by <a href="https://github.com/atelierdisko/dsk">DSK</a> · <a href="mailto:thankyou@rundsk.com">Get in Touch</a>
        </div>
      </div>
      <main className="app__main" ref={refToMain} tabIndex="0">
        <div className="app__mobile-header">
          <div className="app__mobile-header-icon" onClick={() => {setMobileSidebarIsActive(!mobileSidebarIsActive)}}>

            { mobileSidebarIsActive ?
              <img src={CloseIcon} alt="Toggle Menu"/>
            :
              <img src={HamburgerIcon} alt="Toggle Menu"/>
            }
          </div>
          <div>{config.org || "DSK"} / <BaseLink router={props.router} routeName="home" className="app__title">{config.project}</BaseLink></div>
        </div>

        {content}
      </main>
      <div className="app__search"><Search title={config.project} /></div>
    </div>
  );
}

export default routeNode('')(App)
