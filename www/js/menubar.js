function menu_redraw($state) {
   var last_val = $('button#menu').attr('value');
   $('button#menu').attr('value', $state);

   if ($state == true) {
      console.log("Opening menu");
      // XXX: regenerate the menu....
      // redraw it...
      $('div#menu').show('slow');
   } else if ($state == false) {
      console.log("Closing menu");
      $('div#menu').hide('slow');
   } else {
      alert("menu is broken");
   }
}
