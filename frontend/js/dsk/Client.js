/**
 * Copyright 2017 Atelier Disko. All rights reserved. This source
 * code is distributed under the terms of the BSD 3-Clause License.
 */

// Client for accessing the dsk APIv1.
class Client {
  static hello() {
    return this.fetch('/api/v1/hello');
  }

  // Returns a WebSocket connection to the messages endpoint. Asummes it
  // is reachable over TLS, when we have been loaded using it.
  static messages() {
    let protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    let host = window.location.hostname;
    let port = (window.location.port ? `:${window.location.port}` : '');

    return new WebSocket(`${protocol}://${host}${port}/api/v1/messages`);
  }

  static tree() {
    return this.fetch('/api/v1/tree');
  }

  // Returns node for given relative URL path.
  static get(url) {
    if (url.charAt(0) === '/') {
      url = url.substring(1);
    }
    if (url.charAt(url.length - 1) === '/') {
      url = url.slice(0, -1);
    }
    return this.fetch(`/api/v1/tree/${url}`);
  }

  // Performs a search against the tree and returns the URLs
  // from the nodes included in the result set. Use filteredBy()
  // to create a new tree view.
  static search(q) {
    return this.fetch(`/api/v1/search?q=${encodeURIComponent(q)}`);
  }

  // Performs API requests. Fail promise when there is a network issue (catch)
  // as well as when we a HTTP response status indicating an error. Using plain
  // XHR for better browser support and easier basic auth handling.
  static fetch(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          let first = xhr.status.toString().charAt(0);
          if (first !== '2' && first !== '3') {
            try {
              reject(new Error(`API request for '${url}' failed :-S: ${JSON.parse(xhr.responseText).message}`));
            } catch (e) {
              reject(new Error(`API request for '${url}' failed :-S: ${xhr.statusText}`));
            }
            return;
          }
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(new Error(`API request for '${url}' succeeded, but failed to parse response :-S: ${e}`));
          }
        }
      });
      xhr.addEventListener('error', (ev) => {
        reject(new Error(`API request for '${url}' failed :-S: ${ev}`));
      });
      xhr.open('GET', url);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();
    });
  }
}
