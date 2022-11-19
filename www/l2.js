function stash_flush(dataset) {
   Stash.removeItem(dataset + "/Data");
   Stash.removeItem(dataset + "/Fetched");
   Stash.removeItem(dataset + "/Remote");
   Stash.removeItem(dataset + "/Lifetime");
   console.log("[cache] FLUSH " + dataset);
}

function stash_remote(dataset, remote_url, lifetime, prefetch, callback) {
   let $rv = null;
   Stash.setItem(dataset + "/Lifetime", lifetime);
   Stash.setItem(dataset + "/Remote", remote_url);
   console.log("[cache] REMOTE dataset '" + dataset + "' lifetime: " + lifetime + "remote (" + remote + ")");

   if (prefetch)
      $rv = stash_fetch(dataset);

   if (callback !== undefined) {
      callback($rv);
   }
}

// Store some data, for at least lifetime (up to browse to expire it)
function stash_data(dataset, data, lifetime) {
   Stash.setItem(dataset + "/Lifetime", lifetime);
   Stash.setItem(dataset + "/Data", data);
}

function stash_fetch(dataset) {
   var res = null;
   var fetched = fetched = Stash.getItem(dataset + "/Fetched");
   var ttl = (300 - (ctime - fetched));

   // In offline mode, we ignore cache TTLs...
   if (Stash.OfflineMode == true) {
      res = JSON.parse(Stash.getItem(dataset + "/Data"));
      console.log("[cache] OFFLINE, using stored dataset'" + dataset + "' with ttl " + ttl + " due to offline status.");
   } else if (fetched != null) {
      if (ttl > 0) {
         res = JSON.parse(Stash.getItem(dataset + "/Data"));

         // Did we successfully parse the JSON data?
         if (res != null) {
            console.log("[cache] HIT dataset '" + dataset + "' ttl="  + ttl + " seconds (Saved: " + res.length + " bytes!)");
            Stash.CacheHits++;
            var sb = Number(Stash.BytesSaved)
            sb += res.length;
            Stash.ByteSaved = sb;
         } else
            console.log("[cache] localStorage contained corrupt dataset '" + dataset + "' JSON data, ignoring.");
      } else {
            Stash.CacheExpired++;
            console.log("[cache] EXPIRED dataset '" + dataset + "' ttl=" + ttl + " seconds");
      }
   }

   // If we are in offline mode, we cannot update...
   if (Stash.OfflineMode == true) {
      console.log("[cache] FAIL dataset '" + dataset + "' not in cache and cannot update from remote due to offline status.");
      return;
   }

   // If the cache did not return anything, try to update... 
   if (!res || res.length < 1) {
      Stash.CacheMisses++;

      // Figure out a proper url...
      var remote = Stash.getItem(dataset + "/Remote");

      if (!remote) {
         console.log("[cache] No remote for dataset '" + dataset + "', returning null");
         return null;
      }

      $.get(remote,
          function(data) {
              Stash.setItem(dataset + "/Fetched", ctime);
              Stash.setItem(dataset + "/Data", JSON.stringify(data));
              console.log("[cache] REFRESH dataset '" + dataset + "' from remote (" + remote + ") was succesful.");
              res = data;
          })
          .fail(function(data) {
              console.log("[cache] FAIL datasest '" + dataset + "' refresh from remote (" + remote + ") failed.");
              wtf_flush(dataset);
          });
   }

   return res;
}

class Loader {
  static css(url) {
    return new Promise((resolve, reject) => {
      this._load("link", url, resolve, reject);
    });
  }

  static js(url) {
    return new Promise((resolve, reject) => {
      this._load("script", url, resolve, reject);
    });
  }

  static _load(tag, url, resolve, reject) {
    let element = document.createElement(tag);
    let attr;
    let parent;

    // resolve and reject for the promise
    element.addEventListener("load", () => {
      resolve(url);
    });
    element.addEventListener("error", () => {
      reject(url);
    });

    // set different attributes depending on tag type
    switch (tag) {
      case "script":
        parent = "body";
        attr = "src";
        element.async = false;
        break;
      case "link":
        parent = "head";
        attr = "href";
        element.type = "text/css";
        element.rel = "stylesheet";
        break;
      default:
        throw new Error("Unsupported tag.");
    }

    // set the url for the element
    element[attr] = url;

    // initiate the loading of the element
    document[parent].appendChild(element);
  }
}

/* * load and execute a script *
$.ajax({
  method: "GET",
  url: "test.js",
  dataType: "script"
});
*/
