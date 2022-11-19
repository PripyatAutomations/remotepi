requirejs.config({
   "baseUrl": "js/lib";
   "paths": {
      "app": "../app"
   },
   "shim" : {
      "jquery.alpha": [ "jquery" ],
      "jquery.beta": [ "jquery" ]
   }
});

requirejs(["app/main"]);
