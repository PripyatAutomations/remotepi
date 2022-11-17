/*
 * Support some basic windowing in two modes:
 *
 *  Tiling - Multiple windows allowed on screen in grid layout
 *  Tabbed - Show only one window a time, with a tab-strip to quickly switch
 * Overlap - 'unmanaged' mode (until we add the other two)
 */
var $wm = {
   mode: 'overlap',
   max_windows: 10		// limit how windows in overlap way?
};

// Window object we duplicate
const $rpWindow = {
   // Metadata
   description: null,
   name: 'untitled',
   id: null,
   template: null,

   // Window position and size
   height: 0,
   width: 0,
   x_pos: 0,
   y_pos: 0
};

function generate_window_uuid() {
   var uuid = null;
   return uuid;
}

function show_window($name, $style) {
   // Does the window already exist?
   var $win = find_window($name);

   if ($win != undefined && $win != null) {
      console.log("Showing hidden window: " + $name + "(" + $style + ")");
      $win.show();
   } else
      return null;
}

function new_window($name, $url, $style) {
   // clone the default window objec
   $win = Object.create($rpWindow);
   $win.name = $name;
   $win.id = generate_window_uuid();
   var $newDiv = template_fetch($name, '/views/' + $name + '.hbs');
   console.log("Showing new window: " + $name + "(" + $style + ")");
   console.log($newDiv);

   // XXX: Create a new window with the object
   if ($style == "main") {
      // 'main' is special
   } else if ($style == "modal") {
      // modal windows 
   }

   // attach the new div to DOM
}

function hide_window($name) {
   var $win = find_window($name);
   $.each($win, function() { $($(this).id).hide('fast');  });
}

// Returns an array of one or more windows
function find_window($name = null) {
   if ($name == null || $name == '*') {
      var $wins = new Array();
      var $windows = 0;
      // Return an array of all windows
      $('div#win_*').each(function(index) {
         $wins.push($(this));
         $windows++;
      });

      if ($windows == 0)
         return $wins;
   } else {
      $('div#win_' + $name).each(function(index) {
         $wins.push($(this));
         $windows++;
      });
      if ($wins != undefined && $wins != null && $wins.length > 0)
         return $wins;
   }
   return null;
}

function close_window($name) {
   var $win = find_window($name);

   if ($win != undefined && $win != null) {
      // Window found
      // XXX: Call destructor
      // XXX: Discard the DOM element and it's children
   }
}

//////////////////////
// Window Placement //
//////////////////////

// Try to fit a window without overlaps
function rearrange_windows($name, $new_width, $new_height, $preferred_x, $preferred_y) {
}

// Move a window around the grid (tiling) layout
function move_window($name, $new_x, $new_y) {
   // XXX: Is there a window here already?
   // - Yes? Try to figure out rearranging to fit our window
   // -- No? Move our window
}

// Resize the window in grid (tiling) layout
function resize_window($name, $new_width, $new_height) {
   // Does this cause overlap?
   // - Yes? Try to re-arrange
   // -- No? Resize the window
}
