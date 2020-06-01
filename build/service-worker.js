/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./service-worker.js",['./workbox-abaa1409'], function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  workbox.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "1e59d2330b.ttf",
    "revision": "b06871f281fee6b241d60582ae9369b9"
  }, {
    "url": "20fd1704ea.woff2",
    "revision": "af7ae505a9eed503f8b8e6982036873e"
  }, {
    "url": "4e4ed919a735a2f727008ad3aae59e2a.jpg",
    "revision": "8f84ef53af07fafe5b248855b4ac5af2"
  }, {
    "url": "8b43027f47.eot",
    "revision": "674f50d287a8c48dc19ba404d20fe713"
  }, {
    "url": "c1e38fd9e0.svg",
    "revision": "912ec66d7572ff821749319396470bde"
  }, {
    "url": "f691f37e57.woff",
    "revision": "fee66e712a8a08eef5805a46892932ad"
  }, {
    "url": "index.d364693c76.css",
    "revision": "a6b66827226e0f36e8eb7eae854dc817"
  }, {
    "url": "index.html",
    "revision": "03c7d79a6140d58bd3d6ddc2dd553dba"
  }, {
    "url": "js/index.6d4379398a.js",
    "revision": "e7557f3c957d259de07b7cf7e9a808b5"
  }, {
    "url": "js/print.index.8b49d4a37c.js",
    "revision": "889abe1c8409cb54b49b2e9bd1ac619e"
  }, {
    "url": "js/vendors~main.index.5611aa600c.js",
    "revision": "3278bd9392caae1ca0ef0d2bbb4b7897"
  }], {});

});
//# sourceMappingURL=service-worker.js.map
