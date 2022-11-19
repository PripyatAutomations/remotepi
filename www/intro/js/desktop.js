////////////////
// desktop.js //
////////////////
// This is my attempt to make a themeable, lightweight desktop in jQuery!
//
// I'm trying to keep the code legible as a teaching exercise, so don't
// mind the verbosity!
//
// ~jm 20180729
//
/////////////
// GLOBALS //
/////////////
var stash = localStorage;	// shorthand for localStorage
var ctime = 0;			// posix time();
var ow_status = null;		// Status line
var ow_statusMessages = null;	// Messages box
var Debugging = false;		// Are we debugging? This is slower and noisy...
var VisitTime = 0;		// How long has the user been here?
var LastKeepAlive = 0;		// When was the last time we sent a server request?
var kbd_CmdString = null;	// Command string stored (if Escaped)
var kbd_Escaped = false;	// Has the user hit the command key (!)?
var periodic = null;		// Our periodic timer instance
var WebampPlayer = null;	// Our instance of webamp

// Is selector visible?
function is_vis(selector) { if ($(selector).is(':visible')) { return true; } else { return false; } }

// Create a 24-hour time string, zero padded, with seconds
function ow_ClockTime(now) {
   var hr = now.getHours();
   var min = now.getMinutes();
   var sec = now.getSeconds();
   var p_h = (hr < 10 ? "0" : "") + hr;
   var p_m = (min < 10 ? "0" : "") + min;
   var p_s = (sec < 10 ? "0" : "") + sec;
   var out = p_h + ":" + p_m + ":" + p_s;

   return out;
}

function ow_Periodic() {
   var now = new Date();
   ctime = Math.round(now.getTime() / 1000);
   var clock = ow_ClockTime(now);
   VisitTime++;			// INC Seconds user on page

   /////////////////
   // Update html //
   /////////////////
   // section:taskbar
   $('#ow_taskbarClock, #ow_Clock').text(clock);
   $('#ow_taskbarClock, #ow_Clock').prop('title', '[' + ctime + ']');
   // section:status
   $('#ow_BytesSaved').html(stash.BytesSaved + " byte(s)");
   $('#ow_CacheHits').html(stash.CacheHits + " request(s)");
   $('#ow_CacheMisses').html(stash.CacheMisses + " request(s)");
   $('#ow_CacheExpired').html(stash.CacheExpired + " request(s)");
   $('#ow_VisitTime').html(VisitTime + " second(s)");

   $('#ow_LocalStorage').html(ow_LocalStorageUsage() + ' kbytes');
   ////////////////////////////
   // Refresh the status bar //
   ////////////////////////////
   if (stash.OfflineMode == false)
      ow_status = '[OFFLINE]'
   else
      ow_status = '[ONLINE]';
   $('#ow_OfflineMode').html(ow_status);

   // Show debugging status
   if (Debugging)
      ow_status += ' +DEBUG';

   // Are we in command input mode?
   if (kbd_Escaped)
      ow_status += ' +CMD';

   // Redraw the status box
   $('#ow_footerStatus').html(ow_status);

   // Once a minute, change the background ascii ;)
   if ((VisitTime % 60) == 0) {
      // Spin a few times before reloading the ascii..
      ow_ChangeBackground();
   }
}

function ow_deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function ow_NukeNBurn() {
   stash.clear();
   sessionStorage.clear();
   ow_deletAllCookis();
}

function ow_NotificationCheck(silent) {
   // If we have stash setting of disabled, don't even pester the user!
   if (stash.notifications == false) return false;

   // Do we support desktop notifications?
   if (Notification)  {
      // Request permision to show notifications
      if (Notification.permission !== "granted")
         Notification.requestPermission();

      // Nope, the user doesn't want notifications
      if (Notification.permission !== "granted") {
         stash.notifications = false;
         console.log("[ow:core] Disabling notifications per user request");
      } else { // Cool! They've accepted notifications from us. Let's not abuse it!
         stash.notifications = true;
      }
   } else {
     // make sure we don't try again...
     stash.notifications = false;

     console.log("[ow:core] Disabling notifications due to lack of browser support.");

     if (!silent)
        alert('Desktop notifications not supported. It\'s OK but you\'ll lose some features. Please try a more modern browser or enable notifications');
   }
}

