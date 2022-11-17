/*
 * Here we load our javascript and css resources
 *
 * We also handle loading and caching of templates
 */
function progress_bump(step) {
   var progLastval = Number($('progress#loading').attr('value'));
   $('progress#loading').attr('value', progLastval + step);
}

function loader($loader_js, $loader_css, $loader_templates, $callback) {
    console.log("Loader.js called");
    console.log("greetings from PripyatAutomations!");
    console.log("Please report bugs to remotepi-bugs@istabpeople.com");
    console.log("Include as much information as possible on how to reproduce the bug, including your browser version and OS.");

    // Zero the progress bar
    $('progress#loading').value = 0;

    // count array entries and figure out how much of progress bar
    // each item should represent, this lets us have a smooth progress bar...
    var progStepItems = $loader_js.length + $loader_css.length + $loader_templates.length;
    var $progStep = Math.round(100 / progStepItems);

    // Fetch javascript synchronously, so we can fallback to cache or CDN as needed...
    $.each($loader_js, function(k, v) {
      $.ajax({
          async: false,
          url: "js/" + v + ".min.js",
          dataType: "script"
      })
        .fail(function(jqxhr, settings, exception) {
           // no minified version
           $.ajax({
               async: false,
               url: "js/" + v + ".js",
               dataType: "script"
           })
             .done(function() {
               console.log("LOAD js:" + v + " => dev OK");
             })
             .fail(function(jqxhr, settings, exception) {
               console.log("LOAD js:" + v + " => FAIL");
             });
        })
        .done(function() {
           console.log("LOAD js:" + v + " => min OK");
        });
        progress_bump($progStep);
    });

    // Fetch CSS
    $.each($loader_css, function(k, v) {
      console.log("LOAD css:" + v);
      $('<link>')
        .appendTo('head')
        .attr({
           type: 'text/css', 
           rel: 'stylesheet',
           href: '/css/' + v + '.css'
        });
        progress_bump($progStep);
    });

    // Pre-fetch templates
    $.each($loader_templates, function(k, v) {
       console.log("LOAD tmpl:" + v);
       template_fetch(v, '/views/' + v + '.hbs');
       progress_bump($progStep);
    });

    // Add a slight delay for visual appeal, in case we loaded fast...
    setTimeout(function() {
       $('div#loading').hide('slow');
       $('div#loadingsplash').hide('slow');

       if ($callback != null && $callback != undefined) {
          $callback();
       }
    }, 1200);
}

// Retrieve a template either from cache or remote URL
function template_fetch($name, $url) {
   var $cached = template_cache_try($name);

   if ($cached != null) {
      return $cached;
   } else {
      // Retrieve it
      var $data = null;
      var $req = $.ajax({
         cache: false,
         context: document.body,
         url: $url,
         timeout: 30000
      })
        .done(function(data) {
           $data = data;
           console.log("CACHE FETCH " + $name + " from " + $url);
           // Save it in the cache
           template_cache_add($name, $url, $data);
        })
        .fail(function() {
           console.log("FETCH FAIL " +$name + " " + $url);
           alert("Couldn't load resource: " + $name + ", try refreshing.");
        });

      return $data;
   }
}

function template_cache_add($name, $url, $data) {
   console.log("CACHE STORE: tmpl:" + $name + " <" + $url + ">");
//   return $.handlebarTemplates.compiled_template[$name] = Handlebars.precompile($data);
   return null;
}

// return template, if exists
function template_cache_try($name) {
   // Look up the cache item
//   var $tmpl = $.handlebarTemplates.compiled_template[$name];
   var $tmpl = null;

   if ($tmpl != undefined && $tmpl != null) {
      console.log("CACHE HIT: tmpl:" + $name);
      return $tmpl;
   }

   // Return null since its not found
   return null;
}