// Display a notification... ;)
function ow_NotificationDesktop(icon, title, body) {
   if (stash.notifications == false) return;

   // Do we support notifications?
   if (Notification) {
      var notice = new Notification(title,
      {
         icon: icon,
         body: body,
      });
      notice.onclick = function() {
      // Session:alerts.Acknowledge()
      }
   }
}

function ow_Notification(priority, message) {
   var icon = null;

   if (stash.notifications == false) return;

   ow_NotificationDesktop(icon, "odn", message);
}

function ow_LocalStorageCheck() {
   if (typeof(Storage) !== "undefined") {
      return true;
   } else {
      return false;
   }
}

function ow_LocalStorageLoad() {
    var tmp;

    if (tmp = stash.getItem("VisitTime"))
       VisitTime = Number(tmp);

    if (stash.getItem("Debugging") == true)
        Debugging = true;
}

function ow_LocalStorageSave() {
    stash.setItem("VisitTime", VisitTime);
    stash.setItem("Debugging", Debugging);
}

function ow_LocalStorageUpload() {
   ow_Notification("notice", "Uploading session state...");
}

function ow_LocalStorageUsage() {
   var allStrings = '';

   for (var key in window.stash) {
      if (window.stash.hasOwnProperty(key)) {
         allStrings += window.stash[key];
      }
   }
   var res = 3 + ((allStrings.length*16)/(8*1024));
   var final = Math.round(res * 100) / 100;
   return final;
}

function ow_ToggleDebugging() {
      if (Debugging) {
         Debugging = false;
         $('#ow_debugger').fadeOut("fast");
      } else {
         Debugging = true;
         $('#ow_debugger').fadeIn("slow");
      }

      stash.Debugging = Debugging;
}

function ow_ToggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
     if (document.documentElement.requestFullScreen) {  
        document.documentElement.requestFullScreen();  
     } else if (document.documentElement.mozRequestFullScreen) {  
        document.documentElement.mozRequestFullScreen();  
     } else if (document.documentElement.webkitRequestFullScreen) {  
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
     }  
  } else {  
     if (document.cancelFullScreen) {  
        document.cancelFullScreen();  
     } else if (document.mozCancelFullScreen) {  
        document.mozCancelFullScreen();  
     } else if (document.webkitCancelFullScreen) {  
        document.webkitCancelFullScreen();  
     }  
  }  
}

function ow_ChangeBackground() {
   // We rely on caching of the actual text files to make this
   // efficient. It shouldn't take much space in the browser cache ;)
   // This gives a 302 Location header to send us to proper text
   $.get( "/randombg.php", function(data) {
       $("#ow_deskbg_dynamic" ).html('<pre>' + data + '</pre>');
   }).fail(function(data) {
       // Nothing yet
   });
}

//////////////////
// Cache system //
//////////////////
function ow_CacheFlush(dataset) {
    stash.removeItem(dataset + "Data");
    stash.removeItem(dataset + "Fetched");
    console.log("[ow:cache] FLUSH '" + dataset + " ' succesful.");
}

// Add a dataset to the cache manager
function ow_CacheRegister(dataset, remote, lifetime, prefetch) {
   stash.setItem(dataset + "Lifetime", lifetime);
   stash.setItem(dataset + "Remote", remote);

//   console.log("[ow:cache] REGISTER dataset '" + dataset + "' lifetime " + lifetime + " remote (" + remote + ")");

   if (prefetch)
      ow_CacheGet(dataset);
}

// Remove a dataset from the cache manager
function ow_CacheUnregister(dataset) {
   stash.removeItem(dataset + "Data");
   stash.removeItem(dataset + "Fetched");
   stash.removeItem(dataset + "Lifetime");
   stash.removeItem(dataset + "Remote");
}

function ow_CacheStore(dataset, data, lifetime) {
   stash.setItem(dataset + "Lifetime", lifetime);
   stash.setItem(dataset + "Data", data);
}

function ow_CacheGet(dataset) {
   var res = null;
   var fetched = fetched = stash.getItem(dataset + "Fetched");
   var ttl = (300 - (ctime - fetched));

   // In offline mode, we ignore cache TTLs...
   if (stash.OfflineMode == true) {
      res = JSON.parse(stash.getItem(dataset + "Data"));
      console.log("[ow:cache] OFFLINE Using stored dataset'" + dataset + "' with ttl " + ttl + " due to offline status.");
   } else if (fetched != null) {
      if (ttl > 0) {
         res = JSON.parse(stash.getItem(dataset + "Data"));

         // Did we successfully parse the JSON data?
         if (res != null) {
            console.log("[ow:cache] HIT dataset '" + dataset + "' ttl="  + ttl + " seconds (Saved: " + res.length + " bytes!)");
            stash.CacheHits++;
            var sb = Number(stash.BytesSaved)
            sb += res.length;
            stash.ByteSaved = sb;
         } else
            console.log("[ow:cache] localStorage contained corrupt dataset '" + dataset + "' JSON data, ignoring.");
      } else {
            stash.CacheExpired++;
            console.log("[ow:cache] EXPIRED dataset '" + dataset + "' ttl=" + ttl + " seconds");
      }
   }

   // If we are in offline mode, we cannot update...
   if (stash.OfflineMode == true) {
      console.log("[ow:cache] FAIL datasest '" + dataset + "' not in cache and cannot update from remote failed due to offline status.");
      return;
   }

   // If the cache did not return anything, try to update... 
   if (!res || res.length < 1) {
      stash.CacheMisses++;
      // Figure out a proper url...
      var remote = stash.getItem(dataset + "Remote");

      if (!remote) {
         console.log("[ow:cache] No remote for dataset '" + dataset + "', returning null");
         return null;
      }

      $.get(remote,
          function(data) {
              stash.setItem(dataset + "Fetched", ctime);
              stash.setItem(dataset + "Data", JSON.stringify(data));
              console.log("[ow:cache] REFRESH dataset '" + dataset + "' from remote (" + remote + ") was succesful.");
              res = data;
          })
          .fail(function(data) {
              console.log("[ow:cache] FAIL datasest '" + dataset + "' refresh from remote (" + remote + ") failed.");
              ow_CacheFlush(dataset);
          });
   }

   return res;
}

// For storing anonymous (no remote) data with a limited lifetime that should remain available offline (mail, etc)
function ow_CacheStore(dataset, data, lifetime) {
   stash.setItem(dataset + "Lifetime", lifetime);
   stash.setItem(dataset + "Data", data);
}

function ow_MenuToggle() {
     var menuData;
     // If menu not visible, query the cache and diplay the menu
     if (!is_vis('#ow_menu')) {
        menuData = ow_CacheGet('menu');
        $('#ow_menuData').html(menuData);
        $('#ow_menu').fadeIn("slow");
     } else
        $('#ow_menu').fadeOut("fast");
}

//////////////////
// Test Harness //
//////////////////
function TestFunction() {
  $('head').append('<style type=text/css>'+$(this).prev().val()+'<\/style>');
  $().WM('open');
}

///////////////////////////
// Process 'Cheat' codes //
///////////////////////////
// Example link: <a href="#" onClick="CheatCode('code');">Click Here</a>
function CheatCode(cmdstr) {
   var cmd = null
 
   // XXX: Split off arguments here?
   // Clear 'current command ...' in help
   $('#ow_CCCmdString').html('');

   // Hide help menu
   $('#ow_CCHelp').fadeOut("slow");
   kbd_Escaped = false;

   if (cmdstr == null) {
      kbd_CmdString = null;
      return;
   } else
     cmd = cmdstr.toLowerCase();

   if (cmd == "bg") {
      ow_ChangeBackground();
   } else if (cmd == "debug" || cmd == "db") {
      ow_ToggleDebugging();
      stash.Debugging = Debugging;

      console.log("[ow:core] Toggled debugging: " + Debugging);
   } else if (cmd == "flush" || cmd == "fl") {
      ow_CacheFlush('*');
   } else if (cmd == "help") {
      // Show the help text (press ESCape to close)
      $('#ow_CCHelp').fadeIn("slow");
   } else if (cmd == "load" || cmd == "ld") {
   } else if (cmd == "logout" || cmd == "bye") {
      location.replace('/api/auth.logout/');
   } else if (cmd == "offline" || cmd == "ol") {
      if (stash.OfflineMode == true) {
         console.log("[ow:core] Switching to online mode");
         stash.OfflineMode = false;
         ow_CacheFlush('*');
         // Preload the menu and help into the cache
         ow_CacheGet('menu');
         ow_CacheGet('help');
      } else {
         stash.OfflineMode = true;
         console.log("[ow:core] Switching to offline mode");
      }	
   } else if (cmd == "reload" || cmd == "rl") {
      console.log("[ow:core] Got reload command. Refreshing the page. See you soon!");
      $('#ow_loading').show("fast");
      location.reload();
   } else if (cmd == "save" || cmd == "wr") {
      ow_LocalStorageUpload();
   } else if (cmd == "sql") {
      alert("You do not have access to execute SQL.");
      console.log("[ow:admin] SQL access denied.");
   } else if (cmd == "status" || cmd == "st") {
      $('#ow_status').fadeIn("fast");
   } else if (cmd == "test") {
     TestFunction();
   } else if (cmd && cmd.length > 0)
     alert("Unknown command: '" + cmd + "', please try again");

   kbd_CmdString = null;
}

////////////////////////
// Handle key presses //
////////////////////////
function ow_KeyHandler(event) {
   // Backspace
   if (event.which == 8 || event.key == "Backspace") {
      if (kbd_Escaped) {
         kbd_CmdString = kbd_CmdString.slice(0, -1);
         event.preventDefault();
      }
   // TAB key press
   } else if (event.keyCode == 9 || event.which == 9) {
   // ENTER key pressed
   } else if (event.keyCode == 13 || event.which == 13) {
     // End command input
     if (kbd_Escaped) {
        kbd_Escaped = false;
        CheatCode(kbd_CmdString);
        event.preventDefault();
     }
   // ESCape key pressed
   } else if (event.keyCode == 27 || event.which == 27) {
      // Hide all system overlay windows on ESCape press...
      $('.ow_menu').each(function(idx) {
          if (is_vis($(this))) $(this).fadeOut("fast");
      });
      // End command entry mode and clear the buffer...
      if (kbd_Escaped)
         CheatCode(null);

      event.preventDefault();
   // PGUP key pressed
   } else if (event.keyCode == 33 || event.which == 33) {
//      alert("PGUP");
//      var Sfocused = $(document.activeElement);
//      var y = $focused.scrollTop();
//      var ht = $focused.height();
//      $focused.scrollTop(y+(ht/2));
//      event.preventDefault();
   // PGDN key pressed
   } else if (event.which == 34) {
//      alert("PGDN");
//      var Sfocused = $(document.activeElement);
//      var y = $focused.scrollTop();
//      var ht = $focused.height();
//      $focused.scrollTop(y+(ht/2));
//      event.preventDefault();
   // UP key pressed
   } else if (event.keyCode == 38 || event.which == 38) {
      if (is_vis('.ow_menu')) {
         // Iterate over the currently active ul/ol
//         $('.ow_menu :focus').parent().prev().focus();
      }
   // DOWN key pressed
   } else if (event.keyCode == 40 || event.which == 40) {
      if (is_vis('.ow_menu')) {
//         $('.ow_menu :focus').parent().next().focus();
      }
   // ! key pressed - start command entry
   } else if (event.key == '!') {
     kbd_Escaped = true;
     kbd_CmdString = null;
     $('#ow_menu').hide();
     $('#ow_CCCmdString').html('');
     $('#ow_CCCmdString').fadeIn(1500);

     // Show command mode help
     if (!is_vis('#ow_CCHelp'))
        $('#ow_CCHelp').fadeIn(900);
   // Tilde (~) key pressed
   } else if (event.which == 192 || event.which == 126) {
     if (is_vis('#ow_CCHelp'))
        CheatCode('');

     ow_MenuToggle();
     event.preventDefault();
     // Unknown key... Are we in command mode?
   } else if (event.which == 116) {
     // F5 key -- This should do the same as !flush (ie: reload data not page)
     ow_CacheFlush('*');
     // XXX: Ask if user wants to reload the page?
     event.preventDefault();
   } else {
     // Are we in command input mode?
     if (kbd_Escaped) {
        // Ignore special keys...
        var keycode = event.keyCode;
        var valid = 
          (keycode > 47 && keycode < 58)   || // number keys
          keycode == 32 ||		      // space
          (keycode > 64 && keycode < 91)   || // letter keys
          (keycode > 95 && keycode < 112)  || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (event.key == '=') ||
          (keycode > 218 && keycode < 223);   // [\]' (in order)

        if (valid) {
           // Append or initialize?
           if (kbd_CmdString)
              kbd_CmdString += event.key;
           else
              kbd_CmdString = event.key;
        } else
           console.log("[ow:input] Unknown keydown: which: " + event.which + ", keycode:e " + event.keyCode + ", key: " + event.key);
        event.preventDefault();
     }
   }

   // The user is still typing their command - update the displayed input
   if (kbd_Escaped) {
      var cmd = '';

      if (kbd_CmdString)
         cmd = kbd_CmdString;

      $('#ow_CCCmdString').html('CMD> ' + cmd);
   }
}

function ow_Connect() {
}

// Stuff to do once, after everything is fully loaded (not just DOM)...
function StartGUI() {
//   var defTitle = 'mkOS shell:';
   $('#ow_loading').fadeOut();
//   document.title = defTitle + ' ready';

   // Apply chromaHash to all password fields (Why this no work the simple way???)
   var chash_fields = [ 'input#user', 'input#pwd', 'input#pass', 'input[type=password]' ];
   chash_fields.forEach(function(item) { $(item).chromaHash({ bars: 3} ); });
   $('input#user, input#pwd, input#pass, input[type=password]').chromaHash({ bars: 3} );
   ow_ChangeBackground();
   periodic = setInterval(function() { ow_Periodic(); }, 1000);
   $('#ow_menuButton').click(function() { ow_MenuToggle();  });

   // Register caches and prefetch
   ow_CacheRegister("menu", "/api/help/?notheme", 300, true);
   ow_CacheRegister("help", "/api/help/?notheme", 3600, true);
   // Handle keyboard events
   $(document).keydown(function(event) { ow_KeyHandler(event); });
}

function webamp_Show() {
  const Webamp = window.Webamp;
  if (!WebampPlayer) {
     var WebampPlayer = new Webamp({
         initialTracks: [{
            metaData: {
              artist: "DJ Mike Llama",
              title: "Llama Whippin' Intro"
            },
            url: "https://cdn.rawgit.com/captbaritone/webamp/43434d82/mp3/llama-2.91.mp3",
            duration: 5.322286
         }],
     });
     WebampPlayer.renderWhenReady(document.getElementById('webamp'));
     $('.ow_menu').fadeOut("fast");
   } else {
     // summon closed player window
   }
}

/////////////////////////
// ON LOAD: (domready) //
/////////////////////////
$('document').ready(function() {
   console.log("[ow:core] Greetings from osdev.ninja staff! We bring to you greatest inventions of soviet glory!");

   if (!ow_LocalStorageCheck()) {
      console.log("[ow:core] Your browser lacks WebStorage... That's unfortunate because I haven't yet made a suitable shim. :(");
      alert("This site requires WebStorage to be work properly... We are working to create a version for users with older browsers.");
   }
   // Load some performance statistics from the localStorage...
   ow_LocalStorageLoad();
   ow_NotificationCheck(true);
   if (stash.Debugging == true)
      Debugging = true;

   StartGUI();
});

/* for now this only happens from cmd: !load (ld) or !save (wr)
////////////////////////////
// ON EXIT (beforeunload) //
////////////////////////////
$(window).on('beforeunload', function() {
    var x = logout();
    return x;
});

function logout(){
//    jQuery.ajax({
//    });
   CheatCode('save');
   console.log("[ow:core] See you later! Have a great day!");
   return true;
}
*/


///////////////////////////////////////////
///// !! DANGER !! DANGER !! DANGER !! ////
///////////////////////////////////////////
// This code MUST match the API version of the server script. Eventually
// I plan to move the protocol to it's own library (once i get the lazy loader
// working ;)
// Try not to puke ;)

function ow_SendMsg(data) {
}
