/*!
 * Simone - taskbar widget, JavaScript
 *
 * Copyright 2014 Cezary Kluczyński and other authors
 * Version: 0.1.9
 * Released under the MIT license.
 *
 * http://cezarykluczynski.github.io/simone/docs/index.html
 * http://cezarykluczynski.github.io/simone/docs/taskbar.html
 */
;(function ( $, undefined ) {
"use strict";
/*jshint laxbreak:true,-W030,maxcomplexity:60,smarttabs:true,-W004,-W044*/
$.widget( "simone.taskbar", {
	version: "0.1.9",
	options: {
		/* options */
		autoHide                     : false,
		buttons                      : null,
		buttonsOrder                 : [],
		buttonsTooltips              : false,
		clock                        : false,
		clockShowDatepicker          : true,
		debug                        : {
			environment              : true,
			options                  : true,
			localization             : true
		},
		draggable                    : false,
		draggableBetweenEdges        : true,
		dropOnExisting               : false,
		durations                    : {
			buttonsTooltipsHide      : true,
			buttonsTooltipsShow      : true,
			autoHideDelay            : 1200,
			autoHideHide             : "slow",
			autoHideShow             : "fast"
		},
		fallbackLanguage             : "en",
		icons                        : {
			clock                    : null,
			languageSelect           : null,
			menuWindowClose          : "ui-icon-closethick",
			minimizeAll              : "ui-icon-minusthick",
			networkMonitorOffline    : "ui-icon-alert",
			networkMonitorOnline     : "ui-icon-signal",
			startButton              : null,
			startButtonSet           : "ui-icon-circle-triangle",
			toggleFullscreenOff      : "ui-icon-arrow-4-diag",
			toggleFullscreenOn       : "ui-icon-arrow-4-diag"
		},
		horizontalRowHeight          : "auto",
		horizontalRows               : 1,
		horizontalRowsMin            : 1,
		horizontalRowsMax            : 2,
		horizontalStick              : "bottom left",
		horizontalWidth              : "100%",
		language                     : "en",
		languages                    : [ "en" ],
		languageSelect               : false,
		localization                 : {},
		menuAutoOpenOnBrowse         : true,
		minimizeAll                  : true,
		minimizeAllHoverOpaqueWindows: true,
		networkMonitor               : false,
		orientation                  : "horizontal",
		propagateWindowBlur          : false,
		resizable                    : false,
		resizableHandleOverflow      : 2,
		resolveCollisions            : true,
		startButtons                 : true,
		systemButtonsOrder           : [ "languageSelect", "networkMonitor",
		                                 "toggleFullscreen", "clock",
		                                 "minimizeAll" ],
		toggleFullscreen             : false,
		verticalColumns              : 1,
		verticalColumnsMax           : 2,
		verticalColumnsMin           : 1,
		verticalColumnWidth          : 100,
		verticalHeight               : "100%",
		verticalStick                : "top right",
		viewportMargins              : {
			top                      : [ 0, "correct" ],
			right                    : [ 0, "correct" ],
			bottom                   : [ 0, "correct" ],
			left                     : [ 0, "correct" ]
		},
		windowButtonsIconsOnly       : false,
		windowButtonsSortable        : true,
		windowsContainment           : "viewport",
		windowsInitialZIndex         : 100,

		/* events */
		       autoHideStart   : null,
		       autoHideProgress: null,
		       autoHideStop    : null,

		create                 : null,

		debugLogAdd            : null,

		                 bind  : null,
		                 unbind: null,

		beforeDestroy          : null,

		              dragStart: null,
		              drag     : null,
		              dragStop : null,

		             beforeDrop: null,
		                   drop: null,

		    beforeDroppableOver: null,
		          droppableOver: null,

		     beforeDroppableOut: null,
		           droppableOut: null,

		           elementClose: null,
		           elementOpen : null,

		languageChange         : null,

		          menuItemBlur : null,
		          menuItemFocus: null,

		          beforeRefresh: null,
		                refresh: null,

		beforeRequestFullscreen: null,
		      requestFullscreen: null,

		            resizeStart: null,
		            resize     : null,
		            resizeStop : null,

		         sortableStart : null,
		         sortableSort  : null,
		         sortableChange: null,
		         sortableStop  : null,
	},

	_cnst: {
		dataPrefix                : "simone-",
		eventPrefix               : "simonetaskbar",
		naturalName               : "Simone",
		consolePrefix             : "Simone message",
		missingTranslation        : "undefined",
		resizeDelay               : 100,
		autoHideRestartDelay      : 100,
		resizableHandleOverflowMax: 3,
	},

	_systemButtons             : [
		"languageSelect",
		"minimizeAll",
		"toggleFullscreen",
		"networkMonitor",
		"clock"
	],

	_systemButtonsWithSingleIcons: [
		"languageSelect",
		"minimizeAll",
		"clock"
	],

	_optionsPositiveIntegers   : [
		"horizontalWidth",
		"resizableHandleOverflow",
		"horizontalRows",
		"horizontalRowsMin",
		"verticalHeight",
		"verticalColumns",
		"verticalColumnsMin",
		"verticalColumns",
		"verticalColumnWidth"
	],

	_optionsPossiblePercentages: [
		"horizontalWidth",
		"verticalHeight",
		"verticalColumnWidth"
	],

	classes: {
		taskbar                         : "simone-taskbar",
		taskbarPrefix                   : "simone-taskbar-",
		taskbarHorizontal               : "simone-taskbar-horizontal",
		taskbarVertical                 : "simone-taskbar-vertical",
		taskbarStickTop                 : "simone-taskbar-stick-top",
		taskbarStickBottom              : "simone-taskbar-stick-bottom",
		taskbarStickRight               : "simone-taskbar-stick-right",
		taskbarStickLeft                : "simone-taskbar-stick-left",
		taskbarStickPrefix              : "simone-taskbar-stick-",
		taskbarWithOpenElements         : "simone-taskbar-with-opened-elements",
		container                       : "simone-taskbar-container",
		startButton                     : "simone-taskbar-start-button",
		windowButton                    : "simone-taskbar-window-button",
		separator                       : "simone-taskbar-separator",
		startButtonsContainer           : "simone-taskbar-start-container",
		buttonsContainer                : "simone-taskbar-buttons-container",
		systemButtonsContainer          : "simone-taskbar-system-buttons-container",
		systemButtonsSeparator          : "simone-taskbar-system-buttons-separator",
		windowButtonsContainer          : "simone-taskbar-window-buttons-container",
		windowButtonsContainerFirstChild: "simone-taskbar-window-buttons-container-first-child",
		windowButtonsContainerOnlyChild : "simone-taskbar-window-buttons-container-only-child",
		droppableContainer              : "simone-taskbar-droppable-container",
		droppable                       : "simone-taskbar-droppable",
		languageSelect                  : "simone-taskbar-language-select",
		minimizeAll                     : "simone-taskbar-minimize-all",
		toggleFullscreen                : "simone-taskbar-toggle-fullscreen",
		networkMonitor                  : "simone-taskbar-network-monitor",
		clock                           : "simone-taskbar-clock",
		datepicker                      : "simone-taskbar-datepicker",
		draggableHelper                 : "simone-taskbar-helper",
		buttonDisabled                  : "simone-taskbar-button-disabled",
		draggableDragging               : "simone-taskbar-dragging",
		resizable                       : "simone-taskbar-resizable",
		resizableMouseover              : "simone-taskbar-resizable-mouseover",
		resizableResizing               : "simone-taskbar-resizing",
		resizableDisabled               : "simone-taskbar-resizable-disabled",
		empty                           : "simone-taskbar-empty",
		autoHide                        : "simone-taskbar-autohide",
		autoHideMouseOver               : "simone-taskbar-autohide-mouseover",
		autoHideHidden                  : "simone-taskbar-autohide-hidden",
		autoHideHidding                 : "simone-taskbar-autohide-hidding",
		autoHidePending                 : "simone-taskbar-autohide-pending",
		autoHideShowing                 : "simone-taskbar-autohide-showing",
		window                          : "simone-window",
		windowContent                   : "simone-window-content",
		windowTitlebarButtonIcon        : "simone-window-titlebar-button-icon",
		windowManipulationButton        : "simone-window-button",
		windowsContainment              : "simone-taskbar-windows-containment",
		windowCopy                      : "simone-taskbar-window-copy",
		windowGroupMenu                 : "simone-taskbar-window-group-menu",
		windowGroupMenuScroll           : "simone-taskbar-window-group-menu-scroll",
		windowGroupElement              : "simone-taskbar-window-group-element",
		windowGroupElementActive        : "simone-taskbar-window-group-element-active",
		windowMinimizeAllHover          : "simone-taskbar-window-minimize-all-hover",
		windowMinimizeAllUnhover        : "simone-taskbar-window-minimize-all-unhover",
		windowTop                       : "simone-window-top",
		windowUnminimizable             : "simone-window-unminimizable",
		resizeIframe                    : "simone-taskbar-iframe",
		resizeIframeHorizontal          : "simone-taskbar-iframe-horizontal",
		resizeIframeVertical            : "simone-taskbar-iframe-vertical",
		menuWindowClose                 : "simone-taskbar-window-close",
		windowButtonsIconsOnly          : "simone-taskbar-window-buttons-icons-only",
		buttonTooltip                   : "simone-taskbar-button-tooltip",
		hidden                          : "simone-hidden",
		droppableOver                   : "simone-taskbar-droppable-over",
		droppablePending                : "simone-taskbar-droppable-pending",
		taskbarIcon                     : "simone-taskbar-icon",
		taskbarContainter               : "simone-taskbar-container",
		refreshPositionOnce             : "simone-taskbar-refresh-position-once",
		buttonUserDefined               : "simone-taskbar-button-user-defined",
		menuHidden                      : "simone-menu-hidden",

		// jQuery UI classes
		uiMenu                   : "ui-menu",
		uiWidgetContent          : "ui-widget-content",
		uiCornerPrefix           : "ui-corner-",
		uiCornerTl               : "ui-corner-tl",
		uiCornerTr               : "ui-corner-tr",
		uiCornerBl               : "ui-corner-bl",
		uiCornerBr               : "ui-corner-br",
		uiDatepickerHeader       : "ui-datepicker-header",
		uiDraggable              : "ui-draggable",
		uiDroppable              : "ui-droppable",
		uiDraggableDragging      : "ui-draggable-dragging",
		uiResizable              : "ui-resizable",
		uiResizableResizing      : "ui-resizable-resizing",
		uiResizableHandle        : "ui-resizable-handle",
		uiButton                 : "ui-button",
		uiButtonText             : "ui-button-text",
		uiButtonIconPrimary      : "ui-button-icon-primary",
		uiMenuItem               : "ui-menu-item",
		uiDatepicker             : "ui-datepicker",
		uiDatepickerDaysCellOver : "ui-datepicker-days-cell-over",
		uiStateActive            : "ui-state-active",
		uiStateFocus             : "ui-state-focus",
		uiStateHover             : "ui-state-hover",
		uiStateDisabled          : "ui-state-disabled",
		uiStateDefault           : "ui-state-default",
		uiSortable               : "ui-sortable",
		uiTooltip                : "ui-tooltip",
		uiDialogContent          : "ui-dialog-content",
		uiDialogTitlebar         : "ui-dialog-titlebar",
		uiHasDatepicker          : "hasDatepicker",
		uiIcon                   : "ui-icon",
		uiIconBlank              : "ui-icon-blank",
	},

	_create: function () {
		// shortcut
		this.$elem = this.element;

		if ( ! this.$elem.parents().length ) {
			this.$elem.appendTo( "body" );
		}

		// tracks state of various elements of taskbar and holds
		// a bunch of calculated values and options
		this._cache = {
			// cache inline styles so they can be reverted on widget destruction
			inlineCSS                 : this.$elem.attr( "style" ) || "",
			// mutationObserers are instances of MutationObserver class
			// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver;
			// they are stored so they could be later disconnected from DOM
			mutationObservers         : {
				submenus              : []
			},
			// intervals stores ID returned by setInterval function,
			// so they could be cleared when needed
			intervals                 : {
				clock                 : null
			},
			// timeouts stores ID returned by setTimeout function,
			// so they could be cleared when needed
			timeouts                  : {
				autoHide              : null,
				windowResize          : null,
				// used by windows binded to taskbar
				moveToTopForced       : [],
				minimizeAllHoverOpaqueWindowsRevert: null
			},
			// connectedElements are pair of datapicker/submenus/window lists
			// and buttons they are opened with
			connectedElements         : {},
			// whether there are any opened datapicker/submenus/window lists left
			openedElements            : false,
			progress: {
				// whether window buttons are being sorted
				windowButtonsSortable : false,
				taskbarDraggable      : false,
				taskbarResizable      : false,
				windowResizable       : false,
				menuAutoOpenOnBrowse  : false
			},
			horizontalAutoHeight      : false,
			windows                   : {},
			groups                    : {},
			windowButtons             : [],
			internalCallbacks         : {
				afterResolveCollisions: null,
				afterRefresh          : null
			},
			optionSetter              : {
				previousValue         : null
			},
			mousedownTarget           : $(),
			// if set to true, handlers won't be triggered
			suppressEvents            : false,
			resizeCausesRefresh       : false,
			keepCollidedPosition      : false,
			collisions                : this._zeroDirections(),
			suppressSingleGroupClick  : false,
			// unique event prefix
			uep                       : this._cnst.eventPrefix + this.uuid
		};

		// create empty jQuery object for consistency
		this.$windowButtonsContainer  = $();
		this.$systemButtonsContainer  = $();
		this.$startButtonsContainer   = $();
		this.$buttonsContainer        = $();
		this.$containers              = $();

		this.$minimizeAll             = $();
		this.$toggleFullscreen        = $();
		this.$networkMonitor          = $();
		this.$clock                   = $();
		this.$datepicker              = $();
		this.$languageSelect          = $();
		this.$languageSelectMenu      = $();

		this.$windowsContainment      = $();
		this.$windowCopy              = $();

		this.$droppableTop            = $();
		this.$droppableRight          = $();
		this.$droppableBottom         = $();
		this.$droppableLeft           = $();


		// the basic classes, widget ID, and a unique id instante storage
		this.$elem
			.addClass( this.classes.taskbar + " " + this.classes.uiWidgetContent )
			.attr( "data-taskbar-uuid", this.uuid )
			.uniqueId()
			.data( this._cnst.dataPrefix + "taskbar", this );

		// add taskbar ID to custom debug messages
		this._consolePrefix( true );

		this._checkForInvalidOptions( undefined, this.options, true );

		// creates containment in which windows will be allowed to resize,
		// maximized and be dragged
		this._createWindowsContainment();

		// a little hack so we also catch resize when scrollbar appears
		this._resizeIframeListener();

		// has to be binded once and before any other clicks
		this._bindGlobalEvents();

		// initialization
		this._initialize();
		this._setwindowButtonsIconsOnlyClass();

		// refresh position of windows binded to taskbars that are already present
		this._refreshWindowsPosition();

		this._trigger( "create" );
	},

	// private function that suppresses events, used internally to refresh
	_refresh: function () {
		this._cache.suppressEvents = true;
		this.refresh();
		this._cache.suppressEvents = false;
	},

	_initialize: function () {
		var refreshPositionOnce = this.$elem
			.hasClass( this.classes.refreshPositionOnce );

		this._debug();
		this._createStyles();
		this._setDimensions();
		this._setTaskbarPositionDimensions();
		this._tryAfterResolveCollisions();
		this._setDraggable();
		this._setDroppable();
		this._buildTaskbarContent();
		this._setResizable();
		this._setTaskbarRoundedCorners();
		this._initAutoHide();

		// not to touch windows when another taskbar's refresh is in progress
		// - the last taskbar should run those function; it might have been
		// in process of changing it state to reflect option being set
		if ( ! refreshPositionOnce ) {
			this._resizeWindowsContainment();
			this._refreshWindowsPosition();
		}

		this._setWindowButtonsSizes();
		this._setButtonsTooltips();
		this._setDraggableContainment();
		this._refreshWindowsTaskbarId();
		this._debugCheckOrphans();
		this._refreshSeparators();
	},

	_debug: function () {
		this._debugEnvironment();  // 0
		this._debugLocalization(); // 1
		this._debugOptions();      // 2
	},

	_debugLogAdd: function ( msg, level, type ) {
		var ui = {
			message: msg,
			level: level,
			levelName: {
				0: "error",
				1: "warning",
				2: "notice"
			}[ level ],
			type: type,
			typeName: {
				0: "environment",
				1: "localization",
				2: "options",
			}[ type ],
		};

		var p = this._consolePrefix();

		ui.$target = $( "#" + this._cnst.consolePrefixIdReal );

		if (
			// if debugLogAdd is prevented
			   this._trigger( "debugLogAdd", {}, ui ) === false
			// or window console is not available
			// (changing order ot trigger( "debugLogAdd" ) and window.console
			// will fail tests on IE9 due to the fact that window.console is not
			// available when dev tools are closed)
			|| ! window.console
			// or debug for this type of messages is turned off
			|| ! this.options.debug[ ui.typeName ]
		) {
			// return false and don't show anything in console
			return false;
		}

		if ( ui.level === 0 && console.error ) {
			console.error( p + ui.message );
		} else if ( ui.level === 1 && console.warn ) {
			console.warn( p + ui.message );
		} else if ( ui.level === 2 && console.log ) {
			console.log( p + ui.message );
		}
	},

	_consolePrefix: function ( set, widgetType ) {
		// true reverts console prefix to contain taskbar name
		if ( set === true ) {
			this._cnst.consolePrefixId = " for taskbar #" + this.$elem[ 0 ].id;
			this._cnst.consolePrefixIdReal = this.$elem[ 0 ].id;

		// passing string will change prefix to other widget (window, for now)
		} else if ( typeof set === "string" && set.length ) {
			this._cnst.consolePrefixId = " for " + widgetType + " #" + set;
			this._cnst.consolePrefixIdReal = set;

		// act as getter
		} else {
			return this._cnst.consolePrefix + this._cnst.consolePrefixId + ": ";
		}
	},

	_debugEnvironment: function () {
		var o = this.options;

		// position, dialog, button, and window are mandatory
		if ( ! $.ui.position ) {
			this._debugLogAdd(
				"jQuery UI Position is required for this plugin to work.", 0, 0
			);
		}

		if ( ! $.ui.dialog ) {
			this._debugLogAdd(
				"jQuery UI Dialog is required for taskbar windows to work.",
				0, 0
			);
		}

		if ( ! $.simone.window ) {
			this._debugLogAdd(
				this._cnst.naturalName + " Window is required " +
				"for taskbar windows to work.", 0, 0
			);
		}

		if ( ! $.ui.button ) {
			this._debugLogAdd(
				"jQuery UI Button is required for taskbar buttons to work.",
				0, 0
			);
		}

		// ui-icon is meant to have background image - if it doesn't,
		// jQuery UI Theme is likely not to be loaded
		if ( this._styleIndicator( this.classes.uiIcon, "backgroundImage" )
				.backgroundImage === "none" ) {
			this._debugLogAdd( "jQuery UI Theme is probably missing.", 1, 0 );
		}

		// taskbar and window default position is "fixed",
		// and if it isn't, some or all of plugin's styleshet's are missing
		if (
			   this._styleIndicator( this.classes.taskbar, "position" )
			   .position !== "fixed"
			|| this._styleIndicator( this.classes.window, "position" )
			   .position !== "fixed"
		) {
			this._debugLogAdd(
				"Stylesheet for " + this._cnst.naturalName +
				" is probably missing.", 1, 0 );
		}

		// position: relative, set for example by Foundation framework,
		// will not work with jQuery UI Draggable, see:
		// http://bugs.jquery.com/ticket/4202
		// http://foundation.zurb.com/forum/posts/17493-body-position-relative
		if ( $( "body" ).css( "position" ) === "relative" ) {
			this._debugLogAdd( "Body with position:relative will not work "
				+ "with jQuery UI Draggable or jQuery UI Resizable.", 0, 0 );
		}
	},

	// taskbar should not contain elements that are menus and it's
	// subordinates, and if it does, a debug message will be generated
	_debugCheckOrphans: function () {
		var $orphans = this.$elem.children()
			.not( "." + this.classes.uiMenu )
			.not( "." + this.classes.container )
			.not( "." + this.classes.separator )
			.not( "." + this.classes.resizable )
			.not( "." + this.classes.menuHidden )
			.filter( ":visible" );

		if ( $orphans.length ) {
			var result = this._debugLogAdd(
				  "There are elements presents in the taskbar "
				+ "that are neither hidden or part of the taskbar. "
				+ "Maybe you forgot to "
				+ ( this.options.startButtons
					? "set \"startButtons\" option to true or "
					: "" )
				+ "add \"." + this.classes.menuHidden +
				  "\" class to some menus.", 1, 0
				);
			// if event was not prevented, log a list of orphaned
			// element to the console
			if ( result !== false && this.options.debug.environment ) {
				if ( window.console ) {
					console.log( $orphans );
				}
			}
		}
	},

	// called when menu is about to be created;
	// debug is generated when jQuery UI Menu is missing
	_debugMenu: function () {
		if ( ! $.ui.menu ) {
			this._debugLogAdd(
				"jQuery UI Menu is required for taskbar menus to work.", 1, 0
			);
		}

		return !! $.ui.menu;
	},

	_debugLocalization: function () {
		var o = this.options,
		    lang;

		// check is any localization files were loaded at all
		if ( this._isRealEmptyObject( $.simone.taskbar.prototype.options.localization ) ) {
			this._debugLogAdd( "Localization file is probably missing.", 1, 1 );
		} else if ( ! $.simone.taskbar.prototype.options.localization ) {
			this._debugLogAdd( "Localization file is missing.", 0, 1 );
		}

		// check is localization option is non-empty and is an object
		if ( this._isRealEmptyObject( o.localization ) ) {
			this._debugLogAdd( "Localization object is empty.", 1, 1 );
		} else if ( ! o.localization ) {
			this._debugLogAdd( "Localization option is not an object.", 0, 1 );
		}

		// check if all plugin localizations are loaded for languages that were
		// passed in "language" option, and do the same for datepicker
		// localizations,  if both "clock" and "clockShowDatepicker"
		// are set to true
		for( var i in o.languages ) {
			if ( o.languages.hasOwnProperty( i ) ) {
				lang = o.languages[ i ];
				if ( $.simone.taskbar.prototype.options.localization
				&& ! $.simone.taskbar.prototype.options.localization[ lang ] ) {
					this._debugLogAdd(
						"Missing taskbar translations for language \"" +
						lang + "\".", 1, 1
					);
				}

				if ( o.clock && o.clockShowDatepicker && $.ui.datepicker
					&& ( ! $.datepicker
					  || ! $.datepicker.regional
					  || ! $.datepicker.regional[ lang == "en" ? "" : lang ] )
					) {
					this._debugLogAdd(
						"Missing jQuery UI Datepicker " +
						"translations for language \"" + lang + "\".", 1, 1
					);
				}
			}
		}
	},

	_debugOptions: function () {
		var o = this.options,
		    i;

		// check and correct those taskbar options that should be positive integers
		for ( i in this._optionsPositiveIntegers ) {
			if ( this._optionsPositiveIntegers.hasOwnProperty( i ) ) {
				var key = this._optionsPositiveIntegers[ i ];
				var val = parseInt( this.options[ key ], 10 );
				if (
					( 1 > val || isNaN( val ) )
					&& (
						 ! this._isPercent( val )
						&& $.inArray( val, this._optionsPossiblePercentages ) )
					) {
						this._debugLogAdd(
							key + " should not be lower than 1, setting to 1.",
							1, 2
						);
						this.options[ key ] = Math.max( this.options[ key ], 1 );
				}
			}
		}

		// check if resizableHandleOverflow isn't to high, and correct
		// it if needed, because otherwise it would cover resizable handle
		// of window touching it
		if (
			    this.options.resizableHandleOverflow
			=== parseInt( this.options.resizableHandleOverflow, 10 )
		) {
			if (
				  this.options.resizableHandleOverflow
				> this._cnst.resizableHandleOverflowMax
			) {
				this._debugLogAdd(
					"resizableHandleOverflow should not be higher than " +
					this._cnst.resizableHandleOverflowMax + ", " +
					"as it would damage resizable experience on windows " +
					"touching taskbar.", 1, 2
				);
			}
		}

		// check if custom buttons does not share names with native buttons
		for ( i in this.options.buttons ) {
			if ( $.inArray( i, this._systemButtons ) > -1 ) {
				this._debugLogAdd( "Custom button \"" + i + "\" detected. " +
					"Custom button should not share names with native buttons.",
					1, 2 );
			}
		}
	},

	_setDimensions: function ( options ) {
		// this function is also used by droppables, so we need to know
		// what kind of element we dealing with; taskbar uses native options,
		// droppables simulates them
		var isTaskbar      = ! options,
			options        = options || this.options,
			horizontal     = options.orientation === "horizontal";

		// set height to auto so it could be calculated again
		if ( isTaskbar && horizontal && this.$elem && this.$elem.length ) {
			this.$elem.css( "height", "auto" );
		}

		// either a height of horizontal taskbar or width of vertival taskbar
		var secondaryDimension = horizontal
		    // taskbar will later translated "auto" height to px,
		    // but when we dealing with droppable, that's already calculated
		    // and stored, so use this instead
		    ? isTaskbar
		    	? options.horizontalRowHeight
		    	: this._cache.horizontalRowHeight
		    : isTaskbar
		    	? options.verticalColumnWidth
		    	: this._cache.verticalColumnWidth,
		    // determines whether an auto height should be applied
		    // to horizontal taskbar; note: auto width of vertical taskbar
		    // is not supported; this is a planned feature
		    auto           = secondaryDimension === "auto",
		    actualSize;

		var _cache = {};

		// to which edge of the window, right or left, should the taskbar stick,
		// regardless of orientation
		_cache.stickHorizontal = horizontal
			? options.horizontalStick.indexOf("right") !== -1 ? "right" : "left"
			: options.verticalStick.indexOf("right") !== -1 ? "right" : "left",

		// to which edge of the window, top or bottom, should the taskbar stick,
		// regardless of orientation
		_cache.stickVertical   = ! horizontal
			? options.verticalStick.indexOf("top") !== -1 ? "top" : "bottom"
			: options.horizontalStick.indexOf("top") !== -1 ? "top" : "bottom";

		// copy setting (used by droppables)
		_cache.horizontal      = horizontal;

		if ( isTaskbar ) {
			// reset styles left by autoHide and others; those were harmless
			// for the previous taskbar position, but will mess up when taskbar
			// is dragged to another edge; this is a refresh, so we don't know
			// previous settings of options.autoHide, therefore this has to
			// be done every time
			this._copyStyles({
				to        : this.$elem,
				properties: [ "top", "bottom", "left", "right", "width",
					"marginTop", "marginBottom", "marginLeft", "marginRight" ]
			});

			// hides user-defined menus, later those that are needed
			// for current language setting and are not defined by user
			// as disabled will be shown
			this._hideInternals();
		}

		// classes that will position taskbar accordingly to options
		this._setTaskbarPositionClasses( _cache, options );

		actualSize = this._translateSize( options );

		if ( isTaskbar ) {
			// stores the window edge to which taskbar sticks
			_cache.edge = horizontal
				? this.options.horizontalStick.match(/bottom/) ? "bottom" : "top"
				: this.options.verticalStick.match(/left/) ? "left" : "right";
			// +
			// to keep the original setting for getters,
			// calculated height of horizontal taskbar
			// will be kept internally
			this._cache.horizontalRowHeight = ! horizontal || auto
				? this._computeAutoHeight({
					edge: _cache.edge
				})
				: secondaryDimension;

			// to keep the original settings for getters,
			// caluclated width of horizontal taskbar will be kept internally
			this._cache.verticalColumnWidth = this._translateSize(
				$.extend( {}, options, {
					orientation: "horizontal",
					horizontalWidth: options.verticalColumnWidth
				})
			);

			// data about the edge will be used later for decining whether
			// draggable taskbar can be dropped on given droppable edge
			this.$elem.data(
				this._cnst.dataPrefix + "taskbarEdge", _cache.edge
			);
		}

		// either a number of rows for horizontal taskbar or number of columns
		// for vertical taskbar
		_cache.secondarySize = ! horizontal
			? (
				isTaskbar
					? this._getRealRowCol( "vertical" )
					: options.verticalColumns
			) * this._cache.verticalColumnWidth
			: (
				isTaskbar
					? this._getRealRowCol( "horizontal" )
					: options.horizontalRows
			) * this._cache.horizontalRowHeight;

		_cache.actualSize = actualSize;

		// resolving colliding taskbar conflicts
		if ( isTaskbar && this.options.resolveCollisions === true ) {
			// before resolving collisions, actual taskbar needs to be
			// present in the DOM, so it has to act like there was no collision,
			// then we'll calculate if there were any
			_cache = this._setWidthAndHeight( _cache );
			_cache.colissionCss = this._zeroDirections();
			$.extend( this._cache, _cache );
			this._setTaskbarPositionDimensions();
			_cache = this._resolveCollisions( _cache );
		}

		// setts the width and height, as the value
		// of _cache.actualSize could change
		_cache = this._setWidthAndHeight( _cache );
		if ( isTaskbar ) {
			// extends internal config
			$.extend( this._cache, _cache );
		}

		// if it's droppable that called this function,
		// it will require this config to position itself
		return _cache;
	},

	_setWidthAndHeight: function( _cache ) {
		// width and height differs now from what was initially set by user
		_cache.width  = _cache.horizontal
			? _cache.actualSize
			: _cache.secondarySize,
		_cache.height = !_cache.horizontal
			? _cache.actualSize
			: _cache.secondarySize;

		return _cache;
	},

	_translateSize: function ( options ) {
		var containment = this._getContainmentInner(),

			horizontal  = options.orientation === "horizontal",
			// eihter width of horizontal taskbar or height of vertical taskbar
			mainDimension = horizontal
				? options.horizontalWidth
				: options.verticalHeight,

			// percentSize will be later translated to px
			percentSize = this._isPercent( mainDimension ),
			actualSize;

		if ( percentSize ) {
			// translates % to px
			actualSize = parseFloat( mainDimension, 10 ) / 100 *
					( horizontal ? containment.width : containment.height );
		} else if ( mainDimension === "auto" && horizontal ) {
			// use actualSize
		} else {
			// assume it's a valid setting
			actualSize = mainDimension;
		}

		// we can't have float at this point
		return parseInt( actualSize, 10 );
	},

	_isPercent: function ( val ) {
		return typeof val === "string" && val.substr( -1 ) === "%";
	},

	// return the real row/column value, with "max" nad "min" values
	// taken into account, and optionally generated a debug message
	// if "max" value is lower than "min" value
	_getRealRowCol: function ( orientation ) {
		var o = this.options;

		if ( orientation === "horizontal" ) {
			if ( o.horizontalRowsMax < o.horizontalRowsMin ) {
				this._debugLogAdd(
					  "\"horizontalRowsMax\" should not be lower than "
					+ "\"horizontalRowsMin\".", 1, 2
				);
			}
			return Math.max(
				Math.min( o.horizontalRows, o.horizontalRowsMax ),
				o.horizontalRowsMin
			);
		}

		if ( orientation === "vertical" ) {
			if ( o.verticalColumnsMax < o.verticalColumnsMin ) {
				this._debugLogAdd(
					  "\"verticalColumnsMax\" should not be lower than "
					+ "\"verticalColumnsMin\".", 1, 2
				);
			}
			return Math.max(
				Math.min( o.verticalColumns, o.verticalColumnsMax ),
				o.verticalColumnsMin
			);
		}
	},

	_removeTaskbarPositionClasses: function ( options ) {
		// either remove classes from droppable or from taskbar
		var $elem = options && options.elem ? options.elem : this.$elem;

		// those are all the classes that tells us about taskbar position
		$elem
			.removeClass(
				        this.classes.taskbarHorizontal
				+ " " + this.classes.taskbarVertical
				+ " " + this.classes.taskbarStickTop
				+ " " + this.classes.taskbarStickBottom
				+ " " + this.classes.taskbarStickRight
				+ " " + this.classes.taskbarStickLeft
			);
	},

	_setTaskbarPositionClasses: function ( _cache, options ) {
		// either set classes to droppable or to taskbar
		var $elem = options && options.elem ? options.elem : this.$elem;

		// clean start with position
		this._removeTaskbarPositionClasses( options );

		$elem
			.addClass(
				// add classes telling whether it's a horizontal or vertical
				// taskbar or droppable
				" " + ( _cache.horizontal
					? this.classes.taskbarHorizontal
					: this.classes.taskbarVertical )
				+ " " + this.classes.taskbarStickPrefix + _cache.stickVertical
				+ " " + this.classes.taskbarStickPrefix + _cache.stickHorizontal
			);
	},

	// clears and the setts rounded corners if they should apply
	_setTaskbarRoundedCorners: function ( options ) {
		this._removeTaskbarRoundedCorners( options );
		this._addTaskbarRoundedCorners( options );
	},

	// removes rounded corners from taskbar and it's resizable
	_removeTaskbarRoundedCorners: function ( options ) {
		var $elem = options && options.elem ? options.elem : this.$elem;

		$elem.find( "." + this.classes.resizable ).andSelf().removeClass(
			        this.classes.uiCornerTl
			+ " " + this.classes.uiCornerTr
			+ " " + this.classes.uiCornerBl
			+ " " + this.classes.uiCornerBr
		);
	},

	_addTaskbarRoundedCorners: function ( settings ) {
		var self        = this,
			_cache     = this._cache,
			options     = this.options,
			horizontal  = options.orientation === "horizontal",
			containment = this._getContainment(),
			$elem       = settings && settings.elem ? settings.elem : this.$elem;

		// no rounded corners if a taskbar stretches through entire window
		if (
			horizontal && (
				   options.horizontalWidth == "100%"
				|| this._cache.horizontalRowHeight >= containment.width
			)
			|| !horizontal && (
				   options.verticalHeight == "100%"
				|| this._cache.height >= containment.height )
		) {
			return false;
		}

		// shortcuts for switch
		var top    = _cache.stickVertical   === "top",
			bottom = _cache.stickVertical   === "bottom",
			left   = _cache.stickHorizontal === "left",
			right  = _cache.stickHorizontal === "right",
			corner;

		// those are suffixes for native jQuery Ui's classes used for
		// rounded corners; we use opossite corners of the current
		// taskbar stick, so for the top left stick - the bottom right corner
		// is rounded, etc.
		switch (true) {
			case ( top    && left  ): corner = "br"; break;
			case ( top    && right ): corner = "bl"; break;
			case ( bottom && left  ): corner = "tr"; break;
			case ( bottom && right ): corner = "tl"; break;
		}

		// the skipResizable settings tells us whether the resizable
		// is at the initial position; if it's not, it should not receive
		// rounded borders
		var $target = settings && settings.skipResizable
					  ? $elem
					  : $elem.find( "." + this.classes.resizable ).andSelf();

		// adds proper class
		$target.addClass( this.classes.uiCornerPrefix + corner );
	},

	_resolveCollisions: function ( _cache ) {
		var self          = this,
			horizontal    = this.options.orientation === "horizontal",
			actualSize    = _cache.actualSize,
			secondarySize = _cache.secondarySize,
			margins       = this.$windowsContainment.data(
				this._cnst.dataPrefix + "taskbar-margins"
			),
			edge          = _cache.edge,
			$taskbars     = this._getTaskbarList(),
			// a list of window edges and their neighbouring edges
			neighbouringEdges = this._neighbouringEdges(),
			// current containment - window
			c             = this._getContainment(),
			s = this._extendedPosition.call( this.$elem ),
			// an empty set of CSS properties (top, bottom, left, right)
			css = this._zeroDirections(),
			$refreshNeighbours = $(),
			keep = this._cache.keepCollidedPosition;

		// when we in process of resizing that should not change taskbar
		// position relative to other taskbars, we use cached position
		// instead of recalculation
		var collisions = keep
			? this._cache.collisions
			: this._zeroDirections();

		// margins variable could be undefined, which indicates it is initial run of first taskbar in this window,
		// in which case there are no conflicts to resolve and initial css variable is enough
		if ( typeof margins === "object" && ! keep ) {
			// iterate over neighbouring edges
			$.each (
				neighbouringEdges[ edge ],
				function ( index, neighbouringEdge ) {
				var $collidingTaskbars = $taskbars[ neighbouringEdge ]
					.not( this.$elem );

				// margins needs to be > 0 and there has to be some taskbars;
				// it could happen that there are only autohide taskbars
				// and those are not considered space-takers
				if (
					   margins [ neighbouringEdge ]!== 0
					&& $collidingTaskbars.length > 0
				) {
					$collidingTaskbars.each( function () {
						var $this = $( this ),
							p = self._extendedPosition.call( $this );

						// collision detection will change top/bottom/left/right
						// CSS value; detected collusions will be reflected
						// by changing _cache.actualSize;
						// example logic: if current taskbar edge is top,
						// check if it's bottom edge collides with other
						// taskbars top edge; if so, check for opposing edges,
						// for example: left for right, etc. if right edge
						// of left positioned possibly colliding taksbar
						// is over left edge of taskbar we trying to position,
						// that's a collision and CSS left of taskbar we want
						// to move will likely be updated
						if (
							   ( edge === "left" && p.left < s.right )
							|| ( edge === "right" && p.right > s.left )
						) {
							if (
								   neighbouringEdge === "top"
								&& p.bottom > s.top
							) {
								// we use Math.max because value larger than
								// that coming from current taskbar
								// could be set by some previous taskbar
								css.top = Math.max( css.top, p.bottom );
							}
							if (
								   neighbouringEdge === "bottom"
								&& p.top < s.bottom
							) {
								css.bottom = Math.max( css.bottom, p.height );
							}
						}

						// that's just the code from above,
						// except left = top, right = bottom, height = width
						if (
							   ( edge === "top" && p.top < s.bottom )
							|| ( edge === "bottom" && p.bottom > s.top )
						) {
							if (
								   neighbouringEdge === "left"
								&& p.right > s.left
							) {
								css.left = Math.max( css.left, p.right );
							}
							if (
								   neighbouringEdge === "right"
								&& p.left < s.right
							) {
								css.right = Math.max( css.right, p.width );
							}
						}
					});
				}
			});
		}

		if ( keep ) {
			css = collisions;
		}

		this._cache.collisions = css;

		$.each( $taskbars, function ( index, $taskbars ) {
			$taskbars.each( function () {
				// update neighbours that needs refreshing
				$refreshNeighbours = $refreshNeighbours.add( $( this ) );
			});
		});

		$refreshNeighbours = $refreshNeighbours.not( this.$elem );

		// change value of actual size by extracting margins
		_cache.actualSize -= horizontal
			? css.right + css.left
			: css.top + css.bottom;

		// this will be used to position taskbar
		_cache.colissionCss = css;

		// refresh neighbouring taskbar only if current taskbar is not
		// a taskbar that's refresh was called by another taskbar,
		// otherwise we skip and taskbar collision resolve
		// themselves as taskbars collide
		if (
			 ! this.$elem.hasClass( this.classes.refreshPositionOnce )
			&& $refreshNeighbours.length
		) {
			// refresh neighbours after refresh because current taskbar position
			// is not changed at the moment
			this._bindInternal( "afterResolveCollisions", function () {
				$refreshNeighbours.each( function () {
					var $this = $( this );

					if ( $this.hasClass( self.classes.taskbar )
					&& ! $this.hasClass( self.classes.refreshPositionOnce ) ) {
						$this
							.addClass( self.classes.refreshPositionOnce )
							.data( self._cnst.dataPrefix + "taskbar" )
							._refresh();
					}
				});
			});
		}

		return _cache;
	},

	_tryAfterResolveCollisions: function () {
		this._triggerInternal( "afterResolveCollisions" );

		// remove class after internal callback - prevents intinite loop
		this.$elem.removeClass( this.classes.refreshPositionOnce );
	},

	// used upon destruction
	_refreshNeighbours: function () {
		var self = this,
		    $taskbars     = this._getTaskbarList(),
			// a list of window edges and their neighbouring edges
		    neighbouringEdges = this._neighbouringEdges();

		$.each( neighbouringEdges[ this._cache.edge ], function ( index, edge ) {
			$taskbars[ edge ].each( function () {
				 $( this ).data( self._cnst.dataPrefix + "taskbar" )._refresh();
			});
		});
	},

	// set position and dimensions for taskbar or droppable
	_setTaskbarPositionDimensions: function( options ) {
		var self       = this,
		    _cache    = options && options._cache
		    	? options._cache
		    	: this._cache,
		    isTaskbar  = !options,
		    $elem      = options && options.elem
		    	? options.elem
		    	: this.$elem,
		    class_     = options && options.addClass ?
		    	options.addClass
		    	: "";

		$elem
			.addClass(
				class_
			)
			.css({
				width : _cache.width,
				height: _cache.height
			});

		// part of resolving collisions: set values higher than 0,
		// from cache created last time collisions were resolved,
		// on this taskbar
		if ( isTaskbar && this.options.resolveCollisions === true ) {
			for ( var i in _cache.colissionCss ) {
				if ( _cache.colissionCss [ i ] > 0 ) {
					$elem.css( i, _cache.colissionCss[ i ] );
				}
			}
		}
	},

	// compute row height for "orientation": "horizontal"
	_computeAutoHeight: function ( options ) {
		var self = this,
		    // create fake taskbar and prepend it
		    $elem = $( "<div></div>" )
		    	.addClass(
		    		        this.classes.taskbar
		    		+ " " + this.classes.taskbarHorizontal
		    		+ " " + this.classes.taskbarStickPrefix + options.edge
		    	)
		    	.prependTo ( $( "body" ) );

		this._setTaskbarRoundedCorners({
			skipResizable: true,
			elem: $elem
		});

		// create fake container
		var $dummy = this._factory( "startButtonsContainer" );

		// copy a bunch of properties regarding height,
		// so $().tasbkar( "refresh" ) could be more accurate
		if ( this.$elem && this.$elem.length ) {
			this._copyStyles({
				from      : this.$elem,
				to        : $dummy,
				properties: [ "fontSize", "lineHeight" ]
			});
		}

		// create fake start button
		var $start = this._factory( "startButton", {
			text : "Placeholder",
			name : "start"
		} ).prependTo( $dummy );

		// prepend container to taskbar
		$dummy.prependTo( $elem );

		// get the height
		var height = $elem.outerHeight();

		// cleanup
		$dummy.remove();
		$elem.remove();

		return height;
	},

	_bindGlobalEvents: function () {
		var self = this;

		// bindings taskbar refresh to the browser window resize
		// allow it to get the right dimensions
		$( window ).on( "resize." + this._cache.uep, function ( event, params ) {
			// prevents bubbling of other resize events
			if ( event.target !== window ) {
				return true;
			}
			// +
			if ( ! params || params.caller !== "taskbar-iframe" ) {
				// call handler from within itself with a delay,
				// for those cases  where iframe fix is useless
				// - for example, when the body has fixed width
				if ( event.delegateTarget === window ) {
					self._resizeEvent( true );
				}

				return true;
			}

			// clear interval - no more tries if we're about to refresh
			clearInterval( self._cache.timeouts.windowResize );

			self._cache.keepCollidedPosition = true;
			self._refresh();
			self._cache.keepCollidedPosition = false;

			// refresh windows position
			self._refreshWindowsPosition({
				skipFitting: true
			});
		});

		$( window ).on( "mousedown." + this._cache.uep, function ( event ) {
			// cache the last mousedown target for use in "click" handler
			self._cache.mousedownTarget = $( event.target );
		});

		//
		$( window ).on( "blur." + this._cache.uep, function ( event ) {
			if ( self.options.propagateWindowBlur ) {
				self._blurWindows();
				self.hideSubordinates();
			}
		});

		$( document ).on( "click." + this._cache.uep, function ( event ) {
			var prevents = self.$windowsContainment.data(
				self._cnst.dataPrefix + "preventClicks"
			);

			var preventGlobalWindowClick = false;

			// allow one-time prevention of this handler
			// in regard to bluring windows and window buttons
			if ( !isNaN( parseInt( prevents, 10 ) ) && prevents > 0 ) {
				self.$windowsContainment.data(
					self._cnst.dataPrefix + "preventClicks", --prevents
				);

				preventGlobalWindowClick = true;
			}

			var $target           = $( event.target ),
			    // when target is body, click started on diffrent element
			    // that is finished, in which case we could have more luck
			    // with mousedown target
			    $target           = $target.is( "body" )
			    	? self._cache.mousedownTarget
			    	: $target,
			     $datepickerHeader = $target.closest(
			    	"." + self.classes.uiDatepickerHeader
			    ),
			    s                 = self.$elem[ 0 ].nodeName.toLowerCase()
			    	+ "#" + self.$elem[ 0 ].id + " ",
			    i                 = "[data-taskbar-uuid=" + self.uuid +"]",

			    // is the target current taskbar's subordinate menu
			    isMenu = ( $target.is(
			    	+ "[data-menu-type], "
			    	+ "[data-menu-type] *, "
			    	+ "[data-menu-button], "
			    	+ "[data-menu-button] *, "
			    	+ "[data-group-name], "
			    	+ "[data-group-name] *, "
			    	+ "." + self.classes.windowGroupMenu + ", "
			    	+ "." + self.classes.windowGroupMenu + " *, "
			    	+ "." + self.classes.windowButton + ", "
			    	+" ." + self.classes.windowButton + " *"
			    ) || $target.parent().is(
			    	"[data-group-name]"
			    )),

			    // is the target curent taskbar's datepicker
			    isDatepicker = $target.is(
			    	  s + "." + self.classes.datepicker + ", "
			    	+ s + "." + self.classes.datepicker + " *, "
			    	+ s + "." + self.classes.clock + ", "
			    	+ s + "." + self.classes.clock + " *"
			    ),

			    // is this a datepicker header of current taskbar datepicker
			    isDatepickerHeader = $datepickerHeader
			    	.attr( "data-taskbar-uuid" ) == self.uuid,

			    // is this a window or window button
			    isWindow = $target.is(
			    	  "." + self.classes.window + ", "
			    	+ "." + self.classes.window + " *, "
			    	+ "." + self.classes.windowManipulationButton + ", "
			    	+ "." + self.classes.windowManipulationButton + " span, "
			    	// target could be detached by now,
			    	// so let's check it's class name set by window widget
			    	+ "." + self.classes.windowTitlebarButtonIcon
			    ),

			    // is this a window button or window group menu item
			    isWindowTrigger = $target.is(
			    	  "." + self.classes.windowButton + ", "
			    	+ "." + self.classes.windowButton + " *, "
			    	+ "." + self.classes.windowGroupMenu + ", "
			    	+ "." + self.classes.windowGroupMenu + " *"
			    ),

			    // is this a dialog overlay of window from current taskbar
			    isOverlay = $target.is(
			    	"." + $.simone.window.prototype.classes.dialogOverlay + i
			    );

			isDatepicker = isDatepicker || isDatepickerHeader;

			// if that's not a menu, hide menus
			if ( ! isMenu ) {
				self._hideMenus({
					own: true
				});
			}

			// if that's not a datepicker, hide other datepicker
			if ( ! isDatepicker ) {
				self._hideDatepickers({
					own: true,
					blur: ! isMenu
				});
			}

			// it that's not a subordinate, set openedElements state to false
			if ( ! isMenu && ! isDatepicker ) {
				self._openedElements( false );
			}

			// blur active window if no window or window trigger is clicked
			if (
				   ! isWindow
				&& ! isWindowTrigger
				&& ! isOverlay
				&& ! preventGlobalWindowClick
			) {
				self._blurWindows();
				self.blurConnectedButtons();
			}

			// click olways hides tooltips
			self._hideTooltips();

			if ( self._openedElements() ) {
				self._setConnectedButtonsStates();
			}
		});

		// return a jQuery object with draggable or resizable in progress,
		// or empty jQuery object otherwise
		function getWindowWithInteraction() {
			var $windowDragging = $(
					"." + self.classes.window +
					"." + self.classes.uiDraggableDragging
				),
			    $windowResizing = $(
			    	"." + self.classes.window +
			    	"." + self.classes.uiResizableResizing
			    ),
			    windowInstance;

			if ( $windowDragging.length || $windowResizing.length ) {
				var $elem = ( $windowDragging.length
					? $windowDragging
					: $windowResizing )
					.children( "." + self.classes.windowContent );

				if ( $elem.is( self.windows() ) ) {
					return $elem;
				}
			}

			return $();
		}

		$( window ).on( "scroll." + this._cache.uep, function ( event ) {
			self._setDraggableContainment();

			// don't refresh window's position:
			// it's too heavy to do on every scroll
			self._refreshWindowsContainment({
				refreshPosition: false
			});

			if ( self.$elem.hasClass( self.classes.draggableDragging ) ) {
				// after scroll is done via mousewheel or any other means,
				// draggable containment has to be refreshed,
				// along with droppable offset, which is cached
				// in droppable instance
				var draggable = self.$elem.data( self.classes.uiDraggable );
				draggable._setContainment();

				$( "." + self.classes.droppable ).each(function () {
					var $this = $( this ),
					    droppable = $this.data( self.classes.uiDroppable );
					droppable.offset = $this.offset();
				});
			}

			var $window = getWindowWithInteraction();

			if ( $window.length ) {
				var dragging       = $window.parent()
				    	.hasClass( self.classes.uiDraggableDragging ),
				    windowInstance = $window
				    	.data( self._cnst.dataPrefix + "window" );

				// refresh draggable containment
				if ( dragging ) {
					var containment = windowInstance._getRealContainment();
					if ( containment === "visible" ) {
						windowInstance._setContainment();
						var draggableInstance = $window.parent()
							.data( self.classes.uiDraggable );

						draggableInstance._setContainment();
					}
				} else {
					windowInstance._refreshContainmentSize();
				}
			}
		});

		// prevent mousewheel on certain interactions (resizable, sortable),
		// where it make no sense to scroll, and a lot of additional code
		// woulde be required to deal with problems emerging from changing
		// elements position relative to the window
		$( document ).on( "mousewheel." + this._cache.uep, function ( event ) {
			if (
				   self._cache.progress.windowButtonsSortable
				|| self._cache.progress.taskbarResizable
				|| getWindowWithInteraction()
					.parent()
					.hasClass( self.classes.uiResizableResizing )
			) {
				event.preventDefault();
			}
		});

		var checkConnectivity = function( e ) {
			self._setNetworkMonitorStatus();
		};

		// refresh network monitor status on online/offline events
		$( window ).on( "online."  + this._cache.uep, checkConnectivity );
		$( window ).on( "offline." + this._cache.uep, checkConnectivity );
	},


	_setDraggable: function () {
		var self        = this,
		    options     = this.options,
		    _cache      = this._cache,
		    draggable   = options.draggable,
		    $elem       = self.$elem,
		    isDraggable = $elem.hasClass( this.classes.uiDraggable );

		if ( ! draggable && isDraggable ) {
			$elem.draggable( "destroy" );
		}

		if ( draggable && ( ! $.ui.draggable || ! $.ui.droppable ) ) {
			this._debugLogAdd(
				"jQuery UI Draggable and Droppable are required " +
				"for draggable taskbar to work.", 1, 0 );
		}

		if ( ! draggable || ! $.ui.draggable || ! $.ui.droppable ) {
			return;
		}

		var helperCreator = function () {
			// build helper with a initial width of one-column vertical taskbar
			// and a initial height of one-row horizontal taskbar
			var $helper = self._factory( "draggableHelper" ).css({
				width : _cache.verticalColumnWidth,
				height: _cache.horizontalRowHeight,
				position: "fixed"
			});

			var thickestBorderWidth = 0,
				thickestBorder;

			// get the thickest border; helper border color will be taken
			// from this one, as it is most notable to user
			$.each( [ "borderTopWidth", "borderRightWidth",
			          "borderBottomWidth", "borderLeftWidth" ],
					  function ( index, value ) {
				var currentBorderWidth = parseInt( $elem.css( value ), 10 );

				// if border in the current itteration is thicker than what we
				// had to this point, select it so it could later be used
				if ( currentBorderWidth > thickestBorderWidth ) {
					thickestBorderWidth = currentBorderWidth;
					thickestBorder = value.slice( 0, - 5 );
				}
			} );

			// color of the thickest border
			var color = $elem.css( thickestBorder + "Color" );

			// set color of the thickest border and 1px width
			// for every border of the helper
			$.each( [ "borderTop", "borderRight",
			          "borderBottom", "borderLeft" ],
					  function ( index, value ) {
				$helper
					.css( value + "Width", "1px" )
					.css( value + "Color", color );
			});

			// copy a bunch of properties from taskbar
			self._copyStyles({
				from      : $elem,
				to        : $helper,
				properties: [ "boxSizing", "backgroundColor",
				              "borderTopStyle", "borderRightStyle",
				              "borderBottomStyle", "borderLeftStyle" ]
			});

			return $helper;
		};

		var originalOffset = {};

		function draggableUi( ui ) {
			ui.originalOffset = originalOffset;

			return ui;
		}

		var options = {
			scroll        : false,
			// prevents scrolling
			containment   : "window",
			cursor        : "move",
			distance      : 1,
			revert        : "invalid",
			iframeFix     : true,
			revertDuration: false,
			cancel        : "." + this.classes.uiButton
							+ ", ." + this.classes.uiMenu
							+ ", ." + this.classes.uiDatepicker
							// Trident triggers mousedown event when scroll
							// is being dragged, so draggable can't start
							// on elements that potentially can have scroll
							+ (
								   window.navigator.userAgent.match(/Trident/)
								&& ! this._cache.horizontal
									? ", ." + self.classes.windowButtonsContainer
									: ""
							),
			// cursor will be at the center of helper
			cursorAt      : {
				left      : parseInt( _cache.verticalColumnWidth / 2, 10 ),
				top       : parseInt( _cache.horizontalRowHeight / 2, 10 )
			},
			helper: helperCreator,
			start: function ( event, ui ) {
				self._cache.progress.taskbarDraggable = true;

				// show taskbar immediately
				self._startShowing({
					quick: true
				});

				self.$elem.data(
					self._cnst.dataPrefix + "window-scrolls",
					{ x: $( window ).scrollLeft(), y: $( window ).scrollTop() }
				);

				originalOffset = self.$elem.offset();

				self.$elem.addClass( self.classes.draggableDragging );
				self._hideAll();
				self._showDroppable();

				self._trigger( "dragStart", event, draggableUi ( ui ) );
			},
			stop: function ( event, ui ) {
				self._hideDroppable();
				self.$elem.removeClass( self.classes.draggableDragging );

				$( "." + self.classes.droppablePending )
					.removeClass( self.classes.droppablePending );

				self._cache.progress.taskbarDraggable = false;

				self.$elem.removeData( self._cnst.dataPrefix + "window-scrolls" );

				self.windows().window( "refreshPosition", {
					skipOnFit: true
				});

				self._trigger( "dragStop", event, draggableUi ( ui ) );
			},
			drag: function ( event, ui ) {
				if ( parseFloat( $.ui.dialog.prototype.version ) >= 1.11 ) {
					var scrolls = self.$elem.data(
						self._cnst.dataPrefix + "window-scrolls"
					);

					ui.position.left += scrolls.x - $( window ).scrollLeft();
					ui.position.top  += scrolls.y - $( window ).scrollTop();
				}

				self._trigger( "drag", event, draggableUi ( ui ) );
			},
			disabled: ! draggable
		};

		if ( isDraggable ) {
			$elem.draggable( "option", options );
		} else {
			$elem.draggable( options );
		}

		this._setDraggableContainment();
	},

	// set's containment for draggable
	_setDraggableContainment: function () {
		if ( ! this.options.draggable || ! $.ui.draggable || ! $.ui.droppable
			|| ! this.$elem.hasClass( this.classes.uiDraggable ) ) {
			return;
		}

		if ( ! this.$windowCopy.length || ! this.$droppableRight.length ) {
			return;
		}

		// extracting bottom and right droppables from containment width/height
		// fixes a bug where draggable helper would be dragged
		// outside of containment by that exact amount of px
		var wc          = this._extendedPosition.call( this.$windowCopy ),
		    dr          = this._extendedPosition.call( this.$droppableRight ),
		    db          = this._extendedPosition.call( this.$droppableBottom ),
		    scroll      = this._getWindowScroll(),
		    containment = [
		    	scroll.x,
		    	scroll.y,
		    	scroll.x + wc.width - dr.width,
		    	scroll.y + wc.height - db.height
		    ];

		this.$elem.draggable( "option", "containment", containment );
	},

	_setResizable: function ( options ) {
		var self        = this,
		    _cache      = self._cache,
		    resizable   = self.options.resizable,
		    horizontal  = self.options.orientation === "horizontal",
		    stick       = ! horizontal
		    	? _cache.stickHorizontal
		    	: _cache.stickVertical,
		    orientation = self.options.orientation,
		    $elem       = self.$elem,
		    $resizable  = $elem.find( "." + self.classes.resizable );

		if ( resizable && ! $.ui.resizable ) {
			this._debugLogAdd(
				"jQuery UI Resizable is required for resizable taskbar to work.",
				1, 0
			);
		}

		if (
			 ! ( ! options || ! options.destroy )
			&& $resizable.hasClass( this.classes.uiResizableResizing )
		) {
			return true;
		}

		// a known bug don't allow settings handles after init,
		// so resizable has to be rebuilt every time
		// http://bugs.jqueryui.com/ticket/3423
		if ( $resizable.hasClass( this.classes.uiResizable ) ) {
			$resizable.resizable( "destroy" );
		}

		$resizable.remove();

		if ( ! $.ui.resizable || ( options && options.destroy ) ) {
			return;
		}

		$resizable = self._factory( "resizable" )
			.prependTo( $elem );

		if ( this.options.horizontalWidth === "auto" && horizontal ) {
			var resizableCalculatedWidth = this.$elem.outerWidth();
			$resizable.css( "width", resizableCalculatedWidth );
		}

		var handles = {
			horizontal: {
				bottom: "n",
				top: "s"
			},
			vertical: {
				left: "e",
				right: "w"
			}
		};

		var grid = {
			horizontal: {
				bottom: [ 0, _cache.horizontalRowHeight ],
				top: [ 0, _cache.horizontalRowHeight ]
			},
			vertical: {
				left: [ _cache.verticalColumnWidth, 0 ],
				right: [ _cache.verticalColumnWidth , 0 ]
			}
		};

		var min = {
			horizontal: {
				width: 0,
				height: _cache.horizontalRowHeight * this.options.horizontalRowsMin
			},
			vertical: {
				width: _cache.verticalColumnWidth * this.options.verticalColumnsMin,
				height: 0
			}
		};

		var max = {
			horizontal: {
				width: 0,
				height: _cache.horizontalRowHeight * this.options.horizontalRowsMax
			},
			vertical: {
				width: _cache.verticalColumnWidth * this.options.verticalColumnsMax,
				height: 0
			}
		};

		var resizableUi = function ( originalUi, eventType ) {
			var o = self.options,
			    sizeAxis, gridPosition,
			    ui = {};

			ui.helper               = originalUi.helper;
			ui.gridPosition         = originalUi.gridPosition;
			ui.originalGridPosition = originalUi.originalGridPosition;

			ui.originalSizeAxis = o.orientation === "horizontal"
				? _cache.horizontalRowHeight
				: _cache.verticalColumnWidth;

			ui.originalGridPosition = o.orientation === "horizontal"
				? o.horizontalRows
				: o.verticalColumns;

			if ( o.orientation === "horizontal" ) {
				sizeAxis = originalUi.size.height;
				gridPosition = sizeAxis / _cache.horizontalRowHeight;
			}

			if ( o.orientation === "vertical" ) {
				sizeAxis = originalUi.size.width;
				gridPosition = sizeAxis / _cache.verticalColumnWidth;
			}

			ui.sizeAxis = sizeAxis;
			ui.gridPosition = Math.round( gridPosition );

			ui.orientation = o.orientation;

			return ui;
		};

		var atStart = {
			axis: 0,
			gridPosition: 0,
			first: false
		};

		var fixResizableMaskPosition = function ( event, ui, eventType ) {
			var dimensionName = self._cache.horizontal
				? "bottom"
				: "right";

			var invertedDimension = self._cache.horizontal
				? "top"
				: "left";

			var size = self._cache.horizontal
				? "height"
				: "width";

			if ( self._cache.edge !== dimensionName ) {
				return;
			}

			var uiGridPositionWasZero = false;

			if ( eventType === "resize" || eventType === "stop" ) {
				// right edge fix
				if ( ! ui.gridPosition ) {
					uiGridPositionWasZero = true;

					ui.gridPosition = 1;
				}

				var rightDimension   = atStart.axis / atStart.gridPosition,
				    currentDimension = ui.sizeAxis / ui.gridPosition;

				if ( currentDimension !== rightDimension ) {
					var diff = currentDimension - rightDimension;

					var cssDimension = Math.round( parseFloat( ui.helper.css(
						invertedDimension
					)));

					var cssSize = Math.round( parseFloat( ui.helper.css(
						size
					)));

					// right edge fix
					if ( uiGridPositionWasZero ) {
						cssSize = rightDimension + diff;
					}

					ui.helper
						.css( invertedDimension, cssDimension + diff )
						.css( size, cssSize - diff );

					return true;
				}
			}
		};

		$resizable.resizable({
			grid: grid[ orientation ][ stick ],
			handles: handles[ orientation ][ stick ],
			minWidth: min [ orientation ].width,
			minHeight: min [ orientation ].height,
			maxWidth: max [ orientation ].width,
			maxHeight: max [ orientation ].height,
			// when distance or delay are anything but 0, resizable mask change
			// it's dimension before resize start; we don't want that because
			// it's not the original element that get resized,
			// but a palceholder sitting on top of taskbar, expanding
			// to the size of taskbar when mouse is over resizable handle
			distance: 0,
			delay: 0,
			start: function ( event, ui ) {
				self._cache.progress.taskbarResizable = true;

				ui = resizableUi( ui );

				atStart.axis         = ui.sizeAxis;
				atStart.first        = true;
				atStart.gridPosition = ui.originalGridPosition;

				self._startShowing({
					quick: true
				});

				self.$elem.addClass( self.classes.resizableResizing );

				$( event.target ).css(
					self._styleIndicator(
						        self.classes.uiWidgetContent
						+ " " + self.classes.uiStateActive,
						"borderColor"
					)
				);

				self._trigger( "resizeStart", event, ui );
			},
			resize: function ( event, ui ) {
				ui = resizableUi( ui );

				var fixed;

				if ( self._versionOf( "resizable", ">=", "1.11.1" ) ) {
					fixed = fixResizableMaskPosition( event, ui, "resize" );
				}

				self._setTaskbarRoundedCorners({
					skipResizable: ui.gridPosition !== ui.originalGridPosition
				});

				// dont trigger event if size was corrected by
				// fixResizableMaskPosition()
				if ( ! atStart.first || ! fixed ) {
					self._trigger( "resize", event, ui );
				}

				atStart.first = false;
			},
			stop: function ( event, ui ) {
				var o = self.options;

				ui = resizableUi( ui );

				if ( self._versionOf( "resizable", ">=", "1.11.1" ) ) {
					fixResizableMaskPosition( event, ui, "stop" );
				}

				if ( o.orientation === "horizontal" ) {
					o.horizontalRows = Math.round( ui.gridPosition );
				}

				if ( o.orientation === "vertical" ) {
					o.verticalColumns = Math.round( ui.gridPosition );
				}

				self.$elem.removeClass( self.classes.resizableResizing );

				self._cache.keepCollidedPosition = true;
				self._refresh();
				self._cache.keepCollidedPosition = false;

				self._cache.progress.taskbarResizable = false;

				self._trigger( "resizeStop", event, ui );
			},
			disabled: ! resizable
		});

		var resizableMouseEnterLeave = function ( event ) {
			var $self    = $( this ),
				$elem    = $self.closest( "." + self.classes.resizable ),
				horizontal = self.options.orientation === "horizontal",
				vertical   = !horizontal,
				stick      = horizontal
				             	? self._cache.stickVertical
				             	: self._cache.stickHorizontal;

			if ( event.originalEvent === undefined ) {
				// if event is trigger programatically and resizable
				// is disabled, this class prevents cursor from changing
				// to n-resize, s-resize, e-resize or w-resize
				if ( ! self.options.resizable ) {
					$elem.addClass( self.classes.resizableDisabled );
				}
			}

			if ( $elem.hasClass( self.classes.uiResizableResizing ) ) {
				return true;
			}

			var $taskbar = $elem.closest( "." + self.classes.taskbar ),
				$handle  = $elem.find( "." + self.classes.uiResizableHandle ),

				t = {
					b: parseInt( $taskbar.css( "borderBottomWidth" ), 10 ),
					t: parseInt( $taskbar.css( "borderTopWidth" ), 10 ),
					r: parseInt( $taskbar.css( "borderRightWidth" ), 10 ),
					l: parseInt( $taskbar.css( "borderLeftWidth" ), 10 )
				},

				ho = self.options.resizableHandleOverflow,

				elemCss = {
					top              : "auto",
					bottom           : "auto",
					left             : "auto",
					right            : "auto",
					borderTopWidth   : 0,
					borderRightWidth : 0,
					borderBottomWidth: 0,
					borderLeftWidth  : 0,
					borderStyle      : $taskbar.css( "borderStyle" )
				},

				handleCss = {
					top   : "auto",
					bottom: "auto",
					left  : "auto",
					right : "auto"
				};

			if ( resizable ) {
				// copy border color of default state
				if ( event.type === "mouseleave" ) {
					$.extend( elemCss, self._styleIndicator(
						self.classes.uiWidgetContent,
						"borderColor"
					));
				}

				// copy border color of focus state
				if ( event.type === "mouseenter" ) {
					$.extend( elemCss, self._styleIndicator(
						self.classes.uiWidgetContent + " " +
						self.classes.uiStateFocus,
						"borderColor"
					));
				}
			}

			// minSize was initially set to 0 (technically, this variable
			// was not present since it would do nothing), but Chrome failed to
			// trigger mouseenter on element that's parent had height/width
			// set to 0, when runned in iframe, causing
			// tests/unit/taskbarAutoHide.html to fail
			// in tests/unit/all.html
			// this wasn't a case in Firefox
			var minSize = 1;

			// handle horizontal top
			if ( horizontal && stick  === "top" ) {
				handleCss.height = ho * 2 + t.b;

				if ( event.type === "mouseenter" ) {
					handleCss.bottom = handleCss.height * -1 + ho;
				}

				if ( event.type === "mouseleave" ) {
					handleCss.bottom = - ho + minSize;
				}
			}

			// handle horizontal bottom
			if (horizontal && stick === "bottom" ) {
				handleCss.height = ho * 2 + t.t;

				if ( event.type === "mouseenter" ) {
					handleCss.top = handleCss.height * -1 + ho + minSize;
				}

				if ( event.type === "mouseleave" ) {
					handleCss.top = - ho;
				}
			}

			// handle vertical left
			if ( vertical && stick === "left" ) {
				handleCss.width = ho * 2 + t.r;

				if ( event.type === "mouseenter" ) {
					handleCss.right = handleCss.width * -1 + ho;
				}

				if ( event.type === "mouseleave" ) {
					handleCss.right = - ho + minSize;
				}
			}

			// handle vertical right
			if ( vertical && stick === "right" ) {
				handleCss.width = ho * 2 + t.l;

				if ( event.type === "mouseenter") {
					handleCss.left = handleCss.width * -1 + ho + minSize;
				}

				if ( event.type === "mouseleave" ) {
					handleCss.left = - ho;
				}
			}

			// element mouseenter
			if ( event.type === "mouseenter" ) {
				elemCss.top  = 0 - t.t;
				elemCss.left = 0 - t.l;

				// horizontal top
				if ( horizontal  && stick == "top" ) {
					elemCss.borderBottomWidth = resizable ? t.b : 0;
					elemCss.top               = 0 - t.t - t.b;
				}

				// horizontal bottom
				if ( horizontal && stick === "bottom" ) {
					elemCss.borderTopWidth = resizable ? t.t : 0;
				}

				// vertical left
				if ( vertical && stick === "left" ) {
					elemCss.borderRightWidth = resizable ? t.r : 0;
					elemCss.left             = 0 - t.l - t.r;
				}

				// vertical right
				if ( vertical && stick === "right" ) {
					elemCss.borderLeftWidth = resizable ? t.l : 0;
				}

				elemCss.width  = resizableCalculatedWidth || self._cache.width,
				elemCss.height = self._cache.height;
			}

			// element mouseleave
			if ( event.type === "mouseleave" ) {
				// horizontal
				if ( horizontal ) {
					elemCss.left = 0 - t.l;
				}

				// vertical
				if ( vertical ) {
					elemCss.top = 0 - t.t;
				}

				// horizontal top
				if ( horizontal  && stick === "top" ) {
					elemCss.top = self._cache.height - t.t;
				}

				// horizontal bottom
				if ( horizontal  && stick === "bottom" ) {
					elemCss.top = 0 - t.t;
				}

				// vertical left
				if ( vertical && stick === "left" ) {
					elemCss.left = self._cache.width - t.l;
				}

				// vertical right
				if ( vertical && stick === "right" ) {
					elemCss.left = 0 - t.l;
				}

				elemCss.width = horizontal
					? resizableCalculatedWidth || self._cache.width
					: minSize;
				elemCss.height = vertical ? self._cache.height : minSize;
			}

			$handle
				.css( handleCss )
				.toggleClass(
					self.classes.resizableMouseover,
					event.type === "mouseleave"
				);
			$elem.css( elemCss );
		};

		$resizable.find( "." + this.classes.uiResizableHandle ).on(
			   "mouseenter." + this._cnst.eventPrefix + "resizablehandle"
			+ " mouseleave." + this._cnst.eventPrefix + "resizablehandle",
			resizableMouseEnterLeave
		)
		.on( "mousedown." + this._cache.uep, function () {
			if ( ! self.options.resizable ) {
				return true;
			}

			self._hideAll();
		})
		.trigger( "mouseleave." + this._cnst.eventPrefix + "resizablehandle" );
	},

	_getContainment: function () {
		return {
			width: $( window ).width(),
			height: $( window ).height()
		};
	},

	_getContainmentInner: function () {
		return {
			width: $( window ).innerWidth(),
			height: $( window ).innerHeight()
		};
	},

	// show droppable zones
	_showDroppable: function () {
		var $elem = this.$elem;

		$( "." + this.classes.droppable +
			"[data-taskbar-uuid= "+ this.uuid +"]" )
			.removeClass( this.classes.hidden );
	},

	// hide droppable zones
	_hideDroppable: function () {
		$( "." + this.classes.droppable +
			"[data-taskbar-uuid= "+ this.uuid +"]" )
			.addClass( this.classes.hidden );
	},

	_setDroppable: function () {
		$( "." + this.classes.droppableContainer +
			"[data-taskbar-uuid= "+ this.uuid +"]" ).remove();

		if ( !this.options.draggable ) {
			return;
		}

		var self = this,
		    options = this.options,
		    $container = self._factory( "droppableContainer" )
		    	.insertAfter( self.$elem ),
		    containment = this._getContainment(),
		    // default sticks for droppable edges
			sticks = {
				"top"   : "top left",
				"right" : "right top",
				"bottom": "bottom left",
				"left"  : "left top"
			},
			_cache = this._cache,
			horizontal, $elem;

		$.each([ "top", "right", "bottom", "left" ],
		function ( index, position ) {
			horizontal = $.inArray( position, [ "top", "bottom" ] ) > -1;

			var upperKey = position
				.charAt( 0 )
				.toUpperCase() + position.slice( 1 );

			// create droppables and keep their jQuery objects
			self[ "$droppable" + upperKey ] = $elem = self
				._factory( "droppable" )
				.data( self._cnst.dataPrefix + "droppable-edge", position )
				.uniqueId()
				.appendTo( $container );

			// use the same function that is used for
			// calculating taskbar dimensions
			_cache = self._setDimensions({
				elem               : $elem,
				orientation        : horizontal ? "horizontal" : "vertical",

				horizontalWidth    : "100%",
				horizontalStick    : sticks[ position ],
				horizontalRows     : 1,
				horizontalRowHeight: _cache.horizontalRowHeight,

				verticalHeight     : "100%",
				verticalStick      : sticks[ position ],
				verticalColumns    : 1,
				verticalColumnWidth: _cache.verticalColumnWidth,
			});

			// set CSS to droppable
			self._setTaskbarPositionDimensions({
				elem: $elem,
				_cache: _cache,
				addClass: self.classes.hidden
			});

			var droppableAccept = function ( $draggable, $droppable, ee ) {
				var droppableEdge = $droppable
				    	.data( self._cnst.dataPrefix + "droppable-edge" ),
				    taskbarEdge   = $draggable
				    	.data( self._cnst.dataPrefix + "taskbarEdge" ),
				    margins       = self.$windowsContainment
				    	.data( self._cnst.dataPrefix + "taskbar-margins" );

				var accept =
					self.uuid=== $draggable.data(
						self._cnst.dataPrefix + "taskbar"
					).uuid
					&& (
						   self.options.dropOnExisting
						|| margins[ droppableEdge ] === 0
						|| taskbarEdge == droppableEdge
					);

				return accept;
			};

			var draggableDrop = function ( event, ui ) {
				var $target = $( event.target ),
				    o = self.options,
				    requestedStick;

				// taskbar helper could be positioned over two droppables
				// at the same time and two drop events will occur, but only
				// the last droppable entered will have this class
				if (
					 ! $target.hasClass( self.classes.droppableOver )
					&& event.type !== "dropover"
				) {
					return false;
				}

				var orientation,
					containment = self._getContainment(),
					prefix      = self.classes.taskbarPrefix,
					stickPrefix = prefix + "stick-",
					stick       = [];

				var classes = $target
					.attr( "class" )
					.split( " " )
					.map( function ( className ) {
						// get droppable orientation
						if ( $.inArray( className,
							[ prefix + "horizontal", prefix + "vertical" ]
						) > -1 ) {
							return orientation = className.replace(
								self.classes.taskbarPrefix, ""
							);
						}

						// get droppable stick
						if ( className.indexOf( stickPrefix ) !== -1 ) {
							return className.replace( stickPrefix, "" );
						}
					}
				);

				// in those cases taskbar cannot be dropped on current droppable
				if (
					   o.draggable === "orientation"
					&& orientation !== o.orientation
					||
					   o.draggable === "vertical"
					&& orientation === "horizontal"
					||
					   o.draggable === "horizontal"
					&& orientation === "vertical"
				) {
					return false;
				}

				// if it not false at this point, it's true for dropover:
				// droppable can be highlighted
				if ( event.type === "dropover" ) {
					return true;
				}

				for (var i in classes) {
					if (
						   $.inArray( classes[ i ], [ "right", "left" ] ) > -1
						&& orientation === "horizontal"
					) {
						requestedStick = event.clientX > containment.width / 2
							? "right"
							: "left";

						if ( ! options.draggableBetweenEdges ) {
							// if edge doesn't match, do nothing
							if ( o.horizontalStick
								.indexOf( requestedStick ) === -1 ) {
								return false;
							}

							// if taskbar is not draggable between edges,
							// take the original stick
							classes[ i ] = options.horizontalStick
								.replace( /(bottom|top)/, "" );
						} else {
							// if taskbar is draggable between edges,
							// rely on mouse position
							classes[ i ] = requestedStick;
						}
					}

					if (
						   $.inArray( classes[ i ], [ "top", "bottom" ] ) > -1
						&& orientation === "vertical"
					) {
						requestedStick = event.clientY > containment.height / 2
							? "bottom"
							: "top";

						if ( ! options.draggableBetweenEdges ) {
							// if edge doesn't match, do nothing
							if ( o.verticalStick
								.indexOf( requestedStick ) === -1 ) {
								return false;
							}

							// if taskbar is not draggable between edges,
							// take the original stick
							classes[ i ] = options.verticalStick
								.replace( /(left|right)/, "" );
						} else {
							// if taskbar is draggable between edges,
							// rely on mouse position
							classes[ i ] = requestedStick;
						}
					}
				}

				// trim what's left
				$.each( classes, function ( index ) {
					classes[ index ] = $.trim( classes[ index ] );
				});

				// filter out anything that isn't stick
				stick = $.grep( classes, function( cl ) {
					return $.inArray(
						cl,
						[ "right", "left", "bottom", "top" ]
					) > -1;
				});

				// make the collection unique
				stick = $.unique( stick );

				var edge;

				if ( orientation === "horizontal" ) {
					edge = $.inArray( "top", stick ) > -1 ? "top" : "bottom";
				}

				if ( orientation === "vertical" ) {
					edge = $.inArray( "left", stick ) > -1 ? "left" : "right";
				}

				var key = orientation + "Stick",
				    optionStick = stick.join( " " );

				// jQuery 1.10.2 (and earlier probably) will shuffle
				// elements in $.unique function differently
				// than the later versions,
				// so let's normalize this function result
				optionStick = {
					"left bottom" : "bottom left",
					"right bottom": "bottom right",
					"left top"    : "top left",
					"right top"   : "top right"
				}[ optionStick ] || optionStick;

				var noChange = o[ key ] === optionStick
				            && o.orientation === orientation;

				ui.originalEdge        = self._cache.edge;
				ui.edge                = edge;

				ui.originalStick       = o[ key ];
				ui.stick               = optionStick;

				ui.originalOrientation = o.orientation;
				ui.orientation         = orientation;

				delete ui.draggable;

				if (
					self._trigger( "beforeDrop", event, $.extend( {}, ui ) )
					=== false
				) {
					return false;
				}

				// don't refresh taskbar if stick and orientation
				// stayed the same
				if ( ! noChange ) {
					// for performance reasons, set one option internally,
					// then set the seconde one via the pubic API,
					// this will refresh taskbar position for both options
					o[ key ] = optionStick;
					self.$elem.taskbar( "option", "orientation", orientation );
				}

				self._trigger( "drop", event, $.extend( {}, ui ) );
			};

			function extendDroppableUi( event, ui ) {
				var $this = $( this );

				ui.originalEdge = self._cache.edge;
				ui.edge         = $this.data(
					self._cnst.dataPrefix + "droppable-edge"
				);

				var horizontal = ui.edge.match( /top|bottom/ ),
				    o          = self.options;

				ui.originalOrientation = o.orientation;
				ui.orientation         = horizontal
					? "horizontal"
					: "vertical";

				delete ui.draggable;

				return ui;
			}

			var droppableConfig = {
				accept: function ( $elem ) {
					// we only accept taskbar for which droppables were created
					if ( $elem.hasClass( self.classes.taskbar ) ) {
						return droppableAccept( $elem, $( this ) );
					}

					return false;
				},
				drop: draggableDrop,
				out: function ( event, ui ) {
					var $this = $( this );

					ui.highlighted = $this
						.hasClass( self.classes.droppableOver );

					ui = extendDroppableUi.call( this, event, ui );

					self._trigger(
						"beforeDroppableOut",
						event,
						$.extend( {}, ui )
					);

					$this
						.css( "backgroundColor", "" )
						.removeClass(
							         self.classes.droppableOver
							 + " " + self.classes.droppablePending
						);

					$( "." + self.classes.droppablePending )
						.css(
							"backgroundColor",
							self.$elem.css( "backgroundColor")
						)
						.removeClass( self.classes.droppablePending )
						.addClass( self.classes.droppableOver );

					self._trigger( "droppableOut", event, $.extend( {}, ui ) );
				},
				over: function ( event, ui ) {
					$( "." + self.classes.droppableOver )
						.css( "backgroundColor", "" )
						.removeClass( self.classes.droppableOver )
						.addClass( self.classes.droppablePending );

					ui = extendDroppableUi.call( this, event, ui );

					if ( draggableDrop( event, $.extend( {}, ui ) ) === false ) {
						return;
					}

					if ( self._trigger(
						"beforeDroppableOver",
						event,
						$.extend( true, {}, ui )
					) === false ) {
						return;
					}

					$( this )
						.addClass( self.classes.droppableOver )
						.css(
							"backgroundColor",
							self.$elem.css( "backgroundColor")
						);

					self._trigger( "droppableOver", event, $.extend( {}, ui ) );
				},
				tolerance: "touch"
			};

			if ( ! $elem.hasClass( self.classes.uiDroppable ) ) {
				$elem.droppable( droppableConfig );
			} else {
				$elem.droppable( "option", droppableConfig );
			}
		});
	},

	// get translations for current language, or for language
	// passed as parameter, or empty object when no translations exist
	_getDictionary: function ( name ) {
		var l = this.options.localization;

		return typeof l === "object" && l !== null
			? l [ name || this.options.language ] || {}
			: {};
	},

	// main internationalization function;
	// it takes dictionary key as first parameter,
	// and optionally keys-value pair to be inserted into translation
	// as a second parameter,
	// and optionally language to be used instead of current language,
	// as a third parameter
	_i18n: function ( translation, keys, language ) {
		var primaryLanguage = language === undefined
		    	? this.options.language
		    	: language,
		    i18n = this._getDictionary( primaryLanguage );

		if ( ! i18n[ translation ] ) {
			i18n = this._getDictionary( this.options.fallbackLanguage );

			// generated debug if key was not found,
			// that usually due to missing translations for custom
			// window groups or buttons
			if ( ! i18n [ translation ] ) {
				this._debugLogAdd(
					  "Missing translation key \"" + translation+ "\" "
					+ "in both language \"" + primaryLanguage + "\" "
					+ "and fallback language \""
					+ this.options.fallbackLanguage + "\".", 1, 1
				);

				// we can't return undefined here because widget factory
				// will threat this function as setter and return
				// the entire instance taskbar where there's string expected,
				// so let's return string "undefined" instead
				return this._cnst.missingTranslation;
			}
		}

		var translated =  i18n [ translation ];

		translated = this._i18n_replace_keys( translated, keys );

		return translated;
	},

	// main function for replacing key-value pair in a given string
	_i18n_replace_keys: function ( translated, keys ) {
		if ( keys && typeof( keys ) === "object" ) {
			for ( var i in keys ) {
				// both ":key" and "key" are a valid keys
				// for string like "Hello :key." to became "Hello world."
				translated = translated
					.replace( i.charAt( 0 ) === ":" ? i : ":" + i, keys[ i ] );
			}
		}

		return translated;
	},

	// hides custom menus
	_hideInternals: function () {
		this.$elem.find( "[data-menu-type=start]" ).hide();
	},

	// function for hiding some or all datepickers
	_hideDatepickers: function ( options ) {
		var self = this,
		    // hide all datepickers or only the one from the current taskbar
		    $elem = options && options.own
		    	? this.$elem
		    	: $( "." + this.classes.taskbar ),
		    $datepickers = $elem.find( "." + this.classes.datepicker );

		// optionally don't hide some datepicker
		if ( options && options.not ) {
			self._openedElements( true );
			$datepickers = $datepickers.not ( options.not );
		}

		$datepickers.each( function () {
			var $datepicker = $( this );

			// retrieve instance of that datepicker
			var taskbarInstance = self._taskbarInstance( $datepicker );

			// trigger close event on that datepicker and respect prevention
			if ( $datepicker.is( ":visible") ) {
				if ( taskbarInstance._triggerBindedElementEvent({
					type  : "elementClose",
					menu  : $datepicker,
					closeByOpen: true,
					button: taskbarInstance.connectedElement( $datepicker )
				}) === false ) {
					return true;
				}
			}

			$datepicker.hide();
		});

		if ( ! ( options && ! options.blur ) ) {
			this._blurAllConnectedButtons();
		}

		this._closeOtherTaskbarsOpenedElements( options );
	},

	// hides all menus, that includes start menus, language select,
	// window groups and custom menus; a menu not to be hidden
	// could be specified in form of jQuery object
	_hideMenus: function ( options ) {
		var self          = this,
		    // hide all menus or only the one from the current taskbar
		    $elem         = options && options.own
		    	? this.$elem
		    	: $( "." + this.classes.taskbar ),
		    $menus        = $elem
		    	.find( "[data-menu-type], ." + this.classes.windowGroupMenu ),
		    $startButtons = $elem
		    	.find( "." + this.classes.startButton );

		if ( options && options.not ) {
			self._openedElements( true );
			$menus = $menus.not ( options.not );
		}

		$menus.each( function () {
			var $menu = $( this );

			// collapse all menus so we won't have situation
			// where opening a menu again will open it with opened submenus
			var $collapse = $menu
				.add( $menu.find( self.classes.uiMenu ) )
				.filter( "." + self.classes.uiMenu );

			$collapse.menu( "collapseAll" ).menu( "blur" );

			// retrieve instance of that menu
			var taskbarInstance = self._taskbarInstance( $menu );

			// trigger close event on that menu and respect prevention
			if ( $menu.is( ":visible") ) {
				if ( taskbarInstance._triggerBindedElementEvent({
					type       : "elementClose",
					menu       : $menu,
					closeByOpen: true,
					button     : taskbarInstance.connectedElement( $menu )
				}) === false ) {
					return true;
				}

				$menu
					.find( "ul:visible" )
					.andSelf()
					.hide();
			}
		});

		$startButtons.removeClass( this.classes.uiStateActive );

		this._blurAllConnectedButtons();

		this._closeOtherTaskbarsOpenedElements( options );
	},

	_hideAll: function ( options ) {
		this._hideDatepickers();
		this._hideMenus();
		this._hideTooltips();

		if ( ! options || options.blurWindows !== false ) {
			this._blurWindows();
		}

		this._openedElements( false );
		this._closeOtherTaskbarsOpenedElements( options );
	},

	_closeOtherTaskbarsOpenedElements: function ( options ) {
		var self = this;

		if ( ! options || ! options.own ) {
			$( "." + this.classes.taskbar )
				.not( this.$elem )
				.each( function () {
					var $taskbar = $( this );
					var instance = $taskbar
						.data( self._cnst.dataPrefix + "taskbar" );

					instance._openedElements( false );
				});
		}
	},

	// this function will blur those button that should not be active
	blurConnectedButtons: function () {
		var self = this,
			$elem = $( this );

		var filter = "[data-menu-type], " + "." + this.classes.datepicker;

		// go over all menus (and datepicker) connected to taskbar,
		// blur those buttons for which menus (or datepicker) are not visible
		$( filter, this.$elem ).each( function () {
			var $this = $( this ),
				$button = self.connectedElement( $this );

			if ( $button.length && ! $this.is( ":visible" ) ) {
				$button.removeClass( self.classes.uiStateActive );
			}
		});

		// some windows are in windows group,
		// one active window is enough to make the button group active
		var $windows = this.windows();

		var groups   = {},
		     reduced = {},
		    $reduced = $();

		// shortcut function, return group name or null
		// if window is not in group
		var getGroup = function ( $elem ) {
			return $elem
				.window( "option", "group" );
		};

		// push windows that are in
		// one will keep count on windows in this itteration,
		// the other one in the next one;
		$windows.each( function () {
			var $window = $( this ),
			    group = getGroup( $window );

			if ( group ) {
				if ( ! groups[ group ] ) {
					groups [ group ] = 0;
					reduced[ group ] = 0;
				}

				++groups[ group ];
			} else {
				// other windows remain unaffected
				$reduced = $reduced.add( $window );
			}
		});

		$windows.each( function () {
			var $window = $( this ),
			    group = getGroup( $window );

			// if is it null, this group is resolved
			if ( parseInt( reduced [ group ] ) !== reduced[ group ] ) {
				return true;
			}

			// the itteration for this group will continue
			++reduced[ group ];

			// now we either push a first window that is on top,
			// or last window in set - this will represent the entire group,
			// as we later check if window has self.classes.windowTop
			if (
				   $window.parent().hasClass( self.classes.windowTop )
				|| ( groups[ group ] === reduced[ group ] )
			) {
				$reduced = $reduced.add( $window );
				reduced[ group ] = null;
			}
		});

		$reduced.each( function () {
			var $window = $( this ),
				$button = self.connectedElement( $window )
					// we only need buttons
					.filter( "." + self.classes.uiButton );

			// remove active class on buttons that has
			// no connected window on top
			if (
				     $button.length
				&& ! $window.parent().hasClass( self.classes.windowTop )
			) {
				$button.removeClass( self.classes.uiStateActive );
			}
		});
	},

	// blur buttons on all taskbars
	_blurAllConnectedButtons: function () {
		$( "." + this.classes.taskbar ).taskbar( "blurConnectedButtons" );
	},

	// main function that build taskbar subordinates
	_buildTaskbarContent: function ( settings ) {
		var self       = this,
			o          = this.options,
			c          = this.classes,
			$elem      = this.$elem,
			horizontal = o.orientation === "horizontal";

		this.$startButtonsContainer   = $elem
			.find( "." + c.startButtonsContainer );
		this.$buttonsContainer        = $elem
			.find( "." + c.buttonsContainer );
		this.$windowButtonsContainer  = $elem
			.find( "." + c.windowButtonsContainer );

		this.$elem
			.children( "[data-separator-for]" )
			.not( "[data-separator-for=systemButtonsContainer]" )
			.remove();

		this.$startButtonsContainer.remove();
		this.$buttonsContainer
			.children( ":not(." + c.buttonUserDefined + ")" )
			.remove();

		// act as a part of "destroy" method - destroy containers
		// and don't create anything
		if ( settings && settings.destroy ) {
			this.$buttonsContainer.remove();
			this.$windowButtonsContainer.remove();
			this._buildSystemButtons( settings );
			this._buildTaskbarStartButtons( settings );

			return true;
		}

		this._buildSystemButtons( $.extend( true, {}, settings, {
			rebuildAll: true
		}));

		this._buildTaskbarStartButtons();

		this.$buttonsContainer = this.$buttonsContainer.length
			? this.$buttonsContainer
			: this._factory( "buttonsContainer" ).appendTo ( $elem );

		this._rebuildTaskbarButtons({
			skipWindowButtonsContainerResize: true
		});

		if ( ! this.$windowButtonsContainer.length ) {
			this.$windowButtonsContainer =
				this
					._factory( "windowButtonsContainer" )
					.insertAfter( this.$buttonsContainer );
		}

		this._initSortableWindowButtons();

		// find all containers
		this.$containers = this.$elem.find( "." + c.container );

		// empty taskbar will have no padding, and combined with
		// "horizontalWidth": "auto" and  no icons, will became visible
		// only when windows are present; note: horizontalWidth: "auto"
		// is not yet implemented and is intended for future versions
		$elem.toggleClass( c.empty, ! this.$containers.children().length );

		this._refreshWindowButtonsContainer();
	},

	_setSortableWindowButtons: function () {
		this.options.windowButtonsSortable
			? this._initSortableWindowButtons()
			: this._destroySortableWindowButtons();
	},

	_initSortableWindowButtons: function () {
		var self       = this,
		    o          = this.options,
		    c          = this.classes,
		    horizontal = o.orientation === "horizontal";

		if ( o.windowButtonsSortable ) {
			if ( $.ui.sortable ) {
				var fixSortableContainment = function ( event, ui ) {
					if ( horizontal ) {
						return;
					}

					var sortableInstance    = self
					    	.$windowButtonsContainer.data( c.uiSortable ),
					    helperDimensions    = self
					    	._extendedPosition.call( $( ui.helper ), "offset" ),
					    containerDimensions = self
					    	._extendedPosition.call(
					    		self.$windowButtonsContainer,
					    		"offset"
					    	);

					// interfering on so deep level with widget we don't own
					// will blow up in our face one day, but's it's not
					// that day;  fixes a bug where sortable item would go
					// too low on scrollable container with vertical taskbar
					// (overflow:hidden was not an option,
					// because scrollbar had to be visible all the time)
					sortableInstance.containment[ 3 ] =
						containerDimensions.bottom
						- helperDimensions.height
						- parseFloat( $( ui.item ).css( "marginBottom" ) );
				};

				var atStart = {
					offset: {},
					position: {}
				};

				var sortableUi = function( originalUi ) {
					var ui = {};

					// elements
					ui.item             = originalUi.item;
					ui.helper           = originalUi.helper;
					ui.placeholder      = originalUi.placeholder;
					ui.sender           = null;

					// offset
					ui.offset           = $.extend( {},
						   originalUi.offset
						|| $( originalUi.placeholder ).offset()
					);
					ui.originalOffset   = $.extend( {}, atStart.offset );

					// position
					ui.position         = $.extend( {},
						   originalUi.position
						|| $( originalUi.placeholder ).position()
					);
					ui.originalPosition = $.extend( {}, atStart.position );

					return ui;
				};

				// initialize sortable once, that's a heavy plugin
				if ( ! this.$windowButtonsContainer.hasClass( c.uiSortable ) ) {
					this.$windowButtonsContainer.sortable({
						disabled: ! o.windowButtonsSortable,
						containment: "parent",
						forcePlaceholderSize: true,
						cursor: "move",
						tolerance: "pointer",
						cancel: "." + c.uiMenu,
						helper: "clone",
						start: function ( event, ui ) {
							self._cache.progress.windowButtonsSortable = true;

							$( ui.placeholder )
								.removeClass(
									        c.uiStateActive
									+ " " + c.uiStateFocus
								).addClass( c.uiStateHover );

							self._hideAll();
							self._blurAllConnectedButtons();

							atStart.offset = $( ui.placeholder ).offset();
							atStart.position = $( ui.placeholder ).position();

							fixSortableContainment( event, ui );

							// fixes tests/functional/taskbarInteractions.html
							// "Window buttons stay in place during sortable"
							if ( self._cache.horizontal ) {
								var computedWidth = $( ui.item )
									.data(
										  self._cnst.dataPrefix
										+ "taskbarButtonFloatWidth"
									);

								$( ui.placeholder )
									.css( "width", computedWidth );
							}

							self._startShowing({
								duration: false
							});

							self._trigger(
								"sortableStart", event, sortableUi ( ui )
							);
						},
						change: function ( event, ui ) {
							self._trigger(
								"sortableChange", event, sortableUi ( ui )
							);
						},
						sort: function ( event, ui ) {

							self._trigger(
								"sortableSort", event, sortableUi ( ui )
							);
						},
						stop: function ( event, ui ) {
							self._openedElements( false );
							self._cache.progress.windowButtonsSortable = false;

							$( ui.placeholder ).removeClass( c.uiStateHover );

							self._trigger(
								"sortableStop", event, sortableUi ( ui )
							);
						}
					});
				}

				this.$windowButtonsContainer.sortable( "option", {
					scroll: ! horizontal,
					axis: horizontal
						? o.horizontalRows === 1 ? "x" : false
						: "y",
				});
			} else {
				this._debugLogAdd(
					"jQuery UI Sortable is required for " +
					"sortable window buttons to work.", 1, 0
				);
			}
		}
	},

	_destroySortableWindowButtons: function () {
		if (
			 ! this.options.windowButtonsSortable
			&& this.$windowButtonsContainer.hasClass( this.classes.uiSortable ) ) {
			this.$windowButtonsContainer.sortable( "destroy" );
		}
	},

	// check if the containers are empty
	_filterNonEmptyContainers: function ( self, checkPositionAbsolute ) {
		var $this = $( this );

		// skip absolute and fixed positioned siblings
		// if checkPositionAbsolute === false
		if (
			   checkPositionAbsolute
			&& $this.css( "position" ).match(/absolute|fixed/)
		) {
			return false;
		}

		var $children = $this.children( ":visible" );

		// skip empty containers
		if ( ! $children.length ) {
			return false;
		}

		var nonEmpty = false;

		$children.each( function () {
			var $this = $( this );

			if (
				   $this.hasClass( self.classes.uiButton )
				|| $this.attr( "data-menu-type" )
			) {
				nonEmpty = true;

				return false;
			}
		});

		return nonEmpty;
	},

	_buildSystemButtons: function( settings ) {
		var self = this,
		    o = this.options;

		this.$systemButtonsContainer = this.$elem
			.find( "." + this.classes.systemButtonsContainer );

		// remove all buttons except custom buttons
		// - those could have event binded to them and we don't want them gone
		this.$systemButtonsContainer
			.children( ":not(." + this.classes.buttonUserDefined + ")" )
			.remove();

		// stop clock for now
		if ( this._cache.intervals.clock > 0 ) {
			clearInterval( this._cache.intervals.clock );
			this._cache.intervals.clock = 0;
		}

		// remove separator - we could deal with empty container
		this.$systemButtonsContainer
			.siblings( "[data-separator-for=systemButtonsContainer]" )
			.remove();

		// act as a part of "destroy" method - destroy container,
		// with user defined buttons this time, and don't create anything
		if ( settings && settings.destroy ) {
			this
				.$systemButtonsContainer
				.remove();

			return true;
		}

		this.$systemButtonsContainer = this.$systemButtonsContainer.length
			? this.$systemButtonsContainer
			: this._factory( "systemButtonsContainer" ).appendTo( this.$elem );

		// go over the list of system buttons and insert those
		// that should be inserted
		$.each ( o.systemButtonsOrder, function( index, value ) {
			switch ( value ) {
				case "languageSelect":
					if (
						   o.languageSelect
						&& $.inArray(
							"languageSelect",
							o.systemButtonsOrder
						) > -1 ) {
						if ( o.languages.length ) {
							self._buildTaskbarLanguageSelect();
						} else {
							// generate debug is menu would be empty
							self._debugLogAdd(
								  "Language select menu wasn't build "
								+ "because the \"languages\" option is empty.",
								1, 1
							);
						}
					}

					break;

				case "minimizeAll":
					if (
						o.minimizeAll
						&& $.inArray( "minimizeAll", o.systemButtonsOrder) > -1
					) {
						self._buildTaskbarMinimizeAll();
					}

					break;

				case "toggleFullscreen":
					// this button will not be present if fullscreen API
					// is not available in user's browser
					if (
						   o.toggleFullscreen
						&& $.inArray(
							"toggleFullscreen",
							o.systemButtonsOrder
						) > -1
						&& self._fullscreenAvailable() ) {
						self._buildTaskbarToggleFullscreen();
					}

					break;

				case "networkMonitor":
					// this button will not be present if online/offline API
					// is not available in user's browser
					if ( o.networkMonitor
					  && $.inArray( "networkMonitor", o.systemButtonsOrder) > -1
					  && typeof window.navigator.onLine !== "undefined" ) {
						self._buildTaskbarNetworkMonitor();
					}

					break;

				case "clock":
					if (
						   o.clock
						&& $.inArray( "clock", o.systemButtonsOrder) > -1
					) {
						self._buildTaskbarClock();
					}

					break;

				default:
					// prepend user defined buttons
					if ( o.buttons && value in o.buttons ) {
						var singleButton = {};
						singleButton[ value ] = o.buttons [ value ];

						self._buildTaskbarButtons({
							buttons: singleButton,
							container: self.$systemButtonsContainer
						});
					}

					break;
			}
		});

		// detach user defined buttons present in DOM,
		// but not present in systemButtonsOrder and buttonsOrder
		this._detachUserDefinedButtons.call(
			this.$systemButtonsContainer,
			this
		);

		if ( this.$systemButtonsContainer.children().length ) {
			var $systemButtonsSeparator = this
				._setSeparators( this.$systemButtonsContainer );

			$systemButtonsSeparator
				.addClass( this.classes.systemButtonsSeparator );

			this._fixSystemButtonsSeparator();
		}

		this._setSystemButtonsOrder();
		this._positionSystemButtonConnectedElements();

		if ( ! settings || ! settings.rebuildAll ) {
			this._setwindowButtonsContainerSize();
		}
	},

	_setSystemButtonsOrder: function () {
		var self = this;

		// set elements in the right order after refresh
		$.each ( this.options.systemButtonsOrder, function( index, value ) {
			self.$systemButtonsContainer
				.find( "[data-button-name=" + value + "]" )
				.appendTo( self.$systemButtonsContainer );
		});
	},

	_fixSystemButtonsSeparator: function () {
		if ( ! this._cache.horizontal ) {
			this.$elem
				.find( "[data-separator-for=systemButtonsContainer]" ).css({
					position: "absolute",
					bottom: this.$systemButtonsContainer.outerHeight()
				});
		}
	},

	_positionSystemButtonConnectedElements: function () {
		// last minute positioning of language select menu
		if ( this.options.languageSelect && this.options.languages.length ) {
			this._positionTaskbarLanguageSelect();
			if ( this.$languageSelectMenu.length ) {
				this.$languageSelectMenu.hide();
			}
		}

		// last minute positioning of datepicker
		if (
			   this.options.clock
			&& this.options.clockShowDatepicker
			&& $.ui.datepicker
		) {
			this._positionTaskbarDatepicker();

			if ( this.$datepicker ) {
				this.$datepicker.hide();
			}
		}
	},

	_rebuildTaskbarButtons: function ( options ) {
		var buttons = this.options.buttons;

		this.$elem
			.find( "[data-separator-for=buttonsContainer]" )
			.remove();

		if ( buttons ) {
			this._buildTaskbarButtons({
				buttons: this._extractObjectsByKey(
					buttons, this.options.buttonsOrder
				),
				container: this.$buttonsContainer
			});

			// position container after first element has been inserted
			this._positionTopContainersContent.call(
				this.$buttonsContainer, this
			);
		}

		// detach user defined buttons present in DOM,
		// but not present in systemButtonsOrder and buttonsOrder
		this._detachUserDefinedButtons.call( this.$buttonsContainer, this );

		if ( ! options || ! options.skipWindowButtonsContainerResize ) {
			this._refreshWindowButtonsContainer();
		}

		if ( buttons ) {
			this._setSeparators( this.$buttonsContainer );
		}
	},

	// users can create buttons, but not put them in buttonsOrder
	// or systeButtonsOrder, so we only detach them to keep events
	_detachUserDefinedButtons: function ( self ) {
		this.find( "." + self.classes.buttonUserDefined )
			.each( function () {
				var $this = $( this ),
				    button = $this.data( "button-name" );

				if ( $.inArray( button, self.options.systemButtonsOrder ) === -1
				  && $.inArray( button, self.options.buttonsOrder ) === -1 ) {
					$this.detach();
				}
			});
	},

	// create separators for containers
	_setSeparators: function( $elem ) {
		var containerName = $elem.attr( "data-container-name" ),
		    $separator = this._factory( "separator" )
		    	.attr( "data-separator-for", containerName );

		$elem.each( function () {
			var $this = $( this );

			$this
				.siblings( "[data-separator-for=" + containerName + "]" )
				.remove();

			// set matching float
			$separator
				.insertAfter( $this )
				.css( "float", $this.css( "float" ) );

			// no children === no visible separator,
			// as there is no content to separate
			if ( $this.children().length === 0 ) {
				$separator.hide();
			}
		});

		return $separator;
	},

	_refreshSeparators: function () {
		this._setSeparators( this.$buttonsContainer );
		this._setSeparators( this.$systemButtonsContainer );
		this._setSeparators( this.$startButtonsContainer );
		this._fixSystemButtonsSeparator();
	},

	// position menu or datepicker against taskbar or button,
	// the subordinate is connected to
	_menuPosition: function ( settings ) {
		var self     = this,
		    settings = settings instanceof $ ? { of: settings } : settings,
		    $taskbar = this.$elem,
		    $of      = settings.of;

		if ( ! settings || ! settings.of || ! settings.of.length ) {
			return;
		}

		var $elem             = settings.elem || null,
			horizontal        = this.options.orientation === "horizontal",
			top               = this._cache.edge === "top",
			left              = this._cache.edge === "left",
			$container        = $of.closest( "." + this.classes.container ),
			// container float when in horizontal mode
			floatValCSS       = $container.css( "float" ),
			floatVal          = floatValCSS === "none" ? "center" : floatValCSS,
			// container stick when in vertical mode
			posCSS            = $container.css( "position" ),
			edge              = posCSS === "absolute" ? "bottom" : "top",
			pos               = posCSS === "absolute" ? "bottom" : "center",
			cd                = this._extendedPosition.call(
				$container, "offset"
			),
			od                = this._extendedPosition.call( $of, "offset" ),
			td                = this._extendedPosition.call(
				$taskbar, "offset"
			),
			wc                = this._extendedPosition.call(
				this.$windowsContainment
			),
			floatMove         = "",
			position;

			// nullify a bunch of properteis
			this._copyStyles({
				to        : $elem,
				properties:  [ "maxHeight", "bottom", "top", "left", "right" ]
			});

			if ( $elem && $elem.hasClass( this.classes.windowGroupMenu ) ) {
				$elem
					.removeClass( this.classes.windowGroupMenuScroll )
					.css( "maxHeight", "" );

				var ed = this._extendedPosition.call( $elem, "offset" );

				var diff = (
					  parseFloat( $elem.css( "paddingTop") )
					+ parseFloat( $elem.css( "paddingBottom") )
					+ parseFloat( $elem.css( "borderTopWidth") )
					+ parseFloat( $elem.css( "borderBottomWidth") )
				);

				var actualHeight = ed.height - diff;
				var maxHeight   =  wc.height - diff;

				if ( actualHeight > maxHeight ) {
					$elem.addClass( this.classes.windowGroupMenuScroll );
				}

				$elem.css( "maxHeight", maxHeight );
			}

			if ( horizontal ) {
				position = {
					of        : $of,
					my        : floatVal + floatMove + " " + (
						top
						? "top"
						: "bottom"
					),
					at        : floatVal + " " + ( top ? "bottom" : "top" ),
					collision : "flip",
					using     : function ( position, elems ) {
						$( this ).css( position );

						var ep = self._extendedPosition.call(
						    	$( this ), "offset"
						    ),
						    t  = parseFloat( $( this ).css( "top" ) );

						$( this ).css( "top", top
							? t + ( td.bottom - ep.top)
							: t - ( ep.bottom - td.top ) );
					}
				};
			} else {
				position = {
					of        : $taskbar,
					my        : ( left ? "left" : "right" )
								+ floatMove
								+ " " + pos
								+ ( edge === "top" ? "+" : "-" )
								+ Math.round(
									Math.abs( cd[ edge ] - od[ edge ] )
								),
					at        : ( left ? "right" : "left" )
								+ " " + pos,
					collision : "flipfit",
					using     : function ( position ) {
						var $this = $( this );
						$this.css( position );

						if ( ! $elem ) {
							return;
						}

						var ep = self._extendedPosition.call( $this, "offset" ),
						    ed = self._extendedPosition
						    	.call(
						    	self.connectedElement( this )
						    		.filter( "." + self.classes.uiButton ),
						    	"offset"
						    );

						var floatTop = parseFloat( $this.css( "top" ) );

						if ( ed.top < ep.top ) {
							$this.css( "top", floatTop + ( ed.top - ep.top ) );
						}

						if ( ed.bottom > ep.bottom ) {
							$this.css(
								"top",
								floatTop + ( ed.bottom - ep.bottom )
							);
						}

						// fixes a bug where on vertical taskbar on right edge
						// menu would have a 1px space between it and tkasbar
						if (
							 ! self._cache.horizontal
							&& self._cache.edge === "right"
							&& $this.is( ":visible" )
						) {
							$this.css( "left", Math.round(
								parseFloat( $this.css( "left" ) )
								+ td.left
								- self._extendedPosition.call(
									$this, "offset"
								).right
							));
						}
					}
				};
			}

			return position;
	},

	_buildTaskbarStartButtons: function ( settings ) {
		var self = this,
			$elem = this.$elem,
			// find menus that should be treated as start menus
			$menus = $elem
			.find(
				"[data-menu-type=start]" +
				"[data-menu-lang="+ this.options.language +"]" +
				":not(." + this.classes.menuHidden + "), " +
				"[data-menu-type=start][data-menu-lang=\"\*\"]" +
				":not(." + this.classes.menuHidden + ")"
			);

		// destroy menus and return is there should be no menus or destoy
		// is in progress
		if ( ! this.options.startButtons || ( settings && settings.destroy ) ) {
			this._destroyMenus( "[data-menu-type=start]" );
			return;
		}

		// destroy menus that should be hidden,
		// they are hidden by CSS, by we also need this
		// because of using jQuery UI menu classes as indicators
		// in other part of the code
		this._destroyMenus( "." + this.classes.menuHidden );

		this.$startButtonsContainer = this._factory( "startButtonsContainer" );

		this.$buttonsContainer.length
			? this.$startButtonsContainer.insertBefore( this.$buttonsContainer )
			: this.$startButtonsContainer.appendTo( $elem );

		var positioned = false;

		// use the natural order of elements to decide order of buttons
		$menus.each( function () {
			var $menu = $( this ),
				name  = $menu.attr( "data-menu-name" ) || "start";

			if ( ! self._debugMenu() ) {
				return true;
			}

			var title = self._i18n( "startButton:" + name );

			// create button
			var $start = self._factory( "startButton", {
					name: name
				})
				.attr( "title", title !== "undefined" ? title : name )
				.appendTo( self.$startButtonsContainer );

			// debug for missing translations
			if ( title === "undefined" ) {
				self._debugLogAdd(
					"Missing translation for start button named \"" + name
					+ "\" in language \"" + self.options.language + "\".",
					1, 1
				);
			}

			self._connectElements( $start, $menu );

			// position container after first element has been inserted
			if ( ! positioned ) {
				self._positionTopContainersContent.call(
					self.$startButtonsContainer, self
				);
				positioned = true;
			}

			var startPosition = self._menuPosition({
				of: $start,
				elem: $menu
			});

			var startFocusSelect = function ( event, ui ) {
				var $item     = $( ui.item ),
					$supmenu  = $item.closest( "." + self.classes.uiMenu ),
					$submenu  = $item
						.children( "." + self.classes.uiMenu + ":eq(0)" ),
					$root     = $submenu
						.parents( "." + self.classes.uiMenu )
						.filter( ":last" ),
					expand    =
						 ! self._cache.horizontal
						&& self._cache.stickHorizontal == "right"
							? "left"
							: "right",
					stick     =
						   self._cache.horizontal
						&& self._cache.stickVertical == "bottom"
							? "bottom"
							: "top",
					floatMove = 0;

				if ( event.type === "menufocus" ) {
					self._triggerBindedElementEvent({
						type  : "menuItemFocus",
						item  : $item,
						menu  : $menu,
						button: $start,
						event : event
					});
				}

				if ( event.type === "menuselect" && ! $submenu.length ) {
					self._hideMenus();
					self._hideTooltips();
					self._openedElements( false );

					return;
				}

				if ( $submenu.length ) {
					// this function will take appering submenu and position it
					// accordingly, either as high or as low as it could go
					// without breaking usability
					var fixSubmenuPosition = function () {
							// shortcut function
						var end = function ( $elem ) {
						    	return $elem.offset().top + $elem.outerHeight();
						    },

						    // shortcut function
						    start = function ( $elem ) {
						    	return $elem.offset().top;
						    },

						    // those elements will matter when it comes to positioning
						    $subLast  = $submenu.children(
						    	"." + self.classes.uiMenuItem + ":last"
						    ),
						    $subFirst = $submenu.children(
						    	"." + self.classes.uiMenuItem + ":eq(0)"
						    ),

						    supd = self._extendedPosition.call(
						    	$supmenu, "offset"
						    ),
						    subd = self._extendedPosition.call(
						    	$submenu, "offset"
						    ),

						    pullHorizontal = ( subd.left - supd.right ) * -1,

						    // that's likely to be 1 in most of the themes
						    correction = parseFloat( self._styleIndicator(
						    	      "." + self.classes.uiMenu
						    	 + " > ." + self.classes.uiMenuItem
						    	+ " > a." + self.classes.uiStateActive,
						    	"marginTop"
						    ).marginTop ) * -1,

						    submenuPosition = {
						    	of: $supmenu,
						    	at: "right bottom"
						    },

						    pullVertical, overflow;

						$submenu.removeAttr( "data-fix-menu-position" );

						if ( stick == "bottom" ) {
							// the diffrence between root element
							// and the supmenu, so the element being positioned
							// can go all the way down
							pullVertical = end ( $root ) - end ( $supmenu );

							submenuPosition.my = "left-"
								+ Math.round( pullHorizontal )
								+ " bottom+" + Math.round( pullVertical );
						}

						// we don't want double borders on menus next
						// to each other,  so take one of the border
						// into account; it's also useful sor last minute
						// correction on horizontal taskbar; edge case:
						// supmenu and submenu could have different border
						// widths - which one should be taken into account then?
						var pullLeftBorder = parseFloat(
							window.getComputedStyle( $supmenu[ 0 ] )
							.borderRightWidth
						);

						if ( stick == "top" ) {
							// when expanding to the left, submenu
							// has to be moved left by the width of supmenu
							if ( expand == "left" ) {

								pullHorizontal = $supmenu.outerWidth()
									- parseFloat(
										$supmenu.css( "paddingRight" )
									)
									- pullLeftBorder;
							}

							// the diffrence between root element
							// and the supmenu, so the element being positioned
							// can go all the way up
							pullVertical = start ( $root ) - start ( $supmenu );

							submenuPosition.at = "right top";
							submenuPosition.my = (
								expand == "left" ? "right" : "left"
							)
							+ "-" + Math.round( pullHorizontal )
							+ " top+" + pullVertical;
						}

						// set the initial position, either top or bottom
						// of the root menu element
						$submenu
							.position( submenuPosition );

						if ( stick == "bottom" ) {
							overflow = start ( $item ) - start ( $subFirst );

							// if positioning submenu at the bottom of root menu
							// element was too low, lift it up, so the first
							// element of submenu if at the same offset as
							// the element submenu is containted in
							if ( overflow < 0 ) {
								submenuPosition.my = "left-"
									+ Math.round( pullHorizontal )
									+ " bottom+"
									+ Math.round(
										pullVertical + correction + overflow
									);
							}
						}

						if ( stick == "top" ) {
							overflow = start ( $item ) - start ( $subLast );

							// if positioning submenu at the top of root menu
							// element was to high, move it down, so the last
							// element of submenu if at the same offset as
							// the element submenu is containted in
							if (overflow > 0) {
								submenuPosition.my = (
										expand == "left" ? "right" : "left"
									)
									+ "-" + Math.round( pullHorizontal )
									+ " top+"
									+ Math.round(
										pullVertical + correction + overflow
									);
							}
						}

						// set the fixed position, or make no changes
						// when there were no need for fix
						$submenu
							.position( submenuPosition );

						// do some last minute correction on horizontal taskbars
						if ( self.options.orientation === "horizontal" ) {
							var supdAfter = self._extendedPosition.call(
							    	$supmenu, "offset"
							    ),
							    subdAfter = self._extendedPosition.call(
							    	$submenu, "offset"
							    ),
							    lastMinuteCorrection = Math.round(
							    	  supdAfter.right
							    	- subdAfter.left
							    	- pullLeftBorder
							    ),
							    lastMinuteCorrectionSupmenu = parseFloat(
							    	$supmenu.attr( "data-fix-menu-position" )
							    ),
							    // either take parent's correction
							    // or use what's calculated
							    realCorrection =
							    	   lastMinuteCorrectionSupmenu
							    	|| lastMinuteCorrection;

							if ( realCorrection > 0 ) {
								var lastMinutLeft = parseFloat(
									$submenu.css( "left" )
								);

								$submenu
									.css( "left", Math.round(
										lastMinutLeft + realCorrection
									))
									.attr(
										"data-fix-menu-position",
										   lastMinuteCorrectionSupmenu
										|| lastMinuteCorrection
									);
							}
						}

						// disconnect now, positioning is done and as as long
						// as menu is not hidden again no additional fixes
						// are needed; this also disconnects any observers
						// created for submenus that has never been shown
						self._disconnectObservers( "submenus" );
					};

					var MutationObserver = self._MutationObserver();

					// if MutationObserver is present, we'll use it to make
					// the positioning smooth and inconspicuous for the user
					if ( MutationObserver ) {
						$submenu.each( function () {
							// disconnects observers from previous menus
							self._disconnectObservers( "submenus" );

							var $this = $( this );

							var observer = new MutationObserver( function() {
								var ready = $this.css( "display" ) == "block"
									// checks if css top and left has been
									// set already
									&& $this[0].style
										.cssText
										.match( /^(?=.*\btop\b)(?=.*\bleft).*$/ );

								if ( ready ) {
									fixSubmenuPosition();
								}

								if (
									   $supmenu.css( "display" ) == "none"
									|| $root.css( "display" ) === "none"
								) {
									self._disconnectObservers( "submenus" );
								}
							});

							observer.observe( this, {
								// for performance reasons, we observe
								// only the style attribute
								attributes: true,
								attributeFilter: [ "style" ]
							});

							self._cache.mutationObservers.submenus.push(
								observer
							);
						});
					} else {
						// a nonideal fallback used when MutationObserver
						// is not available (IE9/IE10)
						setTimeout(
							fixSubmenuPosition,
							$.ui.menu.prototype.delay
						);
					}
				}
			};

			$menu
				.show()
				.menu({
					focus: startFocusSelect,
					select: startFocusSelect,
					blur: function( event, ui ) {
						self._triggerBindedElementEvent({
							type  : "menuItemBlur",
							item  : $( ui.item ),
							menu  : $menu,
							button: $start,
							event : event
						});
					}
				})
				.position( startPosition )
				.hide();

			$start.on( "click." + self._cache.uep, function ( event ) {
				self._hideMenus({
					not: $menu
				});

				self._hideTooltips();

				self._stopOtherTaskbarsAutoOpenOnBrowse();

				var visible = $menu.is( ":visible" );

				// trigger event and respect prevention
				if ( self._triggerBindedElementEvent({
					type  : visible ? "elementClose" : "elementOpen",
					menu  : $menu,
					button: $start
				}) === false ) {
					return;
				}

				$( this ).addClass( self.classes.uiStateActive );

				$menu.toggle();

				if ( ! visible ) {
					self._openedElements( true );
					// last minute cleanup after previous time
					// when menu was shown
					$menu.find( "." + self.classes.uiStateActive )
						.removeClass( self.classes.uiStateActive );
				} else {
					self._openedElements( false );
				}
			});

			self._bindMenuAutoOpen( $start, $menu );

			$start.on(
				   "mouseup." + self._cache.uep
				+ " mouseleave." + self._cache.uep, function () {
				self._setConnectedButtonState.apply( this, [ self ] );
			});
		});

		if ( $menus.length ) {
			this._setSeparators( this.$startButtonsContainer );
		}
	},

	_rebuildTaskbarStartButtons: function () {
		this.$startButtonsContainer.remove();
		this._buildTaskbarStartButtons();
		this._refreshWindowButtonsContainer();
	},

	_buildTaskbarButtons: function ( options ) {
		var self = this;

		$.each ( options.buttons, function ( index, value ) {
			// if value.labelLocalized is specified and the translation
			// is present, it will be set to value.label and original label
			// will no longer be accessible
			if ( typeof( value.labelLocalized ) == "string" ) {
				value.label = self._i18n( value.labelLocalized ) || value.label;
			}

			// on case no localizedLabel and no label are specified,
			// use the internal index as label
			if ( ! value.label ) {
				// throw a warning, this should not be happening
				self._debugLogAdd(
					"No label or labelLocalized providen for button \"" +
					index + "\".", 2, 1
				);
				value.label = index;
			}

			// if button is not created yet, create it now
			if (
				   ! options.buttons [ index ].$element
				|| ! options.buttons [ index ].$element.length
			) {
				options.buttons [ index ]
					.$element = $( "<div></div>" )
					.appendTo ( options.container );
			// button could be already created, but has been moved outside
			// of visible containers  due to buttonsOrder or systemButtonsOrder
			// options - if that's the case, move it back from detach
			} else if (
				   options.buttons [ index ].$element
				&& options.buttons [ index ].$element.length
			) {
				options.buttons [ index ].$element
					.appendTo( options.container );

				return true;
			}

			options.buttons [ index ].$element
				.button( value )
				.attr( "data-button-name", index )
				.attr( "title", value.label )
				.addClass( self.classes.buttonUserDefined );
		});
	},

	// creates language select and language select menu
	_buildTaskbarLanguageSelect: function () {
		var self = this;

		if ( ! this._debugMenu() ) {
			return;
		}

		this.$languageSelect = this._factory( "languageSelect" )
			.appendTo( this.$systemButtonsContainer )
			.text( this._i18n( "slug" ) )
			.attr( "title", this._i18n( "languageSelect" ) )
			.attr( "data-button-name", "languageSelect" )
			.button();

		this._refreshButtonIcon.call( this.$languageSelect, this );

		this._afterSystemButtonCreate();

		this.$languageSelectMenu = this._factory( "languageSelectMenu" );

		$.each( this.options.languages, function ( index, value ) {
			// don't insert languages that aren't supported
			if ( ! self._translationsExists( value ) ) {
				return true;
			}

			self.$languageSelectMenu.append(
				$( "<li></li>" )
					.attr( "data-language-code", value )
					.append(
						$( "<a></a>" )
							.attr( "href", "#" )
							.text( self._i18n( "name", null, value ) )
					).on( "click." + self._cache.uep, function ( event ) {
						event.preventDefault();

						// change language via public API
						self.$elem.taskbar(
							"option",
							"language",
							$( this ).attr( "data-language-code" )
						);
						self._openedElements( false );
					})
			);
		});

		this.$languageSelectMenu
			.appendTo( this.$systemButtonsContainer )
			.show()
			.menu({
				focus: function( event, ui ) {
					self._triggerBindedElementEvent({
						type  : "menuItemFocus",
						item  : $( ui.item ),
						menu  : self.$languageSelectMenu,
						button: self.$languageSelect,
						event : event
					});
				},
				blur: function( event, ui ) {
					self._triggerBindedElementEvent({
						type  : "menuItemBlur",
						item  : $( ui.item ),
						menu  : self.$languageSelectMenu,
						button: self.$languageSelect,
						event : event
					});
				}
			});

		this.$languageSelect.on( "click."  + this._cache.uep, function () {
			self._hideMenus({
				not: self.$languageSelectMenu
			});
			self._hideDatepickers();

			self._hideTooltips();

			var visible = self.$languageSelectMenu.is( ":visible" );

			// trigger event and respect prevention
			if ( self._triggerBindedElementEvent({
				type  : visible ? "elementClose" : "elementOpen",
				menu  : self.$languageSelectMenu,
				button: self.$languageSelect
			}) === false ) {
				return;
			}

			self.$languageSelectMenu.toggle();

			if ( ! visible ) {
				self._positionTaskbarLanguageSelect();
				self._openedElements( true );
			} else {
				self._openedElements( false );
			}
		});

		this._bindMenuAutoOpen(
			this.$languageSelect,
			this.$languageSelectMenu
		);

		this._connectElements(
			this.$languageSelect,
			this.$languageSelectMenu
		);

		this.$languageSelect.on(
			   "mouseup." + this._cache.uep
			+ " mouseleave." + this._cache.uep, function () {
			self._setConnectedButtonState.apply( this, [ self ] );
		});
	},

	// shortcut for settings position the the language select menu
	_positionTaskbarLanguageSelect: function () {
		if (
			   ! this.$languageSelect.length
			|| ! this.$languageSelectMenu.length
		) {
			return;
		}

		this.$languageSelectMenu
			.position ( this._menuPosition({
				of: this.$languageSelect,
				elem: this.$languageSelectMenu
			}));
	},

	// check if dictionary for given language exists,
	// then generate debug message if it doesn't
	_translationsExists: function( langCode ) {
		if ( ! ( langCode in this.options.localization ) ) {
			this._debugLogAdd(
				"Value \"" + langCode + "\" present in \languages\ option, "
				+ "but not present in \"localization\".", 1, 1
			);

			return false;
		}

		return true;
	},

	// propagate language change to subordinates and windows
	_languageChange: function () {
		var self = this;

		$.each( this._cache.windowButtons, function ( index, elem ) {
			if ( elem === undefined ) {
				return true;
			}

			if ( elem.substr( 0, 6 ) === "group:" ) {
				var $group = self.$elem
					.find( "." + self.classes.windowButton +
						"[data-group-name=" + elem.substr( 6 ) + "]");
				self._groupSetTranslatedTitle.call( $group, self );
			}
		});

		// refresh windows translations
		$.each( this._cache.windows, function ( index, $elem ) {
			var instance = $( this ).data( self._cnst.dataPrefix + "window" );

			instance._languageChange();
		});
	},

	// function that performs minimize all action
	_minimizeAll: function () {
		var self          = this,
		    $windows      = $( "." + this.classes.windowContent ),
		    windowsLength = $windows.length;

		// windows will act somewhat different when minimize all is in progress
		this.$windowsContainment.data(
			this._cnst.dataPrefix + "minimizeAllInProgress", true
		);

		// minimize all windows, not just those of current taskbar
		$windows.each( function ( index ) {
			var $window = $( this );

			// only minimize non-minimized and minimizable windows
			if (
				 ! $window.window( "minimized" )
				&& $window.window( "option", "minimizable" )
			) {
				var minimize = $window.window( "option", "durations.minimize" );

				$window.window( "option", "durations.minimize", false )
					.window( "minimize" )
					.window( "option", "durations.minimize", minimize );
			}

			var instance = $window.data( self._cnst.dataPrefix + "window" );
			instance._setConnectedButtonState();
		});

		self.$windowsContainment.data(
			self._cnst.dataPrefix + "minimizeAllInProgress", false
		);
	},

	// build button for minimize all
	_buildTaskbarMinimizeAll: function () {
		var self = this;

		this.$minimizeAll = this._factory( "minimizeAll" )
			.appendTo( this.$systemButtonsContainer )
			.text( this._i18n( "minimizeAll" ) )
			.attr( "data-button-name", "minimizeAll" )
			.button({
				text: false
			}).on("click." + this._cache.uep, function () {
				self._minimizeAll();
			});

		this._setMinimizeAllHoverOpaqueWindows();

		this._refreshButtonIcon.call( this.$minimizeAll, this );

		this._afterSystemButtonCreate();
	},

	// sets opacity to windows where user hovers over minimize all button,
	// opacity is animated via CSS transitions, the animation
	// would be pretty bad if it would be done via JS on like 30 windows
	_setMinimizeAllHoverOpaqueWindows: function() {
		var self = this;
		// just to be safe, remove classes that could be left last time
		$( "." + this.classes.window )
			.removeClass(
				        this.classes.windowMinimizeAllHover
				+ " " + this.classes.windowMinimizeAllUnhover
			);

		// clear events bound last time
		this.$minimizeAll
			.off(
			      "mouseenter." + this._cache.uep
			   + " mouseleave." + this._cache.uep
			  );

		if ( this.options.minimizeAllHoverOpaqueWindows ) {
			this.$minimizeAll.on(
				   "mouseenter." + this._cache.uep
				+ " mouseleave." + this._cache.uep, function ( e ) {
				$( "." + self.classes.window )
					.removeClass(
						        self.classes.windowMinimizeAllHover
						+ " " + self.classes.windowMinimizeAllUnhover
					);

				// add class to all windows
				if ( e.type === "mouseenter" ) {
					$( "." + self.classes.window )
						.not( "." + self.classes.windowUnminimizable )
						.addClass( self.classes.windowMinimizeAllHover )
						.removeClass( self.classes.windowMinimizeAllUnhover );

					// clear revert, we don't want classes disappearing
					clearTimeout(
						self._cache.timeouts.minimizeAllHoverOpaqueWindowsRevert
					);
				} else {
					$( "." + self.classes.window )
						.addClass( self.classes.windowMinimizeAllUnhover )
						.removeClass( self.classes.windowMinimizeAllHover );

					// try to find transition duration of unhover class
					var styles = self._styleIndicator(
						self.classes.windowMinimizeAllUnhover,
						[ "transitionDuration", "mozTransitionDuration",
						 "webkitTransitionDuration", "oTransitionDuration" ]
					);

					// let's make this assumption if nothing better comes up
					var delay = 1;

					$.each( styles, function ( index, value ) {
						if ( value ) {
							// multiply by 2; this class doesn't need
							// to be removed immediately, and this way we're
							// sure the CSS animation will end smoothly
							delay = parseFloat( value, 10 ) * 2;
							return false;
						}
					});

					// turn CSS seconds into JS milliseconds
					delay *= 1000;

					// set timeouted revert
					self._cache.timeouts.minimizeAllHoverOpaqueWindowsRevert =
						setTimeout( function () {
							$( "." + self.classes.window )
								.removeClass(
									self.classes.windowMinimizeAllUnhover
								);
						}, delay );
				}
			});
		} else {
			clearTimeout(
				self._cache.timeouts.minimizeAllHoverOpaqueWindowsRevert
			);
		}
	},

	// build toggle fullscreen button
	_buildTaskbarToggleFullscreen: function() {
		var self = this;

		this.$toggleFullscreen = this._factory( "toggleFullscreen" )
			.appendTo ( this.$systemButtonsContainer )
			.attr( "data-button-name", "toggleFullscreen" )
			.button({
				text: false
			}).on( "click." + this._cache.uep, function ( event ) {
				var ui = {};

				var enabled = self._fullscreenEnabled();

				// save previous state
				ui.fullscreenEnabled = enabled;

				if (
					self._trigger( "beforeRequestFullscreen", event, ui )
					=== false
				) {
					return;
				}

				ui = {};

				// leave fullscreen when in fullscreen,
				// enter fullscreen when not in fullscreen
				enabled ? self._fullscreenLeave() : self._fullscreenEnter();
				self._setFullscreenToggleState();

				// add current state
				ui.fullscreenEnabledBefore = enabled;
				ui.fullscreenEnabled = self._fullscreenEnabled();

				self._trigger( "requestFullscreen", event, ui );
			});

		this._setFullscreenToggleState();
		this._afterSystemButtonCreate();
	},

	// sets label for toggle fullscreen, based on whether
	// browser is in fullscreen mode or not
	_setFullscreenToggleState: function () {
		this.$toggleFullscreen
			.button( "option", "label",
				this._i18n(
					this._fullscreenEnabled()
						? "toggleFullscreenLeave"
						: "toggleFullscreenEnter"
				)
			);

		this._refreshButtonIcon.call( this.$toggleFullscreen, this );
	},

	// build network monitor button
	_buildTaskbarNetworkMonitor: function () {
		this.$networkMonitor = this._factory( "networkMonitor" )
			.appendTo ( this.$systemButtonsContainer );

		this.$networkMonitor
			.attr( "data-button-name", "networkMonitor" )
			.button({
				text: false
			});

		this._disableButton.call( this.$networkMonitor, this );

		this._setNetworkMonitorStatus();

		this._afterSystemButtonCreate();
	},

	// get dictionary key, based on network status
	_getNetworkMonitorKey: function () {
		var online = !! window.navigator.onLine;

		return "networkMonitor" + ( online ? "Online" : "Offline" );
	},

	_setNetworkMonitorStatus: function () {
		if ( ! this.$networkMonitor.length ) {
			return;
		}

		this.$networkMonitor.button(
			"option",
			"label",
			this._i18n( this._getNetworkMonitorKey() )
		);

		this._refreshButtonIcon.call( this.$networkMonitor, this );
	},

	// build clock
	_buildTaskbarClock: function () {
		var self = this;

		this.$clock = this._factory( "clock" )
			.appendTo( this.$systemButtonsContainer )
			.attr( "data-button-name", "clock" )
			.button();

		this._refreshButtonIcon.call( this.$clock, this );

		this._afterSystemButtonCreate();

		this._setClockWidth();

		// update clock every 1s - initial update if made
		// by _setClockWidth()
		this._cache.intervals.clock = setInterval( function () {
			self._clockUpdate();
		}, 1000 );

		this._buildTaskbarClockDatepicker();
	},

	// build clock datepicker
	_buildTaskbarClockDatepicker: function () {
		var self = this;

		var setHeaderTaskbarUuid = function () {
			self.$datepicker
				.find( "." + self.classes.uiDatepickerHeader )
				.attr( "data-taskbar-uuid", self.uuid );
		};

		// debug for when there's missing jQuery components:
		// datepicker or it's translations
		if ( this.options.clock && this.options.clockShowDatepicker
			&& ( ! $.ui.datepicker || ! $.datepicker ) ) {
			this._debugLogAdd(
				"jQuery UI Datepicker is required for " +
				"clock datepicker to work.", 1, 0
			);
		}

		if (
			   this.options.clock
			&& this.options.clockShowDatepicker
			&& $.ui.datepicker
			&& $.datepicker
		) {
			var datepickerLang = this._i18n( "code" );

			// remove previous datepicker
			if ( this.$datepicker && this.$datepicker.length ) {
				this.$datepicker.remove();
			}

			// pickup translations
			var datepickerTranslations =
				$.datepicker && this._isRealObject( $.datepicker.regional )
					? $.datepicker.regional[
						datepickerLang == "en"
							? ""
							: datepickerLang
					] || {}
					: {};

			this.$datepicker = this._factory( "datepicker" )
				.prependTo ( this.$systemButtonsContainer )
				.uniqueId()
				.datepicker( datepickerTranslations )
				.hide();

			// refresh taskbar uuid - we'll need that in window click handler,
			// when datepicker header is already detached by the time
			// it's fired, so some other means of determining that clicked
			// datapicker was of current taskbar is required
			this.$datepicker.datepicker(
				"option",
				"onChangeMonthYear",
				setHeaderTaskbarUuid
			);


			this.$clock
				.off( "click." + this._cache.uep )
				.on( "click."  + this._cache.uep, function () {
					self._hideMenus();
					self._hideTooltips();
					self._hideDatepickers({
						not: self.$datepicker
					});
					self._stopOtherTaskbarsAutoOpenOnBrowse();

					var visible = self.$datepicker.is( ":visible" );

					// trigger event end respect prevention
					if ( self._triggerBindedElementEvent({
						type  : visible ? "elementClose" : "elementOpen",
						menu  : self.$datepicker,
						button: self.$clock
					}) === false ) {
						return;
					}

					self.$datepicker.toggle();

					if ( ! visible ) {
						setHeaderTaskbarUuid();
						self._positionTaskbarDatepicker();
						self._openedElements( true );
					} else {
						self._openedElements( false );
					}
				});

			this._bindMenuAutoOpen( this.$clock, this.$datepicker );
			this._connectElements( this.$clock, this.$datepicker );

			this.$clock.off(
				   "mouseup."    + this._cache.uep
				+ " mouseleave." + this._cache.uep
				).on(
				   "mouseup."    + this._cache.uep
				+ " mouseleave." + this._cache.uep, function () {
					self._setConnectedButtonState.apply( this, [ self ] );
				});
		} else if ( this.$clock && this.$clock.length ) {
			this._disableButton.call( this.$clock, this );
		}
	},
	_setClockWidth: function () {
		if ( ! this.$clock.length ) {
			return;
		}

		var fakeTime = this._getFormattedTime({
		    	hour    : 11,
		    	minute  : 11,
		    	second  : 11,
		    	millisec: 111,
		    	timezone: 0
		    });

		var prevWidth = this.$clock.outerWidth();

		this.$clock.css( "width", "auto" );

		this.$clock.button( "option", "label", fakeTime );

		// set clock width explicitly to the highest width possible,
		// for the current time format, because clock
		// shouldn't change it's container size when time passes;
		// that would be a big problem for when people use
		// time formats without leading zeros, like H:m:s
		this.$clock.css( "width", this.$clock.css( "width" ) );

		if (
			prevWidth !== this.$clock.outerWidth()
			// if the container is not present, it's content
			// will be refreshed after creation, so don't bother
			&& this.$windowButtonsContainer.length
		) {
			this._refreshWindowButtonsContainer();
		}

		this._clockUpdate();
	},

	_disableButton: function ( self ) {
		this
			.button("option", "disabled", true)
			// don't want the visuals, just the behaviour
			.removeClass( self.classes.uiStateDisabled )
			// setts default cursor instead of text
			.addClass( self.classes.buttonDisabled )
			.on( "click." + self._cache.uep, function () {
				self._hideAll();
			});
	},

	// shortcut for positioning datepicker
	_positionTaskbarDatepicker: function () {
		var self = this;

		this._datepickerSetPosition();

		this.$datepicker
			.off( "click." + this._cache.uep )
			.on( "click." + this._cache.uep, function () {
			self._datepickerSetPosition();
		});
	},

	// when taskbar is horizontal and sticks to top edge,
	// $buttonsContainer, $systemButtonsContainer and $startButtonsContainer
	// buttons has to go to the bottom edge of the taskbar
	_positionTopContainersContent: function ( self ) {
	var $this = $( this );
		$this.css( "marginTop", "" );

		if (
			   self._cache.horizontal
			&& self._cache.edge === "top"
			&& self.options.horizontalRows > 1
		) {
			$this.each( function () {
				var $this         = $( this ),
				    taskbarHeight = self.$elem.outerHeight(),
				    height        = $this.outerHeight(),
				    paddings      = parseFloat( $this.css( "paddingTop" ) )
				    			  + parseFloat( $this.css( "paddingBottom" ) ),
				    borders       = parseFloat(
				    	self.$elem.css( "borderTopWidth" )
				    )
				    + parseFloat(
				    	self.$elem.css( "borderBottomWidth" )
				    ),
				    // taskbar height minus taskbar borders and elem padding
				    // it's what we need
				    val           = taskbarHeight - height - borders;

				$this.css( "marginTop", val );
			});
		}
	},

	// apply jQuery UI Tooltip if "buttonTooltips" is set to true
	_setButtonsTooltips: function () {
		if ( this.options.buttonsTooltips && ! $.ui.tooltip ) {
			this._debugLogAdd(
				"jQuery UI Tooltip is required for buttons tooltips to work.",
				1, 0
			);
		}

		if ( ! $.ui.tooltip ) {
			return;
		}

		var self = this,
		    positions = {
		    	top:    {
		    		my       : "right top+2",
		    		at       : "right bottom",
		    		collision: "flipfip"
		    	},
		    	bottom: {
		    		my       : "right bottom-2",
		    		at       : "right top",
		    		collision: "flipfip"
		    	},
		    	left:   {
		    		my       : "left bottom-2",
		    		at       : "left top",
		    		collision: "flipfip"
		    	},
		    	right:  {
		    		my       : "right bottom-2",
		    		at: "right top",
		    		collision: "flipfip"
		    	}
		    };

		var $elems = this.$elem
			.find(
				"." + this.classes.systemButtonsContainer +
				" > ." + this.classes.uiButton
			)
			.add( this.$elem
				.find(
					"." + this.classes.windowButtonsContainer +
					" > ." + this.classes.uiButton
				)
			)
			.add( this.$elem
				.find(
					"." + this.classes.buttonsContainer +
					" > ." + this.classes.uiButton
				)
			)
			.add( this.$elem
				.find(
					"." + this.classes.startButtonsContainer +
					" > ." + this.classes.uiButton
				)
			);

		if ( ! this.options.buttonsTooltips ) {
			$elems.each( function () {
				var $this = $( this );

				var widget = self._getTooltipInstance.call( $this );

				if ( widget ) {
					try {
						$this.tooltip( "destroy" );
					} catch ( e ) {}
				}
			});

			return;
		}

		var horizontal = this.options.orientation === "horizontal";

		$elems.each( function () {
			var $this = $( this );

			var widget = self._getTooltipInstance.call( $this );

			// no tooltip on an element
			if ( widget ) {
				return true;
			}

			var position = $.extend( {}, positions[ self._cache.edge ] );

			var $parents = $this.parents();

			var parentIsInitialContainer =
				   $parents.is( self.$startButtonsContainer )
				|| $parents.is( self.$buttonsContainer );

			// move tooltips to the center or left for containers
			// that are on the center or left
			if ( self._cache.edge.match(/top|bottom/) ) {
				var horizontalLeftToRight = horizontal && parentIsInitialContainer;

				if ( horizontalLeftToRight ) {
					position.my = position.my.replace( "right", "left" );
					position.at = position.at.replace( "right", "left" );
				}

				if ( horizontal && $parents.is( self.$windowButtonsContainer ) ) {
					position.my = position.my.replace( "right", "center" );
					position.at = position.at.replace( "right", "center" );
				}
			}

			if ( self._cache.edge.match(/left|right/) ) {
				var verticalTopToBottom = ! horizontal && parentIsInitialContainer;

				if ( verticalTopToBottom ) {
					position.my = position.my.replace( "bottom", "top" );
					position.at = position.at.replace( "top", "bottom" );
				}
			}

			$this.tooltip({
				position: position,
				tooltipClass: self.classes.buttonTooltip,
				show: self.options.durations.buttonsTooltipsShow,
				hide: self.options.durations.buttonsTooltipsHide,
				open: function ( event, ui ) {
					var $tooltip = $( ui.tooltip );
					var $target = $( event.target );
					var tooltipId = $tooltip[ 0 ].id;
					var targetId = $target[ 0 ].id;

					// hide other tooltips
					self._hideTooltips({
						not: $target
					});

					$tooltip.on( "mouseenter." + self._cache.uep, function () {
						self._hideTooltips();
						self._hideToolTipNoAnimation.call(
							$target, self, $tooltip
						);
					});

					var $connected = self.connectedElement( $this )
						.filter( "." +  self.classes.uiHasDatepicker )
						.add(
							self.connectedElement( $this )
							.filter( "." + self.classes.uiMenu )
						);

					// some buttons with tooltips don't have connected elements
					if ( $connected.length && $connected.is( ":visible" ) ) {
						self._hideTooltips();
					}
				},
			});
		});
	},

	_hideTooltips: function ( options ) {
		if ( ! $.ui.tooltip ) {
			return;
		}

		var self = this;

		// hide all tooltips of elements of current taskbar
		// that have tooltips opened
		var $tooltipsHaving =
			$( "." + this.classes.taskbar )
				.find( "[aria-describedby^=\"" + this.classes.uiTooltip + "\"]" )
				.not( options && options.not ? options.not : null );

		$tooltipsHaving.each( function () {
			var $this = $( this );

			var widget = self._getTooltipInstance.call( $this );

			if ( widget ) {
				self._hideToolTipNoAnimation.call( $this, self );
			}
		});
	},

	// hide tooltips immediately, for example in cases
	// where cursor if over tooltip and tooltip is blocking
	// window menu group
	_hideToolTipNoAnimation: function ( self, $tooltip ) {
		if ( ! $tooltip ) {
			var describedBy = this.attr( "aria-describedby" );
			$tooltip        = $( "#" + describedBy );
		}

		var cachedHide = this.tooltip( "option", "hide" );
		this.tooltip( "option", "hide", false );
		this.tooltip( "close" );
		$( "div." + self.classes.uiTooltip ).stop( true, true ).hide();
		this.tooltip( "option", "hide", cachedHide );
	},

	_getTooltipInstance: function () {
		var widget = null;

		try {
			widget = this.tooltip( "widget" );
		} catch (e) {}

		return widget;
	},

	_afterSystemButtonCreate: function () {
		// position container
		this._positionTopContainersContent.call(
			this.$systemButtonsContainer, this
		);
	},

	// helper to determine if element inside of taskbar is native subordinate
	_isNativeElement: function ( $elem ) {
		return $elem.hasClass( this.classes.separator )
			|| $elem.hasClass( this.classes.container );
	},

	_refreshWindowButtonsContainer: function () {
		this._setwindowButtonsContainerSize();
		this._setWindowButtonsSizes();
	},

	_setwindowButtonsContainerSize: function () {
		// reset width and height first,
		// so they have no impact on neighbouring elements
		this.$windowButtonsContainer.css({
			width: 0,
			height: 0
		});

		if ( this._cache.horizontal ) {
			this.$windowButtonsContainer.scrollTop( 0 );
		}

		var self            = this,
		    horizontal      = this.options.orientation === "horizontal",
		    $wins           = this.$windowButtonsContainer,
		    computed        = window.getComputedStyle( $wins[ 0 ] ),
		    // find prev element, visually, co don't count in non-natives,
		    // empty containers, unvisible elements (e.g. separators
		    // for empty containers), floats: right, and positions: absolute
		    $prev           = this.$windowButtonsContainer
		    	.prevAll( ":not(:empty):visible:eq(0)" )
		    	.filter( function () {
		    		var $this = $( this );

		    		if ( ! self._isNativeElement( $this ) ) {
		    			return false;
		    		}

		    		if (
		    			   $this.css( "float" ) === "right"
		    			&& self._cache.horizontal
		    		) {
		    			return false;
		    		}
		    		if (
		    			   $this.css( "position" ) === "absolute"
		    			&& ! self._cache.horizontal
		    		) {
		    			return false;
		    		}

		    		return true;
		    	}),
		    $next,
		    farRight, farLeft, paddingsHorizontal,
		    farBottom, farTop, paddingsVertical;

		if ( horizontal ) {
			// remove classes used only for vertical taskbar
			$wins.removeClass(
				        this.classes.windowButtonsContainerFirstChild
				+ " " + this.classes.windowButtonsContainerOnlyChild
			);

			// find next element - it has to have float: right
			$next = $wins.siblings().filter( function () {
				var $this = $( this );

				if ( ! self._isNativeElement( $this ) ) {
					return false;
				}

				if ( $this.css( "float" ) === "right" ) {
					return true;
				}
			});

			$next = $next.filter( ":not(:empty):eq(0)" );

			// calculate far right position, far left position,
			// and horizontal padding
			farRight =
				$next.length
					? $next.position().left
					: this.$elem.outerWidth() - $wins.position().left,

			farLeft =
				$prev.length
					? $prev.position().left + $prev.outerWidth()
					: parseInt( this.$elem.css( "left" ), 10 ) || 0,

			paddingsHorizontal = parseFloat(
				this._styleIndicator(
					  "$." + this.classes.windowButtonsContainer
					+ " > div." + this.classes.windowButton, "paddingLeft"
					).paddingLeft
				);
		} else {
			// find all previous containers that aren't empty
			var $winsPrevAll = $wins.siblings().filter(function () {
				return self._filterNonEmptyContainers.call(
					$( this ), self, true
				);
			});
			// find all next containers that aren't empty
			var $winsNextAll = $wins.siblings().filter(function () {
				return self._filterNonEmptyContainers.call( $( this ), self );
			});

			// is this is first child looking from the top
			this.$windowButtonsContainer.toggleClass(
				this.classes.windowButtonsContainerFirstChild,
				! $winsPrevAll.length
			);

			// is this the only nonempty container
			this.$windowButtonsContainer.toggleClass(
				this.classes.windowButtonsContainerOnlyChild,
				! $winsNextAll.length && ! $winsPrevAll.length
			);

			// get separator height, usually 1px
			var separatorFixHeight = this.$systemButtonsContainer
			    	.children( "." + this.classes.uiButton )
			    	.filter( ":visible" )
			    	.length
			    		? parseInt(
			    			$( "[data-separator-for=systemButtonsContainer]" )
			    				.css( "borderTopWidth" ),
			    			10
			    		) || 0
			    		: 0;

			// find next element looking from the top
			    $next = this.$elem
			    	.find( "." + this.classes.systemButtonsSeparator )
			    	.filter( ":visible" );

			// calculate far bottom position, far top position,
			// and vertical padding
			    farBottom = $next.length
			    	? this._extendedPosition.call( $next, "offset" ).top
			    	: this.$elem.outerHeight() - $wins.position().top,

			    farTop = $prev.length
			    	? this._extendedPosition.call( $prev, "offset" ).bottom
			    	: this._extendedPosition.call( this.$elem, "offset" ).top,

			    paddingsVertical = $wins
			    	.hasClass( this.classes.windowButtonsContainerOnlyChild )
			    	? 0
			    	: parseFloat(
			    		this._styleIndicator(
			    			  "$." + this.classes.windowButtonsContainer
			    			+ " > div." + this.classes.windowButton,
			    			"paddingTop"
			    			).paddingTop
			    		) * 2 - separatorFixHeight;
		}

		// calculate height and width
		var windowButtonsWidth = ! this._cache.horizontal
			// horizontal
			? ""
			// vertical
			: farRight - farLeft - paddingsHorizontal * 2;

		var verticalHeight = ( $next && $next.length
				? $next.position().top + $next.outerHeight()
				: this.$elem.innerWidth()
			)
			- (
				$prev.length
					? ( $prev.position().top + $prev.outerHeight() )
					: ( this.$elem.outerHeight() + this.$elem.position().top )
			)
			- parseFloat( computed.paddingTop ) * 2;

		var windowButtonsHeight = this._cache.horizontal
			// horizontal
			? this.$elem.innerHeight()
			// vertical
			: farBottom - farTop - paddingsVertical;

		// if horizontal taskbar has only one row, set axis on sortable,
		// so buttons won't bounce of the edges of container
		var singleHorizontalRow =
			   this._cache.horizontal
			&& this.options.horizontalRows === 1;

		if ( this.options.windowButtonsSortable && $.ui.sortable ) {
			this.$windowButtonsContainer.sortable(
				"option",
				"axis",
				singleHorizontalRow ? "x" : false
			);
		}

		// just to be sure
		if ( horizontal ) {
			--windowButtonsWidth;
		}

		this.$windowButtonsContainer.css({
			width: windowButtonsWidth,
			height: windowButtonsHeight
		});
	},

	// set equal sizes to window buttons, in case when buttons with their
	// natural sizes would overflow container
	_setWindowButtonsSizes: function () {
		var self = this,
			widths = {},
			heights = {},
			$buttons = this.$elem.find( "." + this.classes.windowButton );

		if ( ! $buttons.length ) {
			return;
		}

		var $buttonFirst = $buttons.filter( ":eq(0)" ),
		    $buttonLast  = $buttons.filter( ":last" ),
		    marginRight  = parseFloat(
		    	window.getComputedStyle( $buttonFirst[ 0 ] ).marginRight
		    ),
		    marginBottom = parseFloat(
		    	window.getComputedStyle( $buttonFirst[ 0 ] ).marginBottom
		    ),
		    diff         =
		    	$buttonFirst.outerWidth() - $buttonFirst.innerWidth();

		// reset styles
		$buttons.each( function () {
			var $this = $( this );

			// clear button dimensions
			self._copyStyles({
				to        : $this,
				properties:  [ "maxWidth", "maxHeight", "display" ]
			});

			// gather buttons widts
			widths [ this.id ] = $this.outerWidth()  + marginRight;
		});

		if ( this._cache.horizontal ) {

			var width = 0;

			if ( $buttonLast.offset().top
				>= this.$windowButtonsContainer.offset().top
				 + this.$windowButtonsContainer.innerHeight()
			) {
				// buttons don't overflow container, nothing to do here
				$.each( widths, function ( index, value) {
					width += value;
				});

				// number of buttons expected to be container in each row
				var inRow    = Math.ceil(
				    	$buttons.length / this._getRealRowCol( "horizontal")
				    ),
				    // button max width to be applied
				    maxWidth = Math.floor(
				    	this.$windowButtonsContainer.innerWidth() / inRow
				    	- marginRight
				    	- diff
				    );

				$buttons.css( "maxWidth", maxWidth );

				// calculate smaller width for window buttons
				$buttons = this
					.$windowButtonsContainer
					.children( "." + this.classes.uiButton );
				var $lastButton = $buttons.filter( ":last" );

				// there are no buttons, nothing to do here
				if ( $lastButton.length ) {
					var rows = {};

					// set empty jQuery object for every row we have
					for( var i = 1; i <= this.options.horizontalRows; i++ ) {
						rows[ i ] = $();
					}

					var rowStart = this._extendedPosition.call(
					    	$buttons.filter( ":eq(0)" ), "offset"
					    ).top,
					    currentRow = 1;

					// sort buttons to their rows
					$buttons.each( function () {
						var $this = $( this );

						var top = self._extendedPosition.call(
							$this, "offset"
						).top;

						if (
							   top - 2 > rowStart
							&& currentRow < self.options.horizontalRows
						) {
							// we'll in next row now
							rowStart = top;
							++currentRow;
						}

						rows[ currentRow ] = rows[ currentRow ].add( $this );
					});

					var lastButtonOffset = this._extendedPosition.call(
					    	$lastButton, "offset"
					    ),
					    containerOffset  = this._extendedPosition.call(
					    	this.$windowButtonsContainer, "offset"
					    );

					// if last button is over the bottom edge of container
					if (
						lastButtonOffset.bottom
						> containerOffset.bottom + lastButtonOffset.height / 2
					) {
						var $allExceptLast =
						    	rows[ this._getRealRowCol( "horizontal" ) ]
						    	.filter( ":not(:last)" ),
						     iteration = 0;

						while (
							lastButtonOffset.bottom >
							containerOffset.bottom + lastButtonOffset.height / 2
						) {
							// decrease max width by 1px
							$allExceptLast.each( function () {
								this.style.maxWidth = ""
									+ ( parseInt( this.style.maxWidth, 10 ) - 1 )
									+ "px";
							});

							iteration++;

							if ( iteration === 50 ) {
								// something's not right, break here to avoid
								// infinite loop;  it could be a simple as page
								// not being visible during calculations
								break;
							}

							// after max width change, refresh
							// $lastButton offset for the while condition
							lastButtonOffset = this._extendedPosition.call(
								$lastButton, "offset"
							);
						}
					}
				}
			}

			// cache calculated button's widths
			// - when sortable starts, it'll be too late to get to them
			$buttons.each( function () {
				$( this ).data(
					self._cnst.dataPrefix + "taskbarButtonFloatWidth",
					window.getComputedStyle( this ).width
				);
			});
		}

		if ( this.options.windowButtonsSortable && $.ui.sortable ) {
			this.$windowButtonsContainer.sortable( "refreshPositions" );
		}
	},

	_connectElements: function ( $elem1, $elem2 ) {
		// force elements to have ID
		// (ID won't be set if element already has ID)
		var elem1 = $elem1.uniqueId().attr( "id" );
		var elem2 = $elem2.uniqueId().attr( "id" );

		// single element can have multiple connnected elements
		this._cache.connectedElements[ elem1 ] = this._cache
			.connectedElements[ elem1 ] || [];
		this._cache.connectedElements[ elem1 ].push( elem2 );

		this._cache.connectedElements[ elem2 ] = this._cache
			.connectedElements[ elem2 ] || [];
		this._cache.connectedElements[ elem2 ].push( elem1 );
	},

	// return connected element or empty jQuery object if no connected
	// element can be found
	connectedElement: function ( item ) {
		var $empty = $(),
		    itemId;

		// either jQuery object, DOM object,
		// or item id could be passed as parameter
		if ( item instanceof $ && item.length && item[ 0 ].id ) {
			itemId = item[ 0 ].id;
		} else if ( item.nodeName ) {
			itemId = item.id;
		} else if ( typeof item === "string" ) {
			itemId = item;
		}

		if ( ! itemId ) {
			return $empty;
		}

		var elems = this._cache.connectedElements[ itemId ];

		// return empty jQuery object if no connected element was found
		if ( ! elems || ! elems.length ) {
			return $empty;
		}

		var $elems = $();

		// build a set of connected elements
		$.each( elems, function ( index, id ) {
			$elems = $elems
				.add( $( "#" + id ) );
		});

		return $elems.length ? $elems : $empty;
	},

	// find all elements that should participate
	// that should autoOpen on hover when a taskbar
	// subordinate is currently open, and bind appropiate handlers
	_bindMenusAutoOpen: function () {
		var self = this,
		    $buttons = this.$elem
		    	.find( "." + this.classes.uiButton );

		var $elems = $()
			.add( $buttons.filter( "[data-menu-button]") )
			.add( $buttons.filter( "[data-group-name]") )
			.add( this.$languageSelect )
			.add( this.$clock );

		$elems.each( function () {
			var $connected = self.connectedElement( this );

			if ( ! $connected.length ) {
				return;
			}

			self._bindMenuAutoOpen(
				$( this ),
				$connected
			);
		});
	},

	// bind auto open login to buttons
	_bindMenuAutoOpen: function ( $button, $elem ) {
		var self = this;

		var eventName = "mouseenter." + this._cache.uep + "menuautoopen";

		// unbind handler - act as destroyer
		$button.off( eventName );

		if ( ! this.options.menuAutoOpenOnBrowse
		  || ! $button.length
		  || ! $elem.length
		) {
			return;
		}

		$button.on( eventName, function () {
			if (
			   self._cache.progress.windowButtonsSortable
			|| self._cache.progress.taskbarDraggable
			) {
				return true;
			}

			if ( self._openedElements() && ! $elem.is( ":visible" ) ) {
				self._cache.progress.menuAutoOpenOnBrowse = true;
				// suppressSingleGroupClick will prevent window showing
				// on group buttons that have only one window currently binded
				self._cache.suppressSingleGroupClick = true;
				$( this ).trigger( "click."  + self._cache.uep );
				self._cache.suppressSingleGroupClick = false;
			}
		});
	},

	_stopOtherTaskbarsAutoOpenOnBrowse: function () {
		var self = this;

		$( "." + this.classes.taskbar )
			.not( this.$elem )
			.each( function () {
				var $this = $( this ),
				    instance = $this.data( self._cnst.dataPrefix + "taskbar" );

				instance.hideSubordinates();
				instance._openedElements( false );
				instance._cache.progress.menuAutoOpenOnBrowse = false;
			});
	},

	// setts state for a button
	_setConnectedButtonState: function ( self ) {
		// connected element
		var $connectedElems = self.connectedElement( this );

		if ( !$connectedElems.length ) {
			return;
		}

		var $elems      = self.connectedElement( this ),
		    active      = false,
		    activeClass = self.classes.uiStateActive;

		$.each( $elems, function () {
			var $elem = $( this );

			// when connected element is window
			if ( $elem.hasClass( self.classes.windowContent ) ) {
				// check if active class is present
				active = $elem.window( "widget" ).hasClass(
					self.classes.windowTop
				);

			// when connected element is window menu group
			} else if ( $elem.hasClass( self.classes.windowGroupMenu ) ) {

				// itterate through elems connected to button
				// - in window groups there's more than one
				$connectedElems.each( function () {
					var $connected = $( this );


					// we deal with window menu group
					if ( ! $connected.hasClass( self.classes.uiDialogContent ) ) {
						if ( $connected.is( ":visible" ) ) {
							// found opened window group, break here,
							// active = true will be set after that loop
							return false;
						}

						// window group menu could be hidden,
						// but windows are visible, so continue
						return true;
					}

					// check if active class is present
					if (
						$connected.window( "widget" )
							.hasClass( self.classes.windowTop )
					) {
						// found active window, break here
						active = true;
						return false;
					}
				});

				// on no window is active, the menu itself could be visible
				if ( ! active ) {
					active = $elem.is( ":visible" );
				}
			} else {
				// datepicker, language menu, start menu, etc.
				active = $elem.is( ":visible" );
			}

			// break if found
			if ( active ) {
				return false;
			}
		});

		// set class
		$( this ).toggleClass( self.classes.uiStateActive, active );
	},

	// set connected button state on all buttons
	_setConnectedButtonsStates: function () {
		var self = this;

		this.$systemButtonsContainer
			.add( this.$windowButtonsContainer )
			.add( this.$buttonsContainer )
			.children( "." + this.classes.uiButton ).each( function () {
				self._setConnectedButtonState.call( this, self );
			});
	},

	// updates time button label and inserts current time
	_clockUpdate: function () {
		var $clock = this.$elem.find( "." + this.classes.clock );

		$clock
			.button( "option", "label", this._getFormattedTime() )
			.attr( "title", this._getFormattedDate() );
	},

	// use datepicker formatDate function to format date for clock tooltip
	_getFormattedDate: function () {
		var lang = this.options.language !== "en" ? this.options.language : "";

		// if datepicker is not present, use empty string,
		// meaning tooltip will not show
		if ( ! $.datepicker ) {
			return "";
		}

		// generate debug for missing translations
		if ( ! $.datepicker.regional[ lang ] ) {
			this._debugLogAdd(
				"Language \"" + lang + "\" required for formatting " +
				"date for clock tooltip, but datepicker translations " +
				"were not found.", 1, 1
			);

			return "";
		}

		return $.datepicker.formatDate(
			this._i18n( "clockDateFormat" ),
			new Date(), {
				dayNamesShort  : $.datepicker.regional[ lang ].dayNamesShort,
				dayNames       : $.datepicker.regional[ lang ].dayNames,
				monthNamesShort: $.datepicker.regional[ lang ].monthNamesShort,
				monthNames     : $.datepicker.regional[ lang ].monthNames
			}
		);
	},

	// functions taken from jQuery Timepicker Addon and slightly changed
	// for this plugin
	// Copyright (c) 2014 Trent Richardson; Licensed MIT
	// usage: http://trentrichardson.com/examples/timepicker/#tp-formatting
	_getFormattedTime: function ( time ) {
		var date = new Date(),
		    format = this._i18n( "clockTimeFormat" ),
		    time = time || {
		    	hour    : date.getHours(),
		    	minute  : date.getMinutes(),
		    	second  : date.getSeconds(),
		    	millisec: date.getMilliseconds(),
		    	timezone: date.getTimezoneOffset()
		    };

		var convert24to12 = function (hour) {
			hour %= 12;

			if (hour === 0) {
				hour = 12;
			}

			return String(hour);
		};

		var tmptime = format,
			ampmName = this._i18n( "clockAmSymbol" ),
			hour = parseInt( time.hour, 10 );

		if ( hour > 11 ) {
			ampmName = this._i18n( "clockPmSymbol" );
		}

		tmptime = tmptime.replace(
			/(?:HH?|hh?|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|'.*?')/g,
			function (match) {
			switch (match) {
			case "HH":
				return ("0" + hour).slice(-2);
			case "H":
				return hour;
			case "hh":
				return ("0" + convert24to12(hour)).slice(-2);
			case "h":
				return convert24to12(hour);
			case "mm":
				return ("0" + time.minute).slice(-2);
			case "m":
				return time.minute;
			case "ss":
				return ("0" + time.second).slice(-2);
			case "s":
				return time.second;
			case "l":
				return ("00" + time.millisec).slice(-3);
			case "c":
				return ("00" + time.microsec).slice(-3);
			case "z":
				return $.timepicker.timezoneOffsetString(
					time.timezone === null
						? options.timezone
						: time.timezone,
					false
				);
			case "Z":
				return $.timepicker.timezoneOffsetString(
					time.timezone === null
						? options.timezone
						: time.timezone,
					true
				);
			case "T":
				return ampmName.charAt(0).toUpperCase();
			case "TT":
				return ampmName.toUpperCase();
			case "t":
				return ampmName.charAt(0).toLowerCase();
			case "tt":
				return ampmName.toLowerCase();
			default:
				return match.replace(/'/g, "");
			}
		});

		return tmptime;
	},

	// blur all windows using window "moveToTop" method with additional params
	_blurWindows: function () {
		$( "." + this.classes.window + ":eq(0) ." +
			this.classes.windowContent + ":eq(0)" )
		.window( "moveToTop", {
			skipThis      : true,
			skipMinimizing: true,
			blurModals    : true
		});
	},

	// returns all windows binded to this taskbar
	_windows: function () {
		var $collection = $();

		$.each( this._cache.windows, function ( index, elem ) {
			var $window = $( "#" + index );
			if ( $window.length ) {
				$collection = $collection.add( $window );
			}
		});

		return $collection;
	},

	// sets position of datepicker
	_datepickerSetPosition: function() {
		var $clock = this.$elem.find( "." + this.classes.clock ),
			$datepicker = this.$elem.find( "." + this.classes.datepicker );

		if ( ! $clock.length || ! $datepicker.length ) {
			return;
		}

		var datepickerMenuPosition = this._menuPosition({
			of: $clock,
			elem: $datepicker
		});

		$datepicker
			.position ( datepickerMenuPosition );
	},

	_parseDuration: function ( speed ) {
		// copied from _normalizeArguments function of jQuery UI effects
		return typeof speed === "number"
			? speed
			: speed in $.fx.speeds
				? $.fx.speeds[ speed ]
				: undefined;
	},

	// initialize all autoHide functionality events
	_initAutoHide: function ( settings ) {
		var $elem = this.$elem,
			self = this,
			_cache = this._cache,
			elemWasHidden = $elem.hasClass( self.classes.autoHideHidden );

		// destroy previous bindings
		$elem
			.off(
				   "mouseenter." + this._cache.uep + "autohide"
				+ " mouseleave." + this._cache.uep + "autohide"
				+ " autohide." + this._cache.uep + "start"
				+ " autohide." + this._cache.uep + "restart"
			)
			.removeClass(
				        this.classes.autoHide
				+ " " + this.classes.autoHideHidden
				+ " " + this.classes.autoHideHidding
				+ " " + this.classes.autoHidePending
				+ " " + this.classes.autoHideShowing
			);

		clearTimeout( self._cache.timeouts.autoHide );

		if ( ! this.options.autoHide ) {
			this.$elem.css( this._autoHideStopAndReturnDestination() );
			return;
		}

		$elem.addClass( this.classes.autoHide );

		$elem.on( "autohide." + this._cache.uep + "restart", function () {
			var speed = self.options.durations.autoHideDelay;

			// if invalid value was passed, use the default
			var timeout = self._parseDuration( speed );

			if ( typeof timeout === "undefined" ) {
				timeout = $.fx.speeds._default;
			}

			clearTimeout( self._cache.timeouts.autoHide );

			var restartAutoHide = function () {
				$elem.trigger( "autohide." + self._cache.uep + "restart" );
			};

			var autoHideExecute = function () {
				if ( ! self._openedElements()
					 && ! $elem.hasClass( self.classes.autoHideHidden )
					 && ! $elem.hasClass( self.classes.autoHideHidding )
					 && ! $elem.hasClass( self.classes.autoHideShowing )
					 && ! $elem.hasClass( self.classes.autoHideMouseOver )
					 && ! self._cache.progress.windowButtonsSortable
					 && ! self._cache.progress.taskbarDraggable
					 && ! self._cache.progress.taskbarResizable
					) {
					// if all requirements are met, let's start hiding
					$elem.trigger( "autohide." + self._cache.uep + "start" );
				} else {
					if ( speed === false ) {
						// restart with timeout if it was trigger immediately
						setTimeout( function () {
							restartAutoHide();
						}, self._cnst.autoHideRestartDelay );
					} else {
						// restart immediately if it was trigger
						// in timeouted function
						restartAutoHide();
					}
				}
			};

			if ( speed === false ) {
				autoHideExecute();
			} else {
				// trigger restart handler not earlier than
				// self._cnst.autoHideRestartDelay - otherwise
				// it would be too heavy without real benefit to the user
				self._cache.timeouts.autoHide = setTimeout( function () {
					autoHideExecute();
				}, Math.max( self._cnst.autoHideRestartDelay, timeout ) );
			}

		});

		$elem.on( "autohide." + this._cache.uep + "start", function () {
			self._startHidding();
		});

		var $handle = $elem.find( "." + this.classes.uiResizableHandle );

		$elem.on( "mouseenter." + this._cache.uep + "autohide",
		function ( event ) {
			// jQuery UI Datepicker is triggering mouseover event on one of
			// it's subordinate elements - it bubbled here and caused false
			// positive mouseenter on taskbar; we don't want that
			if ( event.isTrigger && $( event.target )
					.is(
						"." + self.classes.uiDatepickerDaysCellOver + " a"
					)
			) {
				return;
			}

			$elem.addClass( self.classes.autoHideMouseOver );

			// if taskbar show didn't started already, start it now
			if ( $elem.hasClass( self.classes.autoHidePending )
				|| $elem.hasClass( self.classes.autoHideHidding ) ) {
				self._startShowing();
			}
		});

		$elem.on( "mouseleave." + this._cache.uep + "autohide", function () {
			$elem.removeClass( self.classes.autoHideMouseOver );

			if ( ! $elem.hasClass( self.classes.autoHideHidden ) ) {
				$elem.addClass( self.classes.autoHidePending );
			}

			$elem.trigger( "autohide." + self._cache.uep + "restart" );
		});

		$handle.on( "mouseenter." + this._cache.uep + "autohide", function () {
			if ( ! $elem.hasClass( self.classes.autoHideHidden ) ) {
				return true;
			}

			var $windowDragging = $(
				  "." + self.classes.window
				+ "." + self.classes.uiDraggableDragging
			);
			var $windowResizing = $(
				  "." + self.classes.window
				+ "." + self.classes.uiResizableResizing
			);

			// no showing if interaction is in progress
			if ( $windowDragging.length || $windowResizing.length ) {
				return true;
			}

			self._startShowing();
		});

		if ( elemWasHidden ) {
			this._startHidding({
				duration: false
			});
		} else {
			$elem.trigger( "autohide." + this._cache.uep + "restart" );
		}
	},

	_startShowing: function ( options ) {
		if (
			   ! this.$elem.hasClass( this.classes.autoHideHidden )
			&& ! this.$elem.hasClass( this.classes.autoHideHidding )
			&& ! this._openedElements()
		) {
			return;
		}

		if (
			   this.$elem.hasClass( this.classes.draggableDragging )
			|| this.$elem.hasClass( this.classes.resizableResizing )
		) {
			return;
		}

		if ( this.$elem.hasClass( this.classes.autoHideShowing ) ) {
			return;
		}

		if ( ! this.options.autoHide ) {
			return;
		}

		var self = this;

		var ui = this._autoHideUi( false, options );

		if ( this._trigger( "autoHideStart", {}, ui ) === false ) {
			// respect prevention on autoHideStart
			return false;
		}

		this.$elem.removeClass(
			        this.classes.autoHideHidden
			+ " " + this.classes.autoHideHidding
			+ " " + this.classes.autoHidePending
		);

		this.$elem.addClass( this.classes.autoHideShowing );

		var _cache = this._cache,
			props = this._autoHideStopAndReturnDestination();

		// second object for autoHideStop
		var uiStop = this._autoHideUi( false, options );

		var uiProgress = this._autoHideUi( false, {
			quick: options && options.duration === false,
			trigger: options && options.trigger === "api" ? "api" : "user"
		});

		if (
			   ( ! options || options.duration !== false )
			&& this.options.durations.autoHideShow !== false
		) {
			this.$elem.animate( props, {
				duration:  options
					?    this._parseDuration( options.duration )
					  || this.options.durations.autoHideShow
					: this.options.durations.autoHideShow,
				progress: function() {
					self._trigger(
						"autoHideProgress",
						{}, $.extend( true, {}, uiProgress )
					);
				},
				complete: function() {
					self.$elem.removeClass( self.classes.autoHideShowing );

					self._trigger( "autoHideStop", {}, uiStop );

					self.$elem.trigger(
						"autohide." + self._cache.uep + "restart"
					);
				}
			});
		} else {
			// quick show
			this.$elem
				.css( props )
				.removeClass( this.classes.autoHideShowing );

			this._trigger( "autoHideStop", {}, uiStop );

			this.$elem.trigger( "autohide." + this._cache.uep + "restart" );
		}
	},

	_startHidding: function( options ) {
		if (
			   this.$elem.hasClass( this.classes.draggableDragging )
			|| this.$elem.hasClass( this.classes.resizableResizing )
		) {
			return;
		}

		var ui = this._autoHideUi( true, options );

		if ( this._trigger( "autoHideStart", {}, ui ) === false ) {
			return false;
		}

		// second object for autoHideStop
		var uiStop = this._autoHideUi( true, options );

		var uiProgress = this._autoHideUi( true, {
			quick: null,
			trigger: options && options.trigger === "api" ? "api" : "user"
		});

		var self = this,
			_cache = self._cache,
			$elem = self.$elem;

		if (
			   $elem.hasClass( this.classes.autoHideHidding )
			|| $elem.hasClass( this.classes.draggableDragging )
		) {
			return false;
		}

		var props = {};

		$elem.addClass( this.classes.autoHideHidding );
		$elem.removeClass( this.classes.autoHidePending );

		props[
			_cache.horizontal
				? _cache.stickVertical
				: _cache.stickHorizontal ] = _cache.horizontal
					? $elem.outerHeight() * -1
					: $elem.outerWidth() * -1;

		// quick hide should not use stop()
		if (
			   options && options.duration === false
			|| this.options.durations.autoHideHide === false
		) {
			$elem
				.css( props )
				.removeClass( this.classes.autoHideHidding )
				.addClass( this.classes.autoHideHidden );

			this._trigger( "autoHideStop", {}, uiStop );
		} else {
			$elem.stop( true, false ).animate( props, {
				duration: options
					?    this._parseDuration( options.duration )
					  || this.options.durations.autoHideHide
					: this.options.durations.autoHideHide,
				progress: function() {
					self._trigger(
						"autoHideProgress",
						{},
						$.extend( true, {}, uiStop )
					);
				},
				complete: function () {
					$elem
						.removeClass( self.classes.autoHideHidding )
						.addClass( self.classes.autoHideHidden );

					self._trigger( "autoHideStop", {}, uiStop );
				}
			});
		}
	},

	// construct ui object for autoHide events
	_autoHideUi: function ( hide, options ) {
		var ui = {};

		if ( hide ) {
			ui.hide = true;
			ui.show = false;
		} else {
			ui.hide = false;
			ui.show = true;
		}

		ui.$handle = this.$elem
			.find( "." + this.classes.resizable )
			.find( "." + this.classes.uiResizableHandle );

		if ( options && options.quick !== null ) {
			ui.quick = options && options.duration === false;
		}

		ui.triggerApi = !! (
			   options
			&& options.trigger
			&& options.trigger === "api"
		);

		return ui;
	},

	// helper for autoHide
	_autoHideStopAndReturnDestination: function () {
		var css = {};

		css[ this._cache.horizontal
			? this._cache.stickVertical
			: this._cache.stickHorizontal ] = 0;

		this.$elem
			.stop( true, false );

		return css;
	},

	_show: function ( duration ) {
		this._startShowing({
			duration: duration,
			trigger: "api"
		});

		return this;
	},

	_hide: function ( durations ) {
		this._startHidding({
			duration: durations,
			trigger: "api"
		});

		return this;
	},

	// this function will save the state of taskbar subordinates
	// being open
	_openedElements: function ( opened ) {
		// act as getter
		if ( typeof opened === "undefined" ) {
			return this._cache.openedElements;
		}

		this._cache.openedElements = opened;

		if ( opened === false ) {
			this._cache.progress.menuAutoOpenOnBrowse = false;
			this.$elem.trigger( "autohide." + this._cache.uep + "restart" );
		} else {
			this._startShowing({
				duration: false
			});
		}

		this.$elem.toggleClass( this.classes.taskbarWithOpenElements, opened );
	},

	// this function will produce DOM elements wrapped in jQuery objects
	_factory: function ( elem, params ) {
		var self = this,
			// returns empty DIV
			div = function () {
				return $( "<div></div>" );
			};

		var elems = {
			startButton: function () {
				var startSettings = { icons: {} };

				var title = self._i18n( "startButton:" + params.name );

				var $startButton = div()
					.addClass( self.classes.startButton )
					.text(
						   title !== "undefined" ? title :
						   params.name
						|| params.text
					)
					.attr( "data-menu-button-for", params.name )
					.attr( "data-menu-button", "true" )
					.button();

				self._refreshButtonIcon.call( $startButton, self );

				return $startButton;
			},

			separator: function () {
				return div()
					.addClass(
						self.classes.separator + " " +
						self.classes.uiWidgetContent
					);
			},

			widgetContent: function () {
				return div().addClass( self.classes.uiWidgetContent );
			},

			droppableContainer: function () {
				return div()
					.addClass( self.classes.droppableContainer )
					.attr( "data-taskbar-uuid", self.uuid );
			},

			languageSelect: function () {
				return div()
					.addClass(
						self.classes.languageSelect + " " +
						self.classes.taskbarIcon
					)
					.attr( "data-menu-button", "true" );
			},

			languageSelectMenu: function () {
				return $( "<ul></div>" )
					.attr( "data-menu-type", "languageSelect" );
			},

			windowGroupMenu: function () {
				return $( "<ul></ul>" )
					.addClass( self.classes.windowGroupMenu );
			},

			windowGroupElement: function () {
				return $( "<li></li>" )
					.addClass( self.classes.windowGroupElement )
					.prepend(
						$( "<a></a>")
							.attr( "href", "#" )
							// placeholder will be replaced with group name
							.append( "taskbarPlaceholder" )
					);
			},

			droppable: function () {
				return div()
					.addClass( self.classes.droppable )
					.attr( "data-taskbar-uuid", self.uuid );
			}
		};

		// simple elements
		if ( $.inArray( elem, [
				"container",
				"datepicker",
				"draggableHelper",
				"resizable",
				"windowButton",
				"windowCopy",
				"windowsContainment"
			] ) > -1 ) {
			return div().addClass( self.classes [ elem ] );
		}

		// buttons with icons
		if ( $.inArray( elem, [
				"clock",
				"minimizeAll",
				"networkMonitor",
				"toggleFullscreen"
			] ) > -1 ) {
			return div().addClass(
				        self.classes [ elem ]
				+ " " + self.classes.taskbarIcon
			);
		}

		// containers
		if ( $.inArray( elem, [
				"buttonsContainer",
				"startButtonsContainer",
				"systemButtonsContainer",
				"windowButtonsContainer"
			] ) > -1 ) {
			return div().addClass(
				        self.classes [ elem ]
				+ " " + self.classes.taskbarContainter
			).attr( "data-container-name", elem );
		}

		return elems [ elem ] ();
	},

	// binds window to the taskbar
	_bind: function ( $elem ) {
		var $taskbar;

		try {
			$taskbar = $elem.window( "taskbar" );
		} catch ( e ) {
			return false;
		}
		if ( $taskbar[ 0 ] !== this.$elem[ 0 ] ) {
			return false;
		}
		// now we know that window is binded to some taskbar and it's this one,
		// so continue

		var id = $elem[ 0 ].id;

		this._cache.windows[ id ] = $elem;

		var group = $elem.window( "option", "group" );

		var config = {
			$elem: $elem,
			window: id
		};

		if ( group ) {
			if ( ! this._cache.groups[ group ] ) {
				this._cache.groups[ group ] = [];
				this._cache.windowButtons.push( "group:" + group );
			}
			this._cache.groups[ group ].push( id );
			config.group = group;
		} else {
			this._cache.windowButtons.push( "window:" + id );
		}

		this._appendWindowButton( config );

		if ( this._cache.horizontal ) {
			this._refreshWindowButtonsContainer();
		}

		this._setButtonsTooltips();
		this._refreshSeparators();

		var ui = {
			$window: $elem
		};

		this._trigger( "bind", {}, ui );
	},

	// unbinds window from the taskbar
	_unbind: function ( $elem ) {
		this._windowButtonAction({
			$elem  : $elem,
			action : "unbind"
		});

		var ui = {
			$window: $elem
		};

		this._trigger( "unbind", {}, ui );
	},

	// returns button for a window
	_button: function ( $elem ) {
		return this._windowButtonAction({
			$elem  : $elem,
			action : "get"
		});
	},

	_windowButtonAction: function ( options ) {
		var $elem = options.$elem,
		    buttonUnbindHappened = false;

		if ( options.action === "get" && ! ( $elem instanceof $ ) ) {
			return $();
		}

		var id = (
				$elem.hasClass( this.classes.window )
					? $elem.find( "." + this.classes.uiDialogContent )
					: $elem
				)[ 0 ].id,
			b = this._cache.windowButtons,
			g = this._cache.groups,
			self = this,
			i;

		// if window is not in group
		for ( i in b ) {
			if ( b.hasOwnProperty( i ) && b[ i ] === "window:" + id ) {
				var $button = this.$elem
					.find(
						"." + this.classes.windowButton +
						"[data-window-id=" + id + "]"
					);

				if ( options.action === "get" ) {
					// getter
					return $button;
				} else if ( options.action === "unbind" ) {
					// unbind
					self._removeWindowFromCache( id );
					$button.remove();
					b.splice( i, 1 );
					buttonUnbindHappened = true;
					break;
				}
			}
		}

		// if window is in group
		for ( i in g ) {
			if ( g.hasOwnProperty( i ) ) {
				// iterate over windows in group
				for ( var j in g[ i ] ) {
					if ( g[ i ].hasOwnProperty( j ) && g[ i ][ j ] === id ) {
						var $group = this.$elem
						    	.find(
						    		"." + this.classes.windowButton +
						    		"[data-group-name=" + i + "]"
						    	),
						    $menu = this.$elem
						    	.find(
						    		"." + this.classes.uiMenu +
						    		"[data-group-name=" + i + "]"
						    	),
						    $item = $menu
						    	.find( "[data-window-id=" + id + "]" );

						if ( options.action === "get" ) {
							// getter
							return $group;
						} else if ( options.action === "unbind" ) {
							// unbind
							$item.remove();

							// delete from group
							delete g[ i ][ j ];

							// delete from cache
							self._removeWindowFromCache( id );

							var emptyGroup = true;

							$.each( g[ i ], function ( id, elem ) {
								if ( typeof( elem ) === "string" ) {
									emptyGroup = false;
								}
							});

							if ( emptyGroup ) {
								// remove group cause it's now empty
								var needle = "group:" + i;

								for( var k = 0; k < b.length; k++ ) {
									if ( b[ k ] === needle ) {
										b.splice( k, 1 );
										break;
									}
								}

								buttonUnbindHappened = true;

								$menu.menu( "destroy" ).remove();
								$group.remove();
								break;
							} else {
								// refresh menu after $item was removed
								$menu.menu( "refresh" );
								this._groupSetTranslatedTitle.call(
									$group, self
								);
							}

							self._positionTaskbarWindowGroup({
								$group: $group,
								$menu: $menu
							});

							break;
						}
					}
				}
			}
		}

		// button was not found, return empty jQuery object for consistency
		if ( options.action === "get" ) {
			return $();
		}

		// refresh sizes and separators only if real unbind happened,
		// meaning that button disappeared
		if ( buttonUnbindHappened ) {
			this._setWindowButtonsSizes();
			this._refreshSeparators();
		}
	},

	_removeWindowFromCache: function ( id ) {
		delete this._cache.windows[ id ];
	},

	// inserts window button to the container
	_appendWindowButton: function ( config ) {
		var self = this,
		    title,
		    $button,
		    $group;

		// handler for showing window
		var showWindow = function ( event ) {
			event.preventDefault();

			var windowId = $( this ).attr( "data-window-id" ),
			    $window  = $( "#" + windowId );

			self._hideMenus();
			self._hideTooltips();

			$window.window( "show", event );

			self._openedElements( false );
		};

		if ( config.group ) {
			$group = this.$windowButtonsContainer
				.find(
					"." + this.classes.uiButton +
					"[data-group-name=" + config.group + "]"
				);

			var $menu;

			if ( ! $group.length ) {
				$group = this._factory( "windowButton" )
					.uniqueId()
					.appendTo( this.$windowButtonsContainer )
					.attr( "data-group-name", config.group )
					.button();

				this._refreshGroupIcon.call( $group, this );

				if ( ! this._debugMenu() ) {
					return;
				}

				$menu = this._factory( "windowGroupMenu" )
					.attr( "data-group-name", config.group )
					.insertAfter( $group )
					.menu({
						focus: function( event, ui ) {
							$( ui.item ).addClass(
								self.classes.windowGroupElementActive
							);

							self._triggerBindedElementEvent({
								type  : "menuItemFocus",
								item  : $( ui.item ),
								menu  : $menu,
								button: $group,
								event : event
							});
						},
						blur: function( event, ui ) {
							$( this )
								.children( "." + self.classes.uiMenuItem )
								.removeClass(
									self.classes.windowGroupElementActive
								);

							self._triggerBindedElementEvent({
								type  : "menuItemBlur",
								item  : $( ui.item ),
								menu  : $menu,
								button: $group,
								event : event
							});
						}
					})
					.hide();

				this._connectElements( $group, $menu );

				$group.on(
					   "click." + this._cache.uep
					+ " dblclick." + this._cache.uep, function ( event ) {
					var $onlyItem = $menu.find( "." + self.classes.uiMenuItem );


					// if one window is in group, show it instantly,
					// withour showing menu first
					if (
						   $onlyItem.length === 1
						&& ! self._cache.suppressSingleGroupClick
					) {
						self._hideMenus();
						self._hideTooltips();
						$onlyItem.trigger( event.type, event );
						return true;
					}

					if (
						   $onlyItem.length === 1
						&& self._cache.suppressSingleGroupClick
					) {
						return true;
					}

					self._stopOtherTaskbarsAutoOpenOnBrowse();

					if ( event.type === "dblclick" ) {
						return true;
					}

					self._blurWindows();

					self._hideMenus({
						not: $menu
					});
					self._hideTooltips();

					var visible = $menu.is( ":visible" );

					// trigger event and respect prevention
					if ( self._triggerBindedElementEvent({
						type  : visible ? "elementClose" : "elementOpen",
						menu  : $menu,
						button: $group
					}) === false ) {
						return;
					}

					$( this ).addClass( self.classes.uiStateActive );

					$menu.toggle();

					if ( ! visible ) {
						self._positionTaskbarWindowGroup({
							$group: $group,
							$menu: $menu
						});
					} else {
						self._openedElements( false );
					}

					self._setConnectedButtonState.call( this, self );
				});

				this._bindMenuAutoOpen( $group, $menu );

				$group.on(
				   "mouseup."    + this._cache.uep
				+ " mouseenter." + this._cache.uep
				+ " mouseleave." + this._cache.uep, function () {
					self._setConnectedButtonState.call( this, self );
				});
			} else {
				// select menu if the group was already created
				$menu = this.$windowButtonsContainer
					.find(
						"." + this.classes.uiMenu +
						"[data-group-name=" + config.group + "]"
					);
			}

			$button = $group;

			// bind events ti menu item
			var $elem = this._factory( "windowGroupElement" )
				.attr( "data-window-id", config.window )
				.on(
					   "dblclick." + this._cache.uep
					+ " click." + this._cache.uep,
					showWindow
				);

			$elem
				.append(
				$( "<div></div>" )
					.addClass( this.classes.menuWindowClose )
					.text( this._i18n( "close" ) )
					.button({
						text: false,
						icons: {
							primary: this.options.icons.menuWindowClose
						}
					}).on( "click." + this._cache.uep, function ( event ) {
						event.preventDefault();

						var windowId = $( this )
							.closest( "[data-window-id]" )
							.attr( "data-window-id" );

						$( "#" + windowId ).window( "close" );

						self._openedElements( false );
					})
			);

			$elem
				.appendTo ( $menu );

			this._connectElements( config.$elem, $button );
			// +
			$menu.menu( "refresh" );
			// +
			this._refreshWindowButtonIcon.call( $elem, this );

			this._groupSetTranslatedTitle.call( $group, self );
		} else {
			$button = this._factory( "windowButton" )
				.appendTo( this.$windowButtonsContainer );

			title =  config.$elem.window( "option", "title" );

			$button
				.uniqueId()
				.attr( "data-window-id", config.window )
				.on(
					   "click." + this._cache.uep
					+ " dblclick." + this._cache.uep,
					showWindow
				)
				.button();

			this._buttonSetTitle.call( $button, title, this );

			this._connectElements( config.$elem, $button );
			this._refreshwindowButtonsIcons();
		}

		if ( $button !== $group ) {
			$button.on(
				   "mouseup." + this._cache.uep
				+ " mouseleave." + this._cache.uep, function () {
				self._setConnectedButtonState.call( this, self );
			});
		}
	},

	_groupSetTranslatedTitle: function ( self ) {
		var group = $( this ).attr( "data-group-name" ),
		    menuItemsLength = self
		    	.connectedElement( this )
		    	.filter( "." + self.classes.uiMenu )
		    	.children()
		    	.length,
		    groupTranslatedTitle = self._i18n( "group:" + group ),
		    groupTranslatedTitleSet =
		    	groupTranslatedTitle !== self._cnst.missingTranslation,
		    titleBody = groupTranslatedTitleSet
		    	? groupTranslatedTitle
		    	: group,
		    title = menuItemsLength > 1
		    	? self._i18n( "multipleWindowButton", {
		    		counter: menuItemsLength,
		    		title: titleBody
		    	})
		    	: titleBody;

		if ( ! groupTranslatedTitleSet ) {
			self._debugLogAdd(
				  "Missing translation for windows group named \"" + group
				+ "\" in language \"" + self.options.language + "\".", 1, 1
			);
		}

		$( this )
			.attr( "title", title )
			.button( "option", "label", title );
	},

	_buttonSetTitle: function ( title, self ) {
		var $this = $( this );

		$this
			.attr( "title", title );

		if ( $this.hasClass( self.classes.uiButton ) ) {
			$this.button( "option", "label", title );
		}
	},

	// refresh icons of all window groups
	_refreshGroupIcons: function () {
		var self = this;

		this.$elem.find(
			"[data-group-name]." + this.classes.uiButton
		).each( function () {
			self._refreshGroupIcon.call( $( this ), self );
		});
	},

	_refreshGroupIcon: function ( self ) {
		var $this = $( this ),
			group = $this.attr( "data-group-name" );

		// because of "icons.primary", single setter cannot be used
		$this.button( "option", "icons.primary",
			self.options.icons[ "group:" + group ] || null );
		$this.button( "option", "text",
			self.options.windowButtonsIconsOnly ? false : true );
	},

	_refreshButtonIcons: function () {
		var self = this;

		this.$elem.find(
			   "[data-button-name]." + this.classes.uiButton
			+ ",[data-menu-button]." + this.classes.uiButton
		).each( function () {
			self._refreshButtonIcon.call( $( this ), self );
		});
	},

	_refreshButtonIcon: function ( self ) {
		var $this = $( this ),
			button = $this.attr( "data-button-name" ),
			icon = null;

		// buttons with single icon only
		if ( $.inArray( button, self._systemButtonsWithSingleIcons ) > -1 ) {
			icon = self.options.icons[ button ];

		// toggleFullscreen: it's icon depends on fullscreen status
		} else if ( button === "toggleFullscreen" ) {
			icon = self.options.icons[
				"toggleFullscreen" + ( self._fullscreenEnabled() ? "On" : "Off" )
			];

		// networkMonitor: it's icon depends on network connection status
		} else if ( button === "networkMonitor" ) {
			icon = self.options.icons[ self._getNetworkMonitorKey() ];

		// start buttons
		} else if (
			   $this.hasClass( self.classes.startButton )
			&& $this.hasClass( self.classes.uiButton )
		) {
			// icons.startButton has higher priority than icons.startButtonSet
			icon = self.options.icons.startButton
				? self.options.icons.startButton
				: self.options.icons.startButtonSet
					? self.options.icons.startButtonSet + "-" +
						self._translatePosition()
					: null;
		} else {
			// try to get icon from button object passed in "buttons" option, fail silently
			try {
				icon = self.options.buttons[ button ].icons.primary;
			} catch ( e ) {}
		}

		$this.button( "option", "icons.primary", icon || null );
	},

	_refreshwindowButtonsIcons: function () {
		var self = this;

		this.$elem.find(
			"[data-window-id]." + this.classes.uiButton
		).each( function () {
			self._refreshWindowButtonIcon.call( $( this ), self );
		});
	},

	_refreshWindowButtonIcon: function ( self ) {
		var $this  = $( this ),
		    button = $this.attr( "data-window-id" ),
		    group  = $this.attr( "data-group-name" ),
		    icon, title;

		if ( $this.is( "." + self.classes.uiButton ) ) {
			// get icon and title from window
			icon  = $( "#" + button ).window( "option", "icons.main" );
			title = $( "#" + button ).window( "option", "title" );

			if ( ! $this.hasClass( self.classes.uiButton ) ) {
				return;
			}

			// because of "icons.primary", single setter cannot be used
			$this.button( "option", "icons.primary",
				self.options.windowButtonsIconsOnly
					? icon || self.classes.uiIconBlank
					: icon
			);

			$this.button( "option", "text",
				self.options.windowButtonsIconsOnly ? false : true );
		} else if ( $this.is( "." + self.classes.uiMenuItem ) ) {
			var $window = $( "#" + $this.attr( "data-window-id" ) );
			icon        = $window.window( "option", "icons.main" );

			// replace text node with window title
			$this.find( "a" ).contents().filter( function () {
					return this.nodeType == 3;
				})
				.first()[ 0 ].nodeValue
					= $window.window( "title" );

			$this
				.children( "span." + self.classes.uiIcon )
				.remove();

			$this
				.prepend(
					$( "<span></span>" )
						.addClass(
							        self.classes.uiIcon
							+ " " + ( icon ? icon : self.classes.uiIconBlank )
					)
				);
		}
	},

	_setwindowButtonsIconsOnlyClass: function () {
		this.$elem.toggleClass(
			this.classes.windowButtonsIconsOnly,
			this.options.windowButtonsIconsOnly
		);
	},

	// create custom styles for various subordinates
	_createStyles: function ( settings ) {
		var destroy = settings && settings.destroy;

		// select the old styles
		var $oldStyles = $(
			  "style[type=\"text\/css\"]"
			+ "[data-taskbar-uuid=\"" + this.uuid + "\"]"
		);

		if ( ! destroy ) {
			// create new element
			var $styles = $( "<style></style>" )
				.attr( "type", "text/css" )
				.attr( "data-taskbar-uuid", this.uuid )
				.appendTo( "body" );

			// get background-image for icons in default state
			var bgUrl = this._styleIndicator(
			    	     "." + this.classes.uiStateDefault
			    	+ " > ." + this.classes.uiIcon, "backgroundImage"
			    ).backgroundImage,
			    bg = "{background-image:" + bgUrl + ";}",
			    // because of html structure not anticipated by jQuery UI,
			    // we have to force some buttons to have default classes,
			    // because ther were inheriting active class from window on top
			    windowButtons =
			    	       "." + this.classes.window
			    	+        "[data-taskbar-uuid=\"" + this.uuid + "\"]"
			    	+     " ." + this.classes.uiDialogTitlebar
			    	+      "." + this.classes.uiStateActive
			    	+ ":not(." + this.classes.uiStateDefault + ")"
			    	+     " ." + this.classes.uiButton
			    	+     " ." + this.classes.uiButtonIconPrimary
			    	+ bg,
			    menuWindowClose = "";

			// jQuery UI since version 1.11 would also need
			// default styles for button in menus
			if (
				$.ui.menu
				&& parseFloat( $.ui.menu.prototype.version ) >= 1.11
			) {
				menuWindowClose =
					    "." + this.classes.taskbar
					+     "[data-taskbar-uuid=\"" + this.uuid + "\"]"
					+  " ." + this.classes.windowGroupElement
					+  " ." + this.classes.uiButtonIconPrimary + ":not(:hover)"
					+ bg;
			}

			var iframes = "";

			var self = this;

			var computed = window.getComputedStyle( $( "body" )[ 0 ] );

			var pf = parseFloat;

			var bodyMargins = {
				horizontal: Math.floor(
					  pf( computed.marginLeft )
					+ pf( computed.marginRight )
				),
				vertical: Math.floor(
					  pf( computed.marginTop )
					+ pf( computed.marginBottom )
				),
			};

			// create styles for iframes, and account for body margins
			$.each( [ true, false ], function ( index, horizontal ) {
				iframes += "." + self.classes[
					"resizeIframe" + ( horizontal ? "Horizontal" : "Vertical" )
				] + "{";

				$.each( [ "-webkit-", "-moz-", "" ], function ( index2, prefix ) {
					iframes += ( horizontal ? "width:" : "height:" )
						+ prefix
						+ "calc(100% - "
						+ ( horizontal
							? bodyMargins.horizontal
							: bodyMargins.vertical
						) + "px);";
				});

				iframes += "}";
			});

			// apply new styles
			$styles.text( windowButtons + menuWindowClose + iframes );
		}

		// only now we can destroy old styles after new styles
		// are present in the DOM, otherwise some ugly blinks can occur
		$oldStyles.remove();
	},

	// shortcut for positioning window groups
	_positionTaskbarWindowGroup: function ( options ) {
		var position = this._menuPosition({
			of: options.$group,
			elem: options.$menu
		});

		options.$menu
			.position ( position );
	},

	// create window containment and window copy - those are single dom objects,
	// shared by all taskbars - they're created by the first taskbar widget
	// initialized, and removed by the last taskbar widget destroyed
	_createWindowsContainment: function () {
		this.$windowsContainment = $( "div." + this.classes.windowsContainment );
		this.$windowCopy = $( "div." + this.classes.windowCopy );

		// create window containment if it wasn't found
		if ( ! this.$windowsContainment.length ) {
			this.$windowsContainment = this
				._factory( "windowsContainment" )
				.appendTo( "body" );
		}

		// create window copy if it wasn't found
		if ( ! this.$windowCopy.length ) {
			this.$windowCopy = this
				._factory( "windowCopy" )
				.appendTo( "body" );
		}

		// keep count of taskbar instances
		var count = this.$windowsContainment.data(
			this._cnst.dataPrefix + "taskbars"
		) || 0;

		this.$windowsContainment.data(
			this._cnst.dataPrefix + "taskbars",
			++count
		);
	},

	_destroyWindowsContainment: function () {
		var count = this.$windowsContainment.data(
			this._cnst.dataPrefix + "taskbars"
		);

		// decrease number if taskbar instances by 1
		this.$windowsContainment.data(
			this._cnst.dataPrefix + "taskbars", --count
		);

		// destroy containment and window copy if there's no taskbar left
		if ( count === 0 ) {
			this.$windowsContainment.remove();
			this.$windowCopy.remove();
		}
	},

	// return list of taskbars on each edge
	_getTaskbarList: function () {
		return {
			top    : $(
				       "." + this.classes.taskbarHorizontal
				     + "." + this.classes.taskbarStickTop
				+ ":not(." + this.classes.droppable + ")"
			),
			left   : $(
				       "." + this.classes.taskbarVertical
				     + "." + this.classes.taskbarStickLeft
				+ ":not(." + this.classes.droppable + ")"
			),
			right  : $(
				       "." + this.classes.taskbarVertical
				     + "." + this.classes.taskbarStickRight
				+ ":not(." + this.classes.droppable + ")"
			),
			bottom : $(
				       "." + this.classes.taskbarHorizontal
				     + "." + this.classes.taskbarStickBottom
				+ ":not(." + this.classes.droppable + ")"
			)
		};
	},

	// calculates containment applied later to all windows;
	// containment is shared along all taskbar instances
	// because windows shouldn't overlay any taskbar that is visible to user
	_resizeWindowsContainment: function () {
		// inner window dimensions
		var windowsContainment = this._getContainmentInner();

		var margins = this._getMaxTaskbarsMargins();

		windowsContainment.top = margins.top;
		windowsContainment.left = margins.left;

		// height and width has to be lowered by the sum of margins
		// from particular axis
		windowsContainment.width  -= margins.x;
		windowsContainment.height -= margins.y;

		// cache the margins, they'll be used by other functions
		this.$windowsContainment
			.css( windowsContainment )
			.data( this._cnst.dataPrefix + "taskbar-margins", margins );

		this.$windowCopy.css( this._getContainmentInner() );
	},

	_getMaxTaskbarsMargins: function () {
		var self = this,

		    // list of all taskbar
		    $taskbarList = this._getTaskbarList(),

		    // object of empty zero's for every edge
		    taskbarsMargins = this._zeroDirections(),
		    viewportMargins = $.extend( true, {},
		    	this.options.viewportMargins
		    ),
		    margins = {};

		// itterate over taskbars sticking to every edge of window
		$.each ( $taskbarList, function ( edge, $taskbars ) {
			var dimensions = [];

			// ignore autohiding taskbars
			//- they overlay windows when they are visible
			$taskbars = $taskbars.not( "." + self.classes.autoHide );

			$taskbars.each( function () {
				var horizontal = $.inArray( edge, [ "top", "bottom" ] ) > -1,
				    $this = $( this );

				// push dimensions to array, either height of horizontal
				// taskbars or width of vertical taskbars
				dimensions.push(
					horizontal ? $this.outerHeight() : $this.outerWidth()
				);
			});

			// if there's anything, exchange previous zero value of current edge
			// for the highest value of all taskbars
			if ( dimensions.length ) {
				taskbarsMargins[ edge ] = Math.max.apply( null, dimensions );
			}
		});

		margins = this._viewportMarginsRecalculate(
			viewportMargins, taskbarsMargins
		);

		return margins;
	},

	_viewportMarginsRecalculate: function ( viewportMargins, taskbarsMargins ) {
		var margins = {},
		   useTaskbarsViewportMargins;

		$.each( viewportMargins, function ( edge, config ) {
			// decide weather we should use options or rely on calculations
			useTaskbarsViewportMargins =
				   config[ 1 ] === "correct"
				&& taskbarsMargins[ edge ] !== 0
				||
				   taskbarsMargins[ edge ] < config[ 0 ]
				&& taskbarsMargins[ edge ] !== 0
				&& config[ 1 ] === "correctDown"
				||
				   taskbarsMargins[ edge ] > config[ 0 ]
				&& config[ 1 ] === "correctUp";

			useTaskbarsViewportMargins =
				   useTaskbarsViewportMargins
				&& config[ 1 ] !== "correctNone";

			// apply margins
			margins[ edge ] = useTaskbarsViewportMargins
				? taskbarsMargins[ edge ]
				: config[ 0 ];
		});

		margins.y = margins.top  + margins.bottom;
		margins.x = margins.left + margins.right;

		return margins;
	},

	_trigger: function ( name, event, ui ) {
		// extend ui by useful information
		$.extend ( ui, {
			instance: this,
			$taskbar: this.$elem
		});

		return this._super( name, event, ui );
	},

	// triggers internal callback and set's it to null, because,
	// as for now, only callbacks triggered once are needed
	_triggerInternal: function ( name ) {
		if ( typeof this._cache.internalCallbacks[ name ] === "function" ) {
			this._cache.internalCallbacks[ name ]();
			this._cache.internalCallbacks[ name ] = null;
		}
	},

	// bind internal event to be triggered later,
	// for example during refresh
	_bindInternal: function ( name, fn ) {
		this._cache.internalCallbacks[ name ] = fn;
	},

	// trigger events for subordinates
	_triggerBindedElementEvent: function ( options ) {
		var ui = {};

		ui.autoOpen = this._cache.progress.menuAutoOpenOnBrowse;

		if (
			   options.type === "elementOpen"
			|| options.type === "elementClose"
		) {
			ui.$element    = options.menu;
			ui.$button     = options.button;

			if ( options.type === "elementClose" ) {
				ui.closeByOpen = !! options.closeByOpen;
			}
		}

		if (
			   options.type === "menuItemFocus"
			|| options.type === "menuItemBlur"
		) {
			// ui.$item is an empty jQuery object
			// if options.type === "menuItemBlur"
			ui.$item   = options.item;
			ui.$button = options.button;
			ui.$menu   = options.menu;
		}

		// this little trick allow us to have blured menu item in ui object,
		// the item that jQuery UI Menu does not provide for some reason
		if ( options.type === "menuItemFocus" ) {
			this._cache.lastMenuItemFocus = ui.$item;
		}

		if ( options.type === "menuItemBlur" ) {
			ui.$item = this._cache.lastMenuItemFocus;
		}

		return this._trigger( options.type, options.event, ui );
	},

	_refreshWindowsPosition: function ( options ) {
		var $windows = options && options.own
			// refresh position of windows binded only to current taskbar
			? this.windows()
			// refresh position of all windows binded to all taskbars present
			: $( "." + this.classes.window + " ." + this.classes.windowContent );

		// that's not really a likely case that $.simone.window don't exists
		// at this point, but some tests would fail without this fix
		// - the one that set $.simone.window to null for a short period of time
		// to test debug messages
		if ( ! $.simone.window ) {
			return;
		}

		var prototype = $.simone.window.prototype;

		// use window prototype to sort by z-index
		$windows = prototype._sortByZIndex.call({
			_cnst: {
				lowestPossibleZIndex: prototype._cnst.lowestPossibleZIndex
			}
		}, $windows.parent(), "asc" ).children( "." + this.classes.windowContent );

		var windowOptions = {};

		// some optimization to not to trigger refreshPosition
		// when it's not really needed - that's just a suggestion
		// that will be decided by each window instance separatelly
		if ( options && options.skipFitting ) {
			windowOptions.skipOnFit = true;
		}

		$windows.each( function () {
			$( this ).window( "refreshPosition", windowOptions );
		});
	},

	// refresh data-taskbar-uuid when uuid changed
	_refreshWindowsTaskbarId: function () {
		var self = this;

		this.windows().each( function () {
			var $this = $( this );

			var instance = $this.data( self._cnst.dataPrefix + "window" );

			$this
				// overlay could be null, but it doesn't hurt
				.add( instance.overlay )
				.attr( "data-taskbar-uuid", this.uuid );
		});
	},

	// refresh position of window binded to current taskbar
	_refreshOwnWindowsPosition: function ( options ) {
		if ( ! options ) {
			options = {};
		}

		this._refreshWindowsPosition($.extend({
			own: true
		}, options ));
	},

	// refresh containment of windows binded to current taskbar
	_refreshWindowsContainment: function ( options ) {
		var self = this;
		$.each( this._cache.windows, function ( index, $elem ) {
			var instance = $elem.data( self._cnst.dataPrefix + "window" );

			if ( instance ) {
				instance._setContainment();

				if ( ! options || options.refreshPosition !== false ) {
					instance.refreshPosition();
				}
			}
		});
	},

	// translates current taskbar position to the direction in which start menu
	// arrow should point, that is, to the center of the screen
	_translatePosition: function ( options ) {
		var position = this._cache.horizontal
					? this._cache.stickVertical === "top" ? "s" : "n"
					: this._cache.stickHorizontal === "left" ? "e" : "w";

		return position;
	},

	// helper function
	_zeroDirections: function () {
		return {
			top   : 0,
			left  : 0,
			right : 0,
			bottom: 0
		};
	},

	// array of edges and their neighbours
	_neighbouringEdges: function () {
		return {
			top    : [ "left", "right" ],
			right  : [ "top", "bottom" ],
			bottom : [ "right", "left" ],
			left   : [ "bottom", "top" ]
		};
	},

	// function for calculating Levenshtein distance, used for
	// suggesting correct option and event and unknown options and events
	// are passed, with some code removed, and also reformatted
	// source: http://phpjs.org/functions/levenshtein/
	// license: https://github.com/kvz/phpjs/blob/master/LICENSE.txt
	_levenshtein: function( s1, s2 ) {
		if ( s1 == s2 ) {
			return 0;
		}

		var l1 = s1.length;
		var l2 = s2.length;

		if ( l1 === 0 ) {
			return l2 * 1;
		}
		if ( l2 === 0 ) {
			return l1 * 1;
		}

		s1 = s1.split( "" );
		s2 = s2.split( "" );


		var p1 = new Array( l2 + 1 );
		var p2 = new Array( l2 + 1 );

		var i1, i2, c0, c1, c2, tmp;

		for ( i2 = 0; i2 <= l2; i2++ ) {
			p1[ i2 ] = i2 * 1;
		}

		for ( i1 = 0; i1 < l1 ; i1++ ) {
			p2[ 0 ] = p1[ 0 ] + 1;

			for ( i2 = 0; i2 < l2; i2++ ) {
				c0 = p1[ i2 ] + ( ( s1[ i1 ] == s2[ i2 ] ) ? 0 : 1 );
				c1 = p1[ i2 + 1 ] + 1;

				if ( c1 < c0 ) {
					c0 = c1;
				}

				c2 = p2[ i2 ] + 1;

				if ( c2 < c0 ) {
					c0 = c2;
				}

				p2[ i2 + 1 ] = c0;
			}

			tmp = p1;
			p1 = p2;
			p2 = tmp;
		}

		c0 = p1[ l2 ];

		return c0;
	},

	// test if particular widget from jQuery UI is in given version;
	// used in deciding behaviour/hacks/flow
	_versionOf: function ( widget, operator, compare ) {
		var version   = ( widget ? $.ui[ widget ] : $.ui ).version.split( "." ),
		    compareTo = compare.split( "." ),
		    results   = [];

		$.each( compareTo, function ( index, part ) {
			var againsts = parseInt( part, 10 ),
			    current  = parseInt( version[ index ], 10 );

			if ( operator === ">=" ) {
				results.push ( current >= againsts );
			} else if ( operator === "==" || operator === "===" ) {
				results.push( current === againsts );
			} else if ( operator === "<=" ) {
				results.push( current <= againsts );
			} else {
				results.push( false );
			}
		});

		return $.inArray( false, results ) === -1;
	},

	// return staskbar instance for a given item
	_taskbarInstance: function( $item ) {
		var $taskbar = $item.closest( "." + this.classes.taskbar );
		return $taskbar.data( this._cnst.dataPrefix + "taskbar" );
	},

	// extends native jQuery position/offset object
	// by width, height, right and bottom
	_extendedPosition: function ( options ) {
		if ( ! this ) {
			return {};
		}

		var $this = $( this );

		if ( ! $this.length ) {
			return {};
		}

		// use offset or position, depending on setting
		var position = options && ( options.offset || options === "offset" )
			? $this.offset()
			: $this.position();

		position.height = $this.outerHeight();
		position.width  = $this.outerWidth();

		// bottom and right are simply the other edges of element
		position.bottom = position.height + position.top;
		position.right  = position.width  + position.left;

		return position;
	},

	// http://www.2ality.com/2013/10/typeof-null.html
	_isRealObject: function( obj ) {
		return typeof obj === "object" && obj !== null;
	},

	_isRealEmptyObject: function( obj ) {
		return ( $.isEmptyObject( obj ) || ( obj.length === 1 && obj.__proto__ ) )
			&& this._isRealObject( obj );
	},

	// an idea borrowed from
	// http://davidwalsh.name/device-state-detection-css-media-queries-javascript
	// this function will take selector (not every possible one,
	// just simple elem.parent-class > elem2.child-class etc.) and create
	// element that will match that selector, after which a computed style
	// of that element can be accessed; this is useful for getting colors
	// and other properties from elements that are part of jQuery UI themes,
	// but are not present in the DOM
	_styleIndicator: function ( className, keys ) {
		className = className.split( " > " );

		var elems = [],
			requestedStyles = {},
			subject, parent, thisIsSubject, subjectSet;

		$.each( className, function ( index, value ) {
			// the default tag is div, but it can later be changed
			var tagName = "div";

			var dollarAt =  value.indexOf( "$" );

			// is element start with a dollar, that's the element
			// we want to process, threat this as selector subject similiar
			// to what's proposed in CSS4 specification
			// at http://www.w3.org/TR/2011/WD-selectors4-20110929/#subject
			if ( dollarAt === 0 ) {
				thisIsSubject = true;
				value = value.substr( 1 );
			}

			// a classname without preceding dot is also acceptable,
			// when no tag name is required
			var dotAt = value.indexOf( "." );
			if ( dotAt !== -1 ) {
				// if tag was present before the dot, set it,
				// otherwise stick to the default "div" tag
				tagName = value.substr( 0, dotAt ) || tagName;
				value = value.substr( dotAt + 1 );
			}

			// create element with the class name and tag name
			var elem = document.createElement( tagName );
			elem.className = value;
			elems[ index ] = elem;

			// first element is inserted into body
			if (index === 0) {
				// parent is the element that later will be removed from DOM
				parent = elem;
				document.body.appendChild( elem );
			// any element after the first one is inserted into it's parent,
			// created in the previous loop
			} else {
				elems [ index - 1 ].appendChild( elem );
			}

			// if that's the end of the loop, the current element
			// is the one we'll look into; alternativealy,
			// if currently parsed selector part contained a dollar sign,
			// current itteration contains selector subject
			if (
				   ! subjectSet
				&& ( thisIsSubject || index === className.length - 1 )
			) {
				subject = elem;
				subjectSet = true;
			}
		});

		// get computed styles
		var computedStyles = window.getComputedStyle( subject );

		// shortcut
		if ( keys === "borderColor" ) {
			keys = [ "borderTopColor", "borderRightColor",
				"borderBottomColor", "borderLeftColor" ];
		}

		// make sure it's an array
		if ( typeof( keys ) === "string" ) keys = [ keys ];

		// return only particular properties
		for ( var i in keys ) {
			requestedStyles [ keys [ i ] ] = computedStyles [ keys [ i ] ];
		}

		if ( typeof( keys ) === "undefined" ) {
			requestedStyles = computedStyles;
		}

		// cleanup
		document.body.removeChild( parent );

		return requestedStyles;
	},

	_extractObjectsByKey: function ( object, keys ) {
		var newObject = {};

		$.each( keys, function ( index, value ) {
			if ( object[ value ] ) {
				newObject[ value ] = object[ value ];
			}
		});

		return newObject;
	},

	// functions for fullscreen API,
	// taken almost witouth changes from http://davidwalsh.name/fullscreen
	// detect if the fullscreen is available in user browser
	_fullscreenAvailable: function () {
		var elem = document.documentElement;

		return !! (
			   elem.requestFullscreen
			|| elem.mozRequestFullScreen
			|| elem.webkitRequestFullscreen
			|| elem.msRequestFullscreen
		);
	},

	// detect if the browser is in fullscreen mode now;
	// this function will never fire if fullscreen is not available
	_fullscreenEnabled: function () {
		var fullscreenElement =
		       document.fullscreenEnabled
		    || document.mozFullScreenElement
		    || document.webkitFullscreenElement
		    || document.msFullscreenElement;

		return !! fullscreenElement;
	},

	// request fullscreen
	_fullscreenEnter: function () {
		var elem = document.documentElement;

		if ( elem.requestFullscreen ) {
			elem.requestFullscreen();
		} else if ( elem.mozRequestFullScreen ) {
			elem.mozRequestFullScreen();
		} else if ( elem.webkitRequestFullscreen ) {
			elem.webkitRequestFullscreen();
		} else if ( elem.msRequestFullscreen ) {
			elem.msRequestFullscreen();
		}
	},

	// exits fullscreen
	_fullscreenLeave: function () {
		if ( document.exitFullscreen ) {
			document.exitFullscreen();
		} else if ( document.mozExitFullScreen ) {
			document.mozExitFullScreen();
		} else if( document.webkitExitFullscreen ) {
			document.webkitExitFullscreen();
		} else if( document.msExitFullscreen ) {
			document.msExitFullscreen();
		}
	},

	_resizeEvent: function( force ) {
		var self = this;

		// clearing timeout prevents multiple events resizes called
		// - we need only one
		clearTimeout( this._cache.timeouts.windowResize );
		// settings timeout prevents double resizes and boosts performance
		this._cache.timeouts.windowResize = setTimeout( function() {
			self._resizeEventDelayed( force );
		}, this._cnst.resizeDelay );
	},

	_resizeEventDelayed: function ( force ) {
		var self = this;
		var c = this._cache.resizeContainment;
		var cc = this._getContainment();
		// fire resizeEvent if the window dimensions changed after last time
		if (
			( c && ( c.width !== cc.width || c.height !== cc.height ) )
			|| force === true
		) {
			self._cache.resizeContainment = cc;
			self._cache.resizeCausesRefresh = true;
			$( window ).trigger( "resize", {
				// pass and argument so only window resize events triggered here
				// are passed to namespaced window resize event
				// for current taskbar (see: _bindWindowsEvents)
				caller: "taskbar-iframe"
			});
			self._cache.resizeCausesRefresh = false;
		}
	},

	// an idea borrowed from https://gist.github.com/OrganicPanda/8222636
	// and rewritten for jQuery
	_resizeIframeListener: function() {
		if ( $( "." + this.classes.resizeIframeHorizontal ).length ) {
			return;
		}

		var self = this;

		self._cache.resizeContainment = self._getContainment();

		$.each( [ true, false ], function ( index, horizontal ) {
			// Create an invisible iframes
			var $iframe = $( "<iframe></iframe>" )
				.prependTo( "body" )
				.addClass( self.classes.resizeIframe
					+ " " + self.classes[
						"resizeIframe" + ( horizontal
							? "Horizontal"
							: "Vertical" )
					]
				);

			$iframe[ 0 ]
				// original comment from
				// https://gist.github.com/OrganicPanda/8222636
				// "The trick here is that because this iframe has 100% width
				// it should fire a window resize event when anything causes it
				// to resize (even scrollbars on the outer document)"
				.contentWindow
				.addEventListener( "resize", function () {
					self._resizeEvent();
				});

				// Trident won't fire iframe resize event first time,
				// so it has to be fired manually
				if ( window.navigator.userAgent.match(/Trident/) ) {
					self._bindInternal( "afterRefresh", function () {
						// with true parameter the event is forced to fire,
						// otherwise it would fire only
						// if inner window size really changed
						self._resizeEvent( true );
					});
				}
		});
	},

	// https://gist.github.com/stucox/5231211
	// returns MutationObserver or false if not MutationObserver
	// is available in the browser
	_MutationObserver: function () {
		var prefixes = [ "", "WebKit", "Moz", "O", "Ms" ];
		for ( var i = 0; i < prefixes.length; i++ ) {
			if ( prefixes[ i ] + "MutationObserver" in window ) {
				return window[ prefixes[ i ] + "MutationObserver" ];
			}
		}

		return false;
	},

	// MutationObserver is potentially a performance issue,
	// so it's better to disconnect them once they job is done
	_disconnectObservers: function ( keyy ) {
		for ( var i in this._cache.mutationObservers [ keyy ] ) {
			this._cache.mutationObservers [ keyy ][ i ].disconnect();
		}

		this._cache.mutationObservers [ keyy ] = [];
	},

	_getWindowScroll: function () {
		return {
			x: $( window ).scrollLeft(),
			y: $( window ).scrollTop()
		};
	},

	// copies css from one element into another;
	// if no source element is present,  properties are nullified
	_copyStyles: function ( options ) {
		var string = typeof options.from === "string";

		// make single property into an array
		if ( typeof options.properties === "string" ) {
			options.properties = [ options.properties ];
		}

		// if it's selector, create elements that matches it,
		// then retrieve properties we're interested in
		if ( string ) {
			var props = this._styleIndicator(
				options.from, options.properties
			);
		}

		$.each( options.properties, function ( index, value ) {
			// copy from created element
			if ( string ) {
				options.to.css( value, props [ value ] );
			// or copy from passed element
			} else if ( options.from ) {
				options.to.css( value, options.from.css( value ) );
			// or nullify if no element was passed as source
			} else {
				options.to.css( value, "" );
			}
		});
	},

	// destroy menus matching the selector
	_destroyMenus: function ( selector ) {
		var self = this;

		this.$elem.find( selector ).each( function () {
			var $this = $( this );

			if ( $this.hasClass( self.classes.uiMenu ) ) {
				$this.menu( "destroy" );
			}

			// nulify styles set previously
			self._copyStyles({
				to        : $this,
				properties: [ "display", "top", "left" ]
			});
		});
	},

	/* public methods */
	// blurs windows binded to this taskbar
	blurWindows: function () {
		this._blurWindows();
	},

	// return button for a passed element
	button: function ( $elem ) {
		return this._button( $elem );
	},

	// hide taskbar with "autoHide": true,
	// with optional duration
	hide: function ( duration ) {
		this._hide( duration );
	},

	hideSubordinates: function () {
		this._hideAll({
			blurWindows: false
		});
	},

	i18n: function ( translation, keys, language ) {
		return this._i18n( translation, keys, language );
	},

	minimizeAll: function () {
		this._minimizeAll();
	},

	// public method that refreshes taskbar
	refresh: function () {
		if ( this._cache.suppressEvents === false ) {
			if ( this._trigger( "beforeRefresh" ) === false ) {
				return;
			}
		}

		this.hideSubordinates();
		this._initialize();

		// this event is called once on creation, only on IE,
		// and only when window internal size changes
		this._triggerInternal( "afterRefresh" );

		if ( this._cache.suppressEvents === false ) {
			this._trigger( "refresh" );
		}
	},

	// show taskbar with "autoHide": true,
	// with optional duration
	show: function ( duration ) {
		this._show( duration );
	},

	// public method returning windows as jQuery collection
	windows: function () {
		return this._windows();
	},

	// return elem taskbar was build upon
	widget: function () {
		return this.$elem;
	},

	// generate debug: there's no enable/disable methods for now,
	// and there might never be, as it would probably make no sense;
	// this method is implemented for compability with jQuery UI widgets API
	enable: function () {
		this._debugLogAdd( "Method \"enable\" is not implemented.", 1, 2 );
	},

	// generate debug: there's no enable/disable methods for now,
	// and there might never be, as it would probably make no sense;
	// this method is implemented for compability with jQuery UI widgets API
	disable: function () {
		this._debugLogAdd( "Method \"disabled\" is not implemented.", 1, 2 );
	},

	// checks for invalid options and events
	_checkForInvalidOptions: function ( options, key, initialization ) {
		// use options prototype if set; undefined -use taskbar prototype
		var proto = typeof options === "object"
			? options
			: $.simone.taskbar.prototype.options;

		var protoKeys = Object.keys( proto );

		if ( typeof key === "string" && $.inArray( protoKeys, key ) > -1 ) {
			return;
		}

		var keyKeys;

		// either validate single option name or object of options
		if ( typeof key === "object" ) {
			keyKeys = Object.keys( key );
		} else {
			keyKeys = [ key ];
		}

		var protoKeysCompare = [];

		// compare lower-cased strings,
		// so things like debuglogadd instead of debugLogAdd,
		// don't generate errors
		$.each( protoKeys, function ( index, protoKey ) {
			protoKeysCompare[ index ] = protoKey.toLowerCase();
		});

		// check for invalid options
		var diff = keyKeys.filter( function( i ) {
			return protoKeysCompare.indexOf( i.toLowerCase() ) === -1;
		});

		// empty diff means there are not invalid options
		if ( ! diff.length ) {
			return;
		}

		var levenshteins = [];
		var invalidNames = [];
		var self = this;

		// for every option/event name that wasn't recognized,
		// calculate Levenshtein distance and prepend it to the list
		$.each( diff, function ( index, elem ) {
			levenshteins[ index ] = {};

			$.each( protoKeys, function ( index2, elem2 ) {
				levenshteins[ index ][ elem2 ] = self
					._levenshtein( elem2, elem );
				invalidNames[ index ] = elem;
			});
		});

		var min = 100;

		// itterate over calculated distances to find best matches
		$.each( levenshteins, function ( index, set ) {
			var matches = [],
			    bestMatches;

			//
			$.each( set, function ( index2, elem2 ) {
				var withPadding = "\"" + index2 + "\"";

				// if previous matches were not as good as current,
				// delete them and start fresh with current match
				if ( elem2 < min ) {
					min = elem2;
					matches = [ withPadding ];
				}

				// if current match is as good as matches we already have,
				// prepend it to the list of best matches
				if (
					   elem2 === min
					&& $.inArray( withPadding, matches ) === -1
				) {
					matches.push( withPadding );
				}
			});

			if ( matches.length ) {
				// build list of matches
				if ( matches.length > 1 ) {
					var last = matches.pop();
					bestMatches = matches.join( ", " );
					bestMatches += ", or " + last;
				} else {
				// take single best match
					bestMatches = matches[ 0 ];
				}
			}

			// generate debug with info if it was set on widget initialization
			// or later, and optionally, with findings of Levenshtein distance
			// calculation
			self._debugLogAdd(
				"Unkown option or event \"" + invalidNames[ index ] + "\""
				+ ( initialization ? " set on initialization." : "." )
				+ (
					matches.length
						? " Did you mean " + bestMatches + "?"
						: ""
				), 1, 2
			);
		});
	},

	// cache previous option value
	_beforeSetOption: function ( key ) {
		this._cache.optionSetter.previousValue = this.options [ key ];
	},

	_afterSetOption: function ( key, value ) {
		var previousValue = this._cache.optionSetter.previousValue,
		    ui = {};

		// trigger language change if language really changed
		if ( key === "language" && value !== previousValue ) {
			ui.originalLanguage = previousValue;
			ui.language         = value;

			this._trigger( "languageChange", {}, ui );
		}
	},

	_setOption: function ( key, value ) {
		var self = this;

		this._checkForInvalidOptions( undefined, key );
		this._beforeSetOption( key );

		this._superApply( arguments );

		// debug options and try to fix some of them before applying
		this._debugOptions();

		if (
			   key === "draggable"
			|| key === "draggableBetweenEdges"
			|| key === "dropOnExisting" ) {
			this._setDraggable();
			this._setDroppable();

		} else if ( key === "windowButtonsSortable" ) {
			this._setSortableWindowButtons();

		} else if (
			// refresh everything: there's no easy way to determine what
			// has been affected by new localization, language,
			// fallback language or by changing available languages list
			   key === "language"
			|| key === "fallbackLanguage"
			|| key === "languages"
			|| key === "localization" ) {
			this._debugLocalization();
			this._languageChange();
			this._refresh();

		} else if ( key === "icons" ) {
			// there's no easy way to determine which icons has changed,
			// so the need to refresh everything
			this._refreshGroupIcons();
			this._refreshButtonIcons();
			this._setClockWidth();

		} else if ( key === "windowButtonsIconsOnly" ) {
			this._setwindowButtonsIconsOnlyClass();
			this._refreshGroupIcons();
			this._refreshwindowButtonsIcons();

		} else if ( key === "buttonsTooltips" ) {
			this._setButtonsTooltips();

		} else if ( key === "windowsContainment" ) {
			this._refreshWindowsContainment();
			this._refreshOwnWindowsPosition();

		} else if (
			// those options potentially change everything on the page,
			// so full refresh is probably required;
			// although there sure is a potential for optimization
			   key === "orientation"
			|| key === "horizontalWidth"
			|| key === "horizontalStick"
			|| key === "horizontalRows"
			|| key === "horizontalRowHeight"
			|| key === "horizontalRowsMin"
			|| key === "horizontalRowsMax"
			|| key === "verticalHeight"
			|| key === "verticalStick"
			|| key === "verticalColumns"
			|| key === "verticalColumnWidth"
			|| key === "verticalColumnsMin"
			|| key === "verticalColumnsMax"
			|| key === "viewportMargins" ) {
			this._refresh();

		} else if ( key === "windowsInitialZIndex" ) {
			this._refreshWindowsPosition();

		} else if (
			   key === "languageSelect"
			|| key === "minimizeAll"
			|| key === "toggleFullscreen"
			|| key === "clock"
			|| key === "networkMonitor"
			|| key === "clockShowDatepicker"
			|| key === "systemButtonsOrder" ) {
			this._buildSystemButtons();

		} else if ( key === "menuAutoOpenOnBrowse" ) {
			this._bindMenusAutoOpen();

		} else if ( key === "minimizeAllHoverOpaqueWindows" ) {
			this._setMinimizeAllHoverOpaqueWindows();

		} else if ( key === "buttons" ) {
			this._refresh();
			this._refreshButtonIcons();
			this._refreshWindowButtonsContainer();

		} else if ( key === "buttonsOrder" ) {
			this._rebuildTaskbarButtons();
			this._refreshWindowButtonsContainer();

		} else if ( key === "startButtons" ) {
			this._rebuildTaskbarStartButtons();
			this._refreshWindowButtonsContainer();

		} else if (
			   key === "resizable"
			|| key === "resizableHandleOverflow"
		) {
			this._setResizable();

		} else if ( key === "resolveCollisions" ) {
			this._refresh();

		} else if ( key === "autoHide" ) {
			this._refresh();

		} else if ( key === "durations" ) {
			// changing durations during animations is just not worth
			// the trouble, so let's do nothing and apply new duration
			// to animations that will start from now
			this._setButtonsTooltips();

		} else if ( key === "debug" ) {
			// debug will affect future actions, but there's nothing to replay
			// at the moment of settings this option
		}

		this._afterSetOption( key, value );
	},

	_destroy: function () {
		var destroy = {
			destroy: true
		},
		    self = this;

		var ui = {
			$windows: this.windows()
		};

		this._trigger( "beforeDestroy", {}, ui );

		var $windows = this.windows();

		// refresh windows and generate debug warning if any windows are left
		if ( $windows.length ) {
			if ( this._debugLogAdd(
					"Windows were binbed upon calling \"destroy\".",
					1, 0 ) !== false && this.options.debug.environment ) {
				if ( window.console ) {
					console.log( $windows );
				}
			}
		}

		this._buildTaskbarContent( destroy );

		// destroy draggable, if any
		this.options.draggable = false;
		this._setDraggable();
		this._setDroppable();

		// destroy resizable, if any
		this.options.resizable = false;
		this._setResizable( destroy );

		// destroy autohide
		this.options.autoHide = false;
		this._initAutoHide();

		// destroy custom styles
		this._createStyles( destroy );

		// general cleanup of classes, data, and attributes
		this.$elem
			.removeUniqueId()
			.removeClass(
				         this.classes.taskbar
				 + " " + this.classes.empty
				 + " " + this.classes.uiWidgetContent
			)
			.removeAttr( "data-taskbar-uuid" )
			.removeData( this._cnst.dataPrefix + "taskbarNewWindowsCount" )
			.removeData( this._cnst.dataPrefix + "taskbar" )
			.removeData( this._cnst.dataPrefix + "taskbarEdge" )
			// revert previous inline CSS
			.attr( "style", this._cache.inlineCSS );

		// remove helper iframes if no taskbars are left
		if ( $( "." + this.classes.taskbar ).length === 0 ) {
			$( "." + this.classes.resizeIframe ).remove();
		}

		// we don't need those anymore
		clearInterval( this._cache.timeouts.autoHide );
		clearInterval( this._cache.timeouts.windowResize );

		this._destroyMenus( "[data-menu-type=start]" );

		this._removeTaskbarPositionClasses();
		// +
		this._refreshNeighbours();

		$( "." + this.classes.taskbar ).each( function () {
			var instance = $( this ).data( self._cnst.dataPrefix + "taskbar" );
			instance._refreshWindowsContainment();
		});

		this._destroyWindowsContainment();

		$( window )
			.add( $( document ) )
			.off( "." + this._cache.uep );

		// remove empty attributes
		$.each( [ "class", "style" ], function ( index, attr ) {
			if ( self.$elem.attr( attr ) === "" ) {
				self.$elem.removeAttr( attr );
			}
		});
	}
});

// allow extending prototype for all future instances at once,
// or if "propagateToInstances" is set to true, affect both prototype
// and the current instances
$.simone.taskbarSetup = function ( propagateToInstances, options ) {
	options = arguments.length === 1 ? propagateToInstances : options;
	if ( propagateToInstances === true && arguments.length > 1 ) {
		$( "." + $.simone.taskbar.prototype.classes.taskbar )
			.taskbar( "option", options );
	}
	var o = $.simone.taskbar.prototype.options;
	return options ? $.extend( true, o, options ) : o;
};
})( jQuery );

/*!
 * Simone - window widget, JavaScript
 *
 * Copyright 2014 Cezary Kluczyński and other authors
 * Version: 0.1.9
 * Released under the MIT license.
 *
 * http://cezarykluczynski.github.io/simone/docs/index.html
 * http://cezarykluczynski.github.io/simone/docs/window.html
 */
 ;(function ( $, undefined ) {
"use strict";
/*jshint laxbreak:true,-W030,maxcomplexity:60,smarttabs:true,-W004*/
$.widget( "simone.window", $.ui.dialog, {
	version: "0.1.9",
	options: {
		/* options */
		appendTo          : "body",
		autoOpen          : false,
		buttons           : [],
		closable          : true,
		closeOnEscape     : false,
		closeText         : false,
		confirmClose      : {
			confirm       : false,
			modal         : false,
			minimizable   : true,
			no            : null,
			noLocalized   : "confirmCloseNo",
			text          : null,
			textLocalized : "confirmCloseText",
			title         : null,
			titleLocalized: "confirmCloseTitle",
			yes           : null,
			yesLocalized  : "confirmCloseYes"
		},
		containment       : "inherit",
		dialogClass       : "",
		draggable         : true,
		durations         : {
			maximize      : "default",
			minimize      : "default",
			restore       : "default",
			show          : "default"
		},
		embeddedContent   : false,
		group             : null,
		height            : "auto",
		hide              : false,
		icons             : {
			close         : "ui-icon-closethick",
			confirmClose  : "ui-icon-help",
			main          : null,
			maximize      : "ui-icon-arrow-4-diag",
			minimize      : "ui-icon-minusthick",
			restore       : "ui-icon-newwin"
		},
		maxHeight         : null,
		maximizable       : true,
		maximizedDraggable: true,
		maxWidth          : null,
		minHeight         : 150,
		minimizable       : true,
		minWidth          : 150,
		modal             : false,
		modalOverlay      : "all",
		position          : {
			my            : "center",
			at            : "center",
			of            : window,
			collision     : "fit"
		},
		resizable         : true,
		taskbar           : ".simone-taskbar:eq(0)",
		title             : null,
		titleLocalized    : null,
		widgetClass       : "",
		width             : 300,

		/* events */
		            beforeClose: null,
		                  close: null,

		                 create: null,

		              dragStart: null,
		              drag     : null,
		              dragStop : null,

		focus                  : null,

		         beforeMaximize: null,
		               maximize: null,

		         beforeMinimize: null,
		               minimize: null,

		modalOverlaySetsCreated: null,

		       moveToBackground: null,
		       moveToTop       : null,

		open                   : null,

		            resizeStart: null,
		            resize     : null,
		            resizeStop : null,

		          beforeRestore: null,
		                restore: null,

		             beforeShow: null,
		                   show: null,

		taskbarNotFound        : null
	},

	_cnst: {
		dataPrefix          : "simone-",
		eventPrefix         : "simonewindow",
		lowestPossibleZIndex: -2147483648,
		dimensions          : [ "width", "height" ]
	},

	_titlebarButtons: [
		"close",
		"minimize",
		"maximize"
	],

	_unsupportedOptions: [
		"autoOpen",
		"closeText",
		"hide"
	],

	classes: {
		buttonMinimize           : "simone-window-button-minimize",
		buttonMaximize           : "simone-window-button-maximize-restore",
		windowMaximized          : "simone-window-maximized",
		windowMinimized          : "simone-window-minimized",
		windowMinimizing         : "simone-window-minimizing",
		windowMaximizing         : "simone-window-maximizing",
		windowRestoring          : "simone-window-restoring",
		windowShowing            : "simone-window-showing",
		taskbarButtonActive      : "simone-taskbar-button-state-active",
		taskbarWindowCopy        : "simone-taskbar-window-copy",
		taskbarWindowsContainment: "simone-taskbar-windows-containment",
		taskbarWindowButton      : "simone-taskbar-window-button",
		taskbarHorizontal        : "simone-taskbar-horizontal",
		window                   : "simone-window",
		unminimizable            : "simone-window-unminimizable",
		unmaximizable            : "simone-window-unmaximizable",
		hidden                   : "simone-hidden",
		icon                     : "simone-window-icon",
		taskbar                  : "simone-taskbar",
		coveredByOverlay         : "simone-covered-by-overlay-",
		notCoveredByOverlay      : "simone-not-covered-by-overlay-",
		windowContent            : "simone-window-content",
		windowTop                : "simone-window-top",
		button                   : "simone-window-button",
		modal                    : "simone-window-modal",
		titlebarIcon             : "simone-window-titlebar-icon",
		dialogOverlay            : "simone-window-dialog-overlay",
		windowOverlay            : "simone-window-overlay",
		contentOverlay           : "simone-window-content-overlay",
		contentOverlayed         : "simone-window-content-overlayed",
		titlebarButtonIcon       : "simone-window-titlebar-button-icon",
		bodyOverlay              : "simone-window-body-overlay",
		bodyOverlayed            : "simone-window-body-overlayed",
		confirmClose             : "simone-window-type-confirm-close",
		confirmCloseText         : "simone-window-type-confirm-close-text",
		confirmCloseYes          : "simone-window-type-confirm-close-yes",
		confirmCloseNo           : "simone-window-type-confirm-close-no",
		confirmCloseButtons      : "simone-window-type-confirm-close-buttons",

		// jQuery UI classes
		uiStateActive            : "ui-state-active",
		uiStateHover             : "ui-state-hover",
		uiStateDisabled          : "ui-state-disabled",
		uiDialogTitle            : "ui-dialog-title",
		uiDialogContent          : "ui-dialog-content",
		uiDialogResizing         : "ui-dialog-resizing",
		uiResizable              : "ui-resizable",
		uiResizableHandle        : "ui-resizable-handle",
		uiDraggable              : "ui-draggable",
		uiButton                 : "ui-button",
		uiMenu                   : "ui-menu",
		uiIcon                   : "ui-icon",
		uiDialogDragging         : "ui-dialog-dragging",
		uiDialogTitlebar         : "ui-dialog-titlebar",
		uiDialogButtonpane       : "ui-dialog-buttonpane",
		uiDialogButtons          : "ui-dialog-buttons",
		uiWidgetOverlay          : "ui-widget-overlay",
		uiButtonIconPrimary      : "ui-button-icon-primary",
		uiButtonText             : "ui-button-text"
	},

	// size related and resizable related options copied from jQuery UI 1.11,
	// because they are not available in jQuery UI 1.10 for extending widgets
	sizeRelatedOptions: {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions: {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},

	_create: function () {
		// tracks state of various elements of window
		// and holds a bunch of calculated values and options
		this._cache = {
			// cache inline styles so they can be reverted on widget destruction
			inlineCSS                    : this.element.attr( "style" ) || "",
			title                        : "",
			realTitle                    : this.options.title,
			// track state of the window
			maximized                    : false,
			minimized                    : false,
			restored                     : true,
			shown                        : true,
			maximizing                   : false,
			restoring                    : false,
			minimizing                   : false,
			confirmCloseMinimizing       : false,
			showing                      : false,
			initialized                  : false,
			modalOverlayZIndex           : 0,
			animationProgress            : 100,
			// if set to true, handlers won't be triggered
			suppressEvents               : false,
			// keeps track of window and containment sizes
			sizes                        : {},
			closeForced                  : false,
			closeInevitable              : false,
			destroyed                    : false,
			progress                     : {
				close                    : false,
				interaction              : false,
				refreshPosition          : false,
				restoreMaximizedDraggable: false
			},
			refreshPositionContainment   : null,
			timeouts                     : {
				closeWindowShow          : 0
			},
			taskbarsOnClickPrevention    : 0,
			resizable                    : {
				hasScrollX               : false,
				hasScrollY               : false,
				hasInlineCSS             : false,
				hasInlineCSSX            : false,
				hasInlineCSSY            : false,
				inlineCSS                : "",
				inlineCSSX               : "",
				inlineCSSY               : ""
			},
			draggable                    : {
				scrollX                  : 0,
				scrollY                  : 0
			},
			onInteractionEnd             : [],
			internalCallbacks            : {},
			// cached ID of new window
			newWindowNumber              : false,
			// unique event prefix
			uep                          : this._cnst.eventPrefix + this.uuid
		};

		this.element.uniqueId();

		this._refreshTaskbar();

		// shortcut
		this.$window = this.element;

		// create empty jQuery object for consistency
		this.$close                 = $();
		this.$confirmCloseWindow    = $();
		this.$maximize              = $();
		this.$minimize              = $();
		this.$latestResizableHandle = $();

		this._cacheTitle( this.options.title );
		this._createTitleForEmpty();
		this._title();

		this._validateTaskbar({
			initial: true
		});

		this._debugUnsupportedOptions();
		this._resetUnsupportedOptions();

		this._super();

		// dialogs sets title to undefined is it's null
		// and title attribute on element is missing
		// - lets revert that
		if ( typeof this.options.title === "undefined" ) {
			this.options.title = null;
		}

		this.$elem = $( this.bindings[ 0 ] );

		// from now on, position other than fixed
		// will only be used during resize
		this.$elem
			.uniqueId()
			.addClass( this.classes.window )
			.css( "position", "fixed" );

		this.$window
			.addClass( this.classes.windowContent );

		this._debugOptions();

		// this shorcut is required
		this.$close = this.uiDialogTitlebarClose;
		this.$title = this.uiDialogTitlebar
			.find( "." + this.classes.uiDialogTitle );

		this._bindTaskbar( this.$taskbar );
		// +
		// set title again from cache, after all
		// subordinate elements were create by this._super()
		this._setTitle();

		this._checkForInvalidOptions(
			$.simone.window.prototype.options,
			this.options,
			true
		);

		this._setIcon({
			button: "close"
		});

		// store instance
		this.$window.data( this._cnst.dataPrefix + "window", this );
	},

	_init: function () {
		var self = this;

		this.options.hide = false;

		this.open();

		// dialog since jQuery UI 1.11.1set's overlay z-index
		// to 1 lower than modal z-index
		// github.com/jquery/jquery-ui/commit/acfda4be521e48c6b61cc458a715ef163892ac36
		// window has it's own flow of z-indexes, so we're revert z-index
		// value and use native flow manager instead
		if ( this.overlay ) {
			this.overlay.css( "zIndex", "" );
			this.moveToTop( null, true );
		}

		this._setWindowIcon();
		this._fixTitlebarTitleWidth();

		// we can't have half pixels
		this._fullPxPosition();

		this._setWidth();
		this._setHeight();

		this._setRestoreSize();
		this.refreshPosition({
			skipOnFit: true
		});
		this._setRestoreSize();

		this.$window.css({
			minWidth: "",
			minHeight: ""
		});

		this._setMinimizableMaximizableClasses();

		this._fullPxPosition();

		// fixes a bug where loading page with hash that pointed inside
		// the window,  for example, when having tabs inside a window,
		// would scroll widget a fex pixels;
		// this behaviour was consistent across browsers (Chrome, Firefox, IE)
		this.$elem.on( "scroll." + this._cache.uep, function () {
			self.$elem.scrollTop( 0 );
		});

		// prevents window losing focus, when element inside it is clicked
		// and detached as a result
		this.$elem.on( "mousedown." + this._cache.uep, function () {
			self._preventGlobalWindowClick();
		});

		// revert global click prevention counter
		this.$elem.on( "mouseup." + this._cache.uep, function () {
			self._delay( function () {
				self._revertGlobalWindowClick();
			});
		});

		this._cache.initialized = true;

		this._triggerInternal( "afterTaskbarBind" );

		this._preventGlobalWindowClick();

		this._delay( function () {
			self._revertGlobalWindowClick();
		});

		// don't trigger "create" if window was not created
		if ( ! this._cache.destroyed ) {
			this._trigger( "create" );
		}
	},

	// bind window to a given taskbar
	_rebindTaskbar: function () {
		this._refreshTaskbar();

		// if there's no taskbar, there's nothing to rebind to
		if ( this._validateTaskbar({ rebind: true }) === false ) {
			this._triggerInternal( "afterTaskbarBind" );
			return;
		}

		this._bindTaskbar( this.$taskbar );

		this._setConnectedButtonTitle();
		this._setConnectedButtonState();
		this._languageChange();
	},

	_bindTaskbar: function ( $taskbar ) {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		taskbar._bind( this.$window );

		this.$elem
			.add( this.overlay )
			.attr( "data-taskbar-uuid", this._getTaskbarInstance().uuid );
	},

	_taskbarUnbind: function () {
		var instance = this._getTaskbarInstance();

		if ( instance ) {
			instance._unbind( this.$window );
		}

		this.$elem.removeAttr( "data-taskbar-uuid" );
	},

	// normalize option and bind reference to jQuery object
	_refreshTaskbar: function () {
		this.$taskbar = this.options.taskbar instanceof $
			? this.options.taskbar
			: $( this.options.taskbar );

		this.$taskbar = this.$taskbar.filter( ":eq(0)" );
	},

	_getTaskbarInstance: function () {
		this._validateTaskbar();

		return this.$taskbar.data( this._cnst.dataPrefix + "taskbar" );
	},

	_hasTaskbar: function () {
		var validation = this._taskbarStatus();

		var hasTaskbar = ! validation.isEmptyDomObject && validation.isTaskbar;

		return hasTaskbar;
	},

	_taskbarStatus: function () {
		return {
			isEmptyDomObject: this.$taskbar instanceof $ && ! this.$taskbar.length,
			isTaskbar  : this.$taskbar.hasClass( this.classes.taskbar ),
			isPlugin   : !! $.simone.taskbar
		};
	},

	_validateTaskbar: function ( settings ) {
		var validation = this._taskbarStatus();

		if (
			   validation.isEmptyDomObject
			|| ! validation.isTaskbar
			|| ! validation.isPlugin
		) {
			var errorUi = {
				taskbar : this.options.taskbar,
				$taskbar: this.$taskbar,
			};

			var reasons = {
				isEmptyDomObject: "jQuery object passed in \"taskbar\" "
				                + "option is empty.",
				isTaskbar       : "jQuery object passed in \"taskbar\" option is "
				                + "not an instance of taskbar, call "
				                + "$(\"#selector\").taskbar(); first.",
				isPlugin        : "Taskbar plugin is missing."
			};

			if ( settings && ( settings.initial || settings.rebind ) ) {
				for ( var reason in validation ) {
					// decide reason for failed bind
					if (
						   validation [ reason ] === true
						   && reason === "isEmptyDomObject"
						|| validation [ reason ] === false
						   && reason !== "isEmptyDomObject"
					) {
						errorUi.message = "Window #" + this.element[ 0 ].id
							+ ": " + reasons[ reason ]
							+ (
								settings.rebind
									? " Window was not rebinded."
									: " Window was not created."
								);
						errorUi.initial = ! settings.rebind;
						break;
					}
				}

				var result = this._trigger( "taskbarNotFound", {}, errorUi );
				var self = this;

				// if no taskbar is present, destroy window after creation
				// this is easier than doing hacks to stop creation half-way
				this._bindInternal( "afterTaskbarBind", function () {
					if ( settings.initial ) {
						self.destroy();
					}

					// generate warning if event wasn't prevented
					if ( result !== false ) {
						// window not rebinded is less severe,
						// so let's generate warning on initial taskbar
						// missing and warning for rebind
						settings.rebind
							? (
								console && console.warn
									? console.warn( errorUi.message )
									: null
							)
							: ( console && console.error
									? console.error( errorUi.message )
									: null
							);
					}
				});
			}

			return false;
		}

		return true;
	},

	_refreshGroup: function () {
		this._taskbarUnbind();
		this._bindTaskbar();
	},

	_debugOptions: function () {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		var o = this.options;

		// minWidth should not be higher than maxWidth
		if ( o.minWidth > o.maxWidth
			&& o.minWidth !== null && o.maxWidth !== null ) {
			this._debugLogAdd( "\"minWidth\" option should not be higher " +
				"than \"maxWidth\" option.", 1, 2 );
		}

		// minHeight should not be higher than maxHeight
		if ( o.minHeight > o.maxHeight
			&& o.minHeight !== null && o.maxHeight !== null ) {
			this._debugLogAdd( "\"minHeight\" option should not be higher " +
				"than \"maxHeight\" option.", 1, 2 );
		}

		// in dialog, show was an object describing showing animation,
		// when in window it's handler for when window is being shown
		if ( typeof o.show !== "function" && o.show !== null ) {
			this._debugLogAdd( "option \"show\" should either be " +
				"a function or null.", 1, 2 );
		}
	},

	_debugUnsupportedOptions: function () {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		var self = this;

		// generate debug messages for unsupported options
		$.each( this._unsupportedOptions, function ( index, elem ) {
			if ( self.options[ elem ] !== false ) {
				var msg = "\"" + elem + "\" option is not supported " +
				"and will be set to false.";
				if ( index === "closeText" ) {
					// close window text was delegated to i18n
					msg+= " Use built in localization instead.";
				}
				self._debugLogAdd( msg, 1, 2 );
			}
		});
	},

	_resetUnsupportedOptions: function () {
		this.options.autoOpen  = false;
		this.options.closeText = false;
		this.options.hide      = false;
	},

	// triggers internal callback and set's it to null, because,
	// as for now, only callbacks triggered once are needed
	_triggerInternal: function ( name ) {
		if ( typeof this._cache.internalCallbacks[ name ] === "function" ) {
			this._cache.internalCallbacks[ name ]();
			this._cache.internalCallbacks[ name ] = null;
		}
	},

	// bind internal event to be triggered later,
	// for example after animation finishes
	_bindInternal: function ( name, fn ) {
		this._cache.internalCallbacks[ name ] = fn;
	},

	_createWrapper: function () {
		var self = this;

		this._super();

		this.uiDialog.addClass( this.options.widgetClass );

		// bind ESC blocker for when "closable" option is set to false
		this.uiDialog.on( "keydown." + this._cache.uep, function ( event ) {
			if (
				 ! self.options.closable
				&& self.options.closeOnEscape
				&& event.keyCode === $.ui.keyCode.ESCAPE
			) {
				event.preventDefault();
			}
		});

		this._off( this.uiDialog, "mousedown" );

		// let's rebind window mousedown, so it would not act
		// when right mouse button is pressed
		this.uiDialog.on( "mousedown." + this._cache.uep, function ( event ) {
			if ( event.which === 1 || event.which === 2 ) {
				if ( self._moveToTop( event ) ) {
					self._focusTabbable();
				}
			}
		});

		var keydown = $._data( this.uiDialog[ 0 ] ).events.keydown;
		// because the "closable" blocker is currently binded after
		// the function it suppose to block, we have to swap functions,
		// then blocking function will have the ability to prevent the other one
		$.each( keydown, function ( index, event ) {
			if (
				   typeof index === "number"
				&& keydown.hasOwnProperty( index )
				&& event.namespace.indexOf( self._cache.uep ) !== - 1
			) {
				// swap values; one liner taken from
				// https://twitter.com/izs/statuses/17744109574
				keydown[ index ] =
					[ keydown[ 0 ], keydown[ 0 ] = keydown[ index ] ][ 0 ];

				// break here
				return false;
			}
		});
	},

	// this function will detect scrollbars and freeze their state during drag,
	// otherwise changing position from fixed to absolute could trigger
	// scrollbar apperance, when body has overflow: auto, and if ofter do
	_freezeBodyScrollbars: function () {
		var $body = $( "body" ),
		     d    = document.documentElement,
		     c    = this._cache;

		c.resizable.hasScrollX    = d.scrollWidth !== d.clientWidth,
		c.resizable.hasScrollY    = d.scrollHeight !== d.clientHeight,
		c.resizable.hasInlineCSS  = this._hasInlineProperty( $body, "overflow" ),
		c.resizable.hasInlineCSSX = this._hasInlineProperty( $body, "overflow-y" ),
		c.resizable.hasInlineCSSY = this._hasInlineProperty( $body, "overflow-x" );

		c.inlineCSS               = $body.css( "overflow" ),
		c.inlineCSSX              = $body.css( "overflow-x" ),
		c.inlineCSSY              = $body.css( "overflow-y" );

		var r                     = c.resizable;

		$body.css({
			overflow : "inherit",
			overflowY: r.hasScrollY ? "scroll" : "hidden",
			overflowX: r.hasScrollX ? "scroll" : "hidden"
		});
	},

	// this function will revert window scrolls to state before drag
	_revertBodyScrollbars: function () {
		var r     = this._cache.resizable,
		    $body = $( "body" );

		$body.css({
			overflow : r.hasInlineCSS  ? r.inlineCSS  : "",
			overflowX: r.hasInlineCSSX ? r.inlineCSSX : "",
			overflowY: r.hasInlineCSSY ? r.inlineCSSY : ""
		});
	},

	// make resizable window
	_makeResizable: function() {
		var self = this,
		    $dialog = this.uiDialog,
		    options = this.options,
			handles = options.resizable,
			resizeHandles = typeof handles === "string"
				? handles
				: "n,e,s,w,se,sw,ne,nw";

		var resizable;

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		var originalOffset = {};

		// function to call on resize when containment is set to viewport
		var resizeWithinViewport = function ( event, ui ) {
			var $this = $( this );

			// can't have floats here, they couse ugly errors
			$.each( [ "width", "height" ], function ( index, dimension ) {
				ui.size[ dimension ] = Math.round( ui.size[ dimension ] );
				$this.css( dimension, ui.size[ dimension ] );
			});

			$.each( [ "top", "left" ], function ( index, edge ) {
				ui.position[ edge ] = Math.round( ui.position[ edge ] );
				$this.css( edge, ui.position[ edge ] );
			});

			var s = self._getDimensions.call( $this, {
			    	outer: true
			    }),
			    c = self._cache.sizes.containment,
			    cc = self._getDimensions.call(
			    	$( "." + self.classes.taskbarWindowCopy ), {
			    		outer: true
			    	}
			    ),
			    margins = self._cache.sizes.margins;

			var taskbar = self._getTaskbarInstance();

			if ( taskbar ) {
				var wc = self._getDimensions.call(
					taskbar.$windowsContainment, {
						outer: true
					}
				);
			}

			$.each( [ "top", "left" ], function ( index, edge ) {
				var scroll = $( window )[ "scroll" + self._ucFirst( edge ) ]();

				var isTop     = edge === "top",
				    val       = ui.position[ edge ] + scroll,
				    valPrev   = val,
				    dimension = isTop ? "height" : "width",
				    end       = isTop ? "bottom" : "right",
				    overflow  = (s[ edge ] + s[ dimension ] - scroll )
				    	- cc[ dimension ] + margins[ end ],
				    size      = ui.size[ dimension ],
				    valDiff;

				// apply property first
				$this
					.css( edge, val );

				// recalculate top left overflow
				if ( val < c[ edge ] + scroll ) {
					overflow = ( c[ edge ] + scroll ) - val;
				}

				// correct top left overflow
				val = Math.round( Math.max( val, scroll + c[ edge ] ) );

				valDiff = val - valPrev;

				if ( valDiff !== 0 ) {
					$this
						.css( edge, val );

					ui.position[ edge ] = val;
				}

				size = c[ dimension ]
				     - Math.max( val - c[ edge ], 0 )
				     - ( c[ end ]- s[ end ] );

				size += scroll;

				size = Math.round( size - Math.max( overflow, 0 ) ) + valDiff;

				// apply property first, so outerHeight()/outerWidth
				// can by accurate
				$this
					.css( dimension, size );

				// account for bottom/right overflow
				if ( wc ) {
					var currSize = $this
						[ "outer" + self._ucFirst( dimension ) ]();
					var endDiff = Math.min( 0, wc[ end ] - ( currSize + val ) );
					size += endDiff;
				}

				$this
					.css( dimension, size );

				ui.size[ dimension ] = size;
			});
		};

		// function to call on resize when containment is set to visible
		var resizeWithinVisibleArea = function ( event, ui ) {
			var $this = $( this );

			var diffs = self._bringIntoView({
				diffs: true
			});

			$.each( [ "top", "left" ], function ( index, edge ) {
				var scroll    = $( window )[ "scroll" + self._ucFirst( edge ) ](),
				    isTop     = edge === "top",
				    val       = ui.position[ edge ] + scroll,
				    dimension = isTop ? "height" : "width",
				    end       = isTop ? "bottom" : "right",
				    direction = ui.position[ edge ] > ui.originalPosition[ edge ]
				    	? "less"
				    	: "more",
				    size      = ui.size[ dimension ];

				// apply property first
				$this
					.css( edge, val );

				var change = false;

				// correct top/left edge overflow
				if ( diffs[ edge ] + scroll < 0 && direction === "more" ) {
					change = true;
					val  -= diffs[ edge ] + scroll;
					size += diffs[ edge ] + scroll;
				}

				// correct bottom/right edge overflow
				if ( diffs[ end ] < 0 && direction === "less" ) {
					change = true;
					val  += diffs[ end ];
					size -= diffs[ end ];
				}

				if ( change ) {
					val = Math.round( val );
					size = Math.round( size );

					$this
						.css( edge, val )
						.css( dimension, size );

					ui.position[ edge ] = val;
					ui.size[ dimension ] = size;
				}
			});
		};

		var resizableInstance;

		var correct = function ( event, ui, resizableInstance ) {
			// since jQuery UI 1.11.1 resizable has a bug that does not change
			// width/height by exact drag distance during first drag
			if ( self._versionOf( "resizable", ">=", "1.11.1" ) ) {
				resizableInstance._mouseDrag( event );
			}

			// call appropriate correction function
			self._getRealContainment() === "viewport"
				? resizeWithinViewport.call( this, event, ui )
				: resizeWithinVisibleArea.call( this, event, ui );
		};

		this.uiDialog.resizable({
			cancel     : "." + this.classes.uiDialogContent,
			alsoResize : null,
			aspectRatio: false,
			maxWidth   : options.maxWidth,
			maxHeight  : options.maxHeight,
			minWidth   : options.minWidth,
			minHeight  : this._minHeight(),
			handles    : resizeHandles,
			start: function ( event, ui ) {
				self._interactionInProgress( true );
				self._hideTaskbarsSubordinates();
				self._freezeBodyScrollbars();

				// _blockFrames/_unblockFrames was introduced
				// in jQuery UI Dialog 1.10.1
				if ( self._versionOf( "dialog", ">=", "1.10.1" ) ) {
					self._blockFrames();
				}

				originalOffset = self._getDimensions.call( self.$elem, {
					outer: true
				});

				var $this = $( this );

				resizableInstance = $this.data( self.classes.uiResizable );

				$this.addClass( self.classes.uiDialogResizing );

				// convert position to absolute
				var scroll = self._getWindowScroll(),
				    top   = Math.round(
				    	parseFloat( $this.css( "top" ) )
				    ) + scroll.y,
				    left  = Math.round(
				    	parseFloat( $this.css( "left" ) )
				    ) + scroll.x;

				$this.css({
					top: top,
					left: left,
					position: "absolute"
				});

				self._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			stop: function ( event, ui ) {
				var $this = $( this );
				options.height = $this.height();
				options.width = $this.width();
				$this.removeClass( self.classes.uiDialogResizing );

				// since version 1.11.1 draggable won't respect
				// size set via css() in resize event, so we need to correct
				// the size/dimensions once again
				if ( self._versionOf( "resizable", ">=", "1.11.1" ) ) {
					correct.call( this, event, ui, resizableInstance );
				}

				// convert position to fixed
				var scroll = self._getWindowScroll(),
				    top    = Math.round(
				    	parseFloat( $this.css( "top" ) )
				    ) - scroll.y,
				    left   = Math.round(
				    	parseFloat( $this.css( "left" ) )
				    ) - scroll.x;

				$this.css({
					top: top,
					left: left,
					position: "fixed"
				});

				self._interactionInProgress( false );
				self._revertBodyScrollbars();
				// _blockFrames/_unblockFrames was introduced
				// in jQuery UI Dialog 1.10.1
				if ( self._versionOf( "dialog", ">=", "1.10.1" ) ) {
					self._unblockFrames();
				}
				self._fullPxPosition();
				self._refreshPositionOption();
				self._setRestoreSize();
				self._setContainment();

				self._trigger( "resizeStop", event, filteredUi( ui ) );
			},
			resize: function ( event, ui ) {
				correct.call( this, event, ui, resizableInstance );

				self._fixTitlebarTitleWidth();
				self._fullPxPosition();
				self._setContentHeight();

				self._trigger( "resize", event, filteredUi( ui ) );
			}
		});

		// by default, resizable will threat pressed shift key the same way
		// as "aspectRatio": true, and there no exposed way of preventing
		// this behaviour, so let's instead rewrite a function
		// that recalculates aspect ratio, so it will do nothing
		resizable = this.uiDialog.data( this.classes.uiResizable );

		resizable._updateRatio = function( data ) {
			return data;
		};

		// we need information which handle is currently being dragged,
		// this.$elem will not work if invalid taskbar was given
		// on initialization
		$( this.bindings[ 0 ] )
			.children( "." + this.classes.uiResizableHandle )
			.on( "mousedown." + this._cache.uep, function () {
				self.$latestResizableHandle = $( this );
			});
	},

	// this function will save scrollX and scrollY before drag
	_freezeBodyScrolls: function () {
		this._cache.draggable.scrollX = $( window ).scrollLeft();
		this._cache.draggable.scrollY = $( window ).scrollTop();
	},

	// this function will revert scrolls after drag
	_revertBodyScrolls: function () {
		window.scroll(
			this._cache.draggable.scrollX,
			this._cache.draggable.scrollY
		);
	},

	// sets correction position option after resize/drag
	_refreshPositionOption: function () {
		var options = this.options,
		    $this = this.$elem;

		// jQuery UI 1.10 and before
		options.position = [
			parseInt( $this.css( "top" ), 10 ) - $( window ).scrollLeft(),
			parseInt( $this.css( "left" ), 10 ) - $( window ).scrollTop()
		];

		// jQuery UI 1.11+
		if ( this._versionOf( "dialog", ">=", "1.11.0" ) ) {
			var left = options.position[ 1 ] - $( window ).scrollLeft(),
				top = options.position[ 0 ] - $( window ).scrollTop();

			options.position = {
				my: "left top",
				at: "left" + (left >= 0 ? "+" : "") + left + " " +
					"top" + (top >= 0 ? "+" : "") + top,
				of: window
			};
		}
	},

	// make draggable window
	_makeDraggable: function () {
		this._super();

		var self             = this,
		    $elem            = this.uiDialog,
		    options          = this.options,
		    originalOffset   = {},
		    originalPosition = {};

		// this function will allow restore on maximized window,
		// when drag started on it
		function restoreMaximizedDraggable( event, ui ) {
			self._cache.progress.restoreMaximizedDraggable = true;

			var draggable = $elem.data( self.classes.uiDraggable );
			var taskbar = self._getTaskbarInstance();

			var $title = self.uiDialogTitlebar
				.find( "." + self.classes.uiDialogTitle );
			var $lastButton = $title
				.siblings( "." + self.classes.uiButton + ":visible:eq(0)" );

			var draggableBefore = $.extend( true, {}, draggable );

			// restore without animation
			self.restore( false );

			// stop draggable, so some calculations and window moves can be done
			draggable._mouseStop( event );

			var td  = taskbar._extendedPosition.call( $elem, "offset" ),
			    tdt = taskbar._extendedPosition.call( $title, "offset" ),
			    bt  = taskbar._extendedPosition.call(
			    	$lastButton.length ? $lastButton : $title, "offset"
			    );

			var diffs = {};

			var scroll = self._getWindowScroll();

			// calculate top: take it from the current position
			var top = parseFloat( $elem.css("top") )
				- ( td.top - ui.originalPosition.top ) + scroll.y;

			diffs.left = event.pageX - bt.right;
			diffs.right = event.pageX - tdt.left;

			var change = 0;

			// calculate left change to match cursor position
			if ( diffs.left < 0 ) {
				change = diffs.left + tdt.width;
			} else if ( diffs.right > 0 ) {
				change = diffs.right - ( tdt.width + (bt.right - tdt.right) );
			}

			var left = parseFloat( $elem.css( "left" ) ) + change;

			// set new dimensions to dialog
			$elem.css({
				top: top,
				left: left
			});

			// restart draggable
			draggable._mouseStart( event );

			// restart again...
			// fixes tests/unit/windowOptions.html:
			// "maximizedDraggable" vs containment:
			// Widget touches right edge of containment.
			draggable._mouseStop( event );
			draggable._mouseStart( event );

			var draggableAfter = $.extend( true, {}, draggable );

			// set changed values to ui object, so they can be written
			// to draggable.position by draggable _mouseDrag() function
			ui.position.top = draggable.offset.top - $( window ).scrollTop();
			ui.position.left = draggable.offset.left - $( window ).scrollLeft();

			self._cache.progress.restoreMaximizedDraggable = false;
		}

		function fixFloatingPosition ( event, ui ) {
			ui.position.top  = Math.round( parseFloat( ui.position.top ) );
			ui.position.left = Math.round( parseFloat( ui.position.left ) );
		}

		function draggableUi( ui ) {
			return {
				position        : ui.position,
				originalOffset  : originalOffset,
				originalPosition: originalPosition,
				offset          : ui.offset,
			};
		}

		$elem.draggable( "option", {
			scroll: false,
			distance: 1, // 0 would collide with "maximizedDraggable": true
			iframeFix: true, //just to be safe
			start: function ( event, ui ) {
				self.$elem.data(
					self._cnst.dataPrefix + "window-scrolls",
					{ x: $( window ).scrollLeft(), y: $( window ).scrollTop() }
				);
				// _blockFrames/_unblockFrames was introduced
				// in jQuery UI Dialog 1.10.1
				if ( self._versionOf( "dialog", ">=", "1.10.1" ) ) {
					self._blockFrames();
				}
				self._interactionInProgress( true );
				self._interactionsState( true );
				self._hideTaskbarsSubordinates();
				self._freezeBodyScrolls();

				originalOffset   = self.$elem.offset();
				originalPosition = self.$elem.position();

				self._trigger( "dragStart", event, draggableUi( ui ) );
			},
			stop: function ( event, ui ) {
				$( this ).removeClass( self.classes.uiDialogDragging );

				self._interactionInProgress( false );
				// _blockFrames/_unblockFrames was introduced
				// in jQuery UI Dialog 1.10.1
				if ( self._versionOf( "dialog", ">=", "1.10.1" ) ) {
					self._unblockFrames();
				}
				self._fullPxPosition();
				self._refreshPositionOption();
				self._setRestoreSize();
				self._revertBodyScrolls();

				self.$elem.removeData( self._cnst.dataPrefix + "window-scrolls" );

				self._trigger( "dragStop", event, draggableUi( ui ) );
			},
			drag: function ( event, ui ) {
				if ( self.maximized() && self.options.maximizedDraggable ) {
					restoreMaximizedDraggable( event, ui );
				}

				fixFloatingPosition( event, ui );

				// correct position by scrolls saved on start,
				// this allow mousewheel event not to be prevented
				if ( self._versionOf( "dialog", ">=", "1.11.0" ) ) {
					var scrolls = self.$elem.data(
						self._cnst.dataPrefix + "window-scrolls"
					);

					ui.position.left += scrolls.x - $( window ).scrollLeft();
					ui.position.top  += scrolls.y - $( window ).scrollTop();
				}

				self._trigger( "drag", event, draggableUi( ui ) );
			},
		});

		this._extendDraggableCancel();
		this._setContainment();
	},

	// returns real containment, taking "inherit" into account
	_getRealContainment: function () {
		var taskbar = this._getTaskbarInstance();

		return this.options.containment === "inherit" && taskbar
			? taskbar.options.windowsContainment
			: this.options.containment;
	},

	_getRealContainmentObject: function () {
		return $( "." + this.classes.taskbarWindowsContainment );
	},

	// calculate and return containment for windows with
	// containment option set to visible
	_getVisibleContainmentArray: function () {
		var taskbar = this._getTaskbarInstance(),
		    containment;

		var x1, x2, y1, y2;

		this._refreshTaskbarMargins();

		var margins = this._cache.sizes.margins;

		var $elem;

		if ( this.bindings[ 0 ].length ) {
			$elem = this.bindings[ 0 ];
		} else if ( this.$elem.length ) {
			$elem = this.$elem;
		} else if ( this.element.length ) {
			$elem = this.element.parent();
		} else {
			return [ 0, 0, 0, 0 ];
		}

		var ed = taskbar._extendedPosition.call( $elem ),
		    cd = taskbar._extendedPosition.call(
		    	this._getRealContainmentObject(), "offset"
		    ),
		    tdt = taskbar._extendedPosition.call(
		    	this.uiDialogTitlebar.find( "." + this.classes.uiDialogTitle ),
		    	"offset"
		    ),
		    r = this._bringIntoViewReserve(),
		    scroll = this._getWindowScroll();

		x1  = scroll.x + margins.left;
		y1  = scroll.y + margins.top;
		x2  = x1 + scroll.x + cd.width - ed.width;
		y2  = y1 + cd.height - ed.height - scroll.y;

		x1 -= tdt.width;
		y1 -= tdt.bottom - ed.top - r - scroll.y;
		x2 += tdt.width - (tdt.right - ed.right) - r;
		y2 += 2 * scroll.y + ed.height - ( tdt.top - ed.top ) - r;

		containment = [ x1, y1, x2, y2 ];

		return containment;
	},

	_getWindowScroll: function () {
		return this._getTaskbarInstance()._getWindowScroll();
	},

	// sets containment for draggable and resizable
	_setContainment: function ( options ) {
		var containment = this._getRealContainment();

		if (
			   $.ui.draggable && this.options.draggable
			&& this.uiDialog.hasClass( this.classes.uiDraggable )
		) {
			var $containment;

			if ( containment === "viewport" ) {
				$containment = this._getRealContainmentObject();
			} else if ( containment === "visible" ) {
				$containment = this._getVisibleContainmentArray();
			}

			this.uiDialog.draggable( "option", "containment", $containment );
		}

		if (
			   $.ui.resizable && this.options.resizable
			&& this.uiDialog.hasClass( this.classes.uiResizable )
		) {
			if ( containment === "viewport" ) {
				this.uiDialog.resizable( "option", "containment", "document" );
			} else if ( containment === "visible" ) {
				this.uiDialog.resizable( "option", "containment", false );
			}
		}
	},

	_extendDraggableCancel: function () {
		// cancel draggable on window manipulation buttons
		var cancel = this.uiDialog.draggable( "option", "cancel" );

		if ( cancel.indexOf( this.classes.button ) === -1 ) {
			cancel += ", ." + this.classes.button + ", ." + this.classes.icon;
			this.uiDialog.draggable( "option", "cancel", cancel );
		}
	},

	// open confirm close window
	_openConfirmClose: function () {
		var self = this,
		    o = this.options;

		if ( o.confirmClose.confirm ) {
			if ( ! this._cache.progress.close ) {
				this._placeOverlay({
					window: true
				});

				this.$confirmCloseWindow = $( "<div></div>" );

				this.$confirmCloseWindow
					.addClass( this.classes.confirmClose )
					.append(
						$( "<p>" +  this._buildConfirmCloseText( "text" ) +"</p>" )
							.addClass( this.classes.confirmCloseText )
					)
					.window({
						// options that propagate from main window
						taskbar        : this.$taskbar,
						minimizable    : o.confirmClose.minimizable,
						modal          : o.confirmClose.modal,
						containment    : o.containment,
						durations      : o.durations,
						icons          : {
							main       : o.icons.confirmClose
						},
						// end of options that propagate from main window
						title          : this._buildConfirmCloseText( "title" ),
						buttons        : this._confirmCloseButtonsConfig(),
						closeOnEscape  : true,
						maximizable    : false,
						resizable      : false,
						height         : "auto",
						minHeight      : null,
						beforeMinimize : function () {
							self._cache.confirmCloseMinimizing = true;
						},
						minimize       : function () {
							self._cache.confirmCloseMinimizing = false;
						},
						// let's have it here so calling close() on this window
						// don't break anything
						close          : function () {
							self._unblock();
						}
					});

				this._afterConfirmCloseButtonsBuild();

				this._removeTopClasses();
				this.$confirmCloseWindow.window( "moveToTop" );

				// position window on the coenter of it's parent window
				var $confirmCloseWindowParent = this.$confirmCloseWindow.parent(),
				    taskbar = this._getTaskbarInstance(),
				    pd      = taskbar._extendedPosition.call(
				    	$confirmCloseWindowParent, "offset"
				    ),
				    wd      = taskbar._extendedPosition.call(
				    	this.$elem, "offset"
				    ),
				    css     = {},
				    scroll  = this._getWindowScroll();

				// calculate window center
				css.top   = wd.top - scroll.y;
				css.left  = wd.left - scroll.x;
				css.top  -= ( pd.height - wd.height ) / 2;
				css.left -= ( pd.width - wd.width ) / 2;

				$confirmCloseWindowParent
					.css( css )
					.attr( "data-close-window-for", self.$elem.attr( "id" ) );

				// refresh position for those rare cases,
				// where positioning on center of parent window
				// would move confirm close window outside the containment
				this.$confirmCloseWindow.window( "refreshPosition" );

				this._cache.progress.close = true;

				return true;
			}
		}

		return false;
	},

	// returns calculated config for confirm close buttons
	_confirmCloseButtonsConfig: function () {
		var self = this;

		return [
			{
				text   : this._buildConfirmCloseText( "no" ),
				click  : function () {
					self.$confirmCloseWindow.window( "close" );
				}
			},
			{
				text   : this._buildConfirmCloseText( "yes" ),
				click  : function () {
					// closing the parent window, so we don't need
					// to unblock or move it to the top anymore
					self.close();

					self._closeConfirmCloseWindow();
				}
			}
		];
	},

	_afterConfirmCloseButtonsBuild: function () {
		var buttonClasses = [
			this.classes.confirmCloseNo,
			this.classes.confirmCloseYes
		];

		// add no/yes classes based on buttons order;
		// no always go first, because it receives default focus
		$( "." + this.classes.uiDialogButtonpane, this.$confirmCloseWindow.parent() )
			.addClass( this.classes.confirmCloseButtons )
			.find( "." + this.classes.uiButton ).each( function ( index ) {
				$( this ).addClass( buttonClasses[ index ] );
			});
	},

	_buildConfirmCloseText: function ( key ) {
		var o = this.options;

		var keys = {
			title: this.title()
		};

		return o.confirmClose[ key ]
			? this._getTaskbarInstance()._i18n_replace_keys( o.confirmClose[ key ], keys )
			: this._i18n( o.confirmClose[ key + "Localized" ], keys );
	},

	// confirm close windows are subordinates and receive
	// some of it's options from the parent window,
	// this function keep those options up to date
	_propagateConfirmCloseOptions: function ( key, prev ) {
		var self = this;

		var options, force;

		if ( typeof key !== "object" ) {
			options = {};

			options[ key ] = prev;
		} else {
			options = key;
			force   = !! prev;
		}

		$.each( options, function ( key, prev ) {
			if (
				   self.$window.hasClass( self.classes.confirmClose )
				&& key === "confirmClose"
			) {
				var taskbar = self._getTaskbarInstance();

				if ( ! taskbar ) {
					return;
				}

				// warning about nesting confirm close window,
				// although, it should not be done and probably will never
				// be officially supported
				self._debugLogAdd( "Trying to change confirmClose option on a"
					+ " window that is a confirm close window itself."
					+ " Confirm close windows should not be nested.", 1, 2 );
			}

			if ( self.$confirmCloseWindow.length ) {
				if ( key === "durations" ) {
					// confirm close should have the same durations as parent window
					self.$confirmCloseWindow
						.window( "option", "durations", self.options.durations );
				}

				if ( key === "confirmClose" ) {
					var o = self.options.confirmClose;

					var simpleOptions = [ "modal", "minimizable" ],
					    textsOptions  = [ "title" ],
					    textsBody     = [ "text" ],
					    textsButtons  = [ "yes", "no" ];

					// options that should be passed 1:1
					$.each( simpleOptions, function ( index, value ) {
						if ( prev[ value ] !== o[ value ] || force ) {
							self.$confirmCloseWindow.window(
								"option", value, o[ value ]
							);
						}
					});

					// check of text really changed
					var textChanged = function( value ) {
						return prev[ value ] !== o[ value ]
						    || prev[ value + "Localized" ] !== o[ value + "Localized" ]
						    || force;
					};

					// window title
					$.each( textsOptions, function ( index, value ) {
						if ( textChanged( value ) ) {
							self.$confirmCloseWindow.window(
								"option",
								value,
								self._buildConfirmCloseText( value )
							);
						}
					});

					// confirm close body
					$.each( textsBody, function ( index, value ) {
						var upperKey = self._ucFirst( value );

						if ( textChanged( value ) ) {
							self.$confirmCloseWindow
								.find( "." + self.classes[ "confirmClose" + upperKey ] )
								.text( self._buildConfirmCloseText( value ) );
						}
					});

					// yes/no buttons
					$.each( textsButtons, function ( index, value ) {
						if ( textChanged( value ) ) {
							self.$confirmCloseWindow.window(
								"option", "buttons", self._confirmCloseButtonsConfig()
							);

							self._afterConfirmCloseButtonsBuild();
						}
					});
				}

				if ( key === "icons" ) {
					self.$confirmCloseWindow
						.window(
							"option",
							"icons.main",
							self.options.icons.confirmClose
						);
				}

				if ( key === "title" ) {
					self.$confirmCloseWindow
						.window(
							"option",
							"title",
							self._buildConfirmCloseText( "title" )
						);
				}

				// rebind confirm close window when window taskbar was changed
				if ( key === "taskbar" ) {
					self.$confirmCloseWindow
						.window( "option", "taskbar", self.$taskbar );
				}
			}
		});
	},

	// close confirm close window and reset reference
	_closeConfirmCloseWindow: function () {
		var self = this;

		if ( this.$confirmCloseWindow.length ) {
			this.$confirmCloseWindow.window( "option", {
				beforeClose: $.noop,
				close      : function () {
					self._unblock();
				}
			}).window( "close" );

			this.$confirmCloseWindow = $();
		}
	},

	_unblock: function () {
		this.$confirmCloseWindow = $();

		// destroy window overlay
		this._placeOverlay({
			destroy: true,
			window: true
		});

		this._cache.progress.close = false;
	},

	// proxy to taskbar i18n
	_i18n: function ( translation, keys, language ) {
		var taskbar = this._getTaskbarInstance();

		if ( taskbar) {
			return taskbar._i18n( translation, keys, language );
		}

		return translation;
	},

	// create titlebar and it's buttons
	_createTitlebar: function() {
		this._super();

		if ( ! this._hasTaskbar() ) {
			return;
		}

		var self = this;

		// rebind close click event to account for "closable" option
		this.uiDialogTitlebarClose
			.off( "click" )
			.on( "click." + this._cache.uep, function ( event ) {
				event.preventDefault();

				if ( self.options.closable ) {
					self.close( event );
				}
			});

		this._setButtonCloseState();
		this.uiDialogTitlebarClose.attr( "data-button-name", "close" );

		this.$elem = this.uiDialog.closest( "." + this.classes.uiDialog );

		this._createButton( "maximize" );
		this._createButton( "minimize" );

		// implement double click on titlebar for toggling maximized state
		this.uiDialogTitlebar.on( "dblclick." + this._cache.uep, function ( event ) {
			// only titlebar and title can trigger the behaviour,
			// no icon or buttons
			if (
				   ! $( event.target ).hasClass( self.classes.uiDialogTitlebar )
				&& ! $( event.target ).hasClass( self.classes.uiDialogTitle )
			) {
				return false;
			}

			if ( ! self.options.maximizable ) {
				return true;
			}

			self._blurActiveElement( true );

			self._toggleMaximized();
		});
	},

	// set label and visibility to close button
	_setButtonCloseState: function () {
		this.uiDialogTitlebarClose
			.button( "option", "label", this._i18n( "close" ) );

		this._addButtonClasses( this.uiDialogTitlebarClose );

		this.uiDialogTitlebarClose.toggleClass(
			this.classes.hidden,
			! this.options.closable
		);

		this._enumerateTitlebarButtons();
	},

	// create titlebar buttons
	_createButton: function ( options ) {
		var self = this;

		// normalization
		if ( typeof( options ) === "string" ) {
			options = {
				button: options
			};
		}

		var b = options.button,
			B = this._ucFirst( b );

		// remove the old one
		this.$elem.find( "." + this.classes[ "button" + B ] ).remove();

		// don't create minimize/maximize buttons
		// if window is not minimizable/maximizable
		if (
			   b === "maximize" && ! this.options.maximizable
			|| b === "minimize" && ! this.options.minimizable
		) {
			this._enumerateTitlebarButtons();

			return;
		}

		this[ "$" + b ] = $( "<button></button>" )
			.button({
				text: false
			})
			.attr( "data-button-name", b )
			.addClass( this.classes[ "button" + B ] + " " + this.classes.button )
			.on({
				click: function ( event ) {
					// trigger action
					b === "minimize" ? self[ b ]() : self._toggleMaximized();

					if ( b === "minimize" ) {
						this.blur();
					} else {
						self.moveToTop();
					}
				},
				mousedown: function () {
					$( this )
						.siblings( "." + self.classes.uiButton )
						.removeClass( self.classes.uiStateHover );

					if ( b === "maximize" ) {
						this.focus();
					}
				}
			});

		this._setIcon({
			button: b
		});

		this._setButtonText({
			button: b
		});

		// insert into right position
		if ( b === "minimize" ) {
			this[ "$" + b ]
				.appendTo( this.uiDialogTitlebar );
		} else {
			this[ "$" + b ]
				.insertAfter ( this.uiDialogTitlebarClose );
		}

		this._enumerateTitlebarButtons();
	},

	// changes duration of maximire/restore and show/minimize methods,
	// for when one method was called during the second one,
	// so reverting it to a previous state would take about the same
	// time as passed from first animation start
	_speedUpAnimation: function ( action, animationProgress ) {
		return typeof( this.options.durations[ action ] ) === "string"
			? $.fx[ this.options.durations[ action ] ]
			: this.options.durations[ action ] * animationProgress;
	},

	// this is main function for manipulation windows order
	_moveToTop: function ( settings, silent ) {
		var self             = this,
		    // settings.type indicate that we deal with event
		    isEventTriggered = settings && settings.type,
		    // normalize settings
		    highest          = settings && settings.highest === true,
		    skipThis         = settings && settings.skipThis === true,
		    skipMinimizing   = settings && settings.skipMinimizing === true,
		    blurModals       = settings && settings.blurModals === true,
		    $skipCloseWindow = $(),
		    activeElement    = document.activeElement,
		    $modal           = this._getActiveModal()
		    	.filter( ":visible" )
		    	.not( "." + this.classes.windowMinimizing ),
		    taskbar          = this._getTaskbarInstance(),
		    $modals          =  $();

		if ( ! taskbar ) {
			return;
		}


		// if there is modal present, don't make this window active
		if ( $modal.length && ! this.options.modal ) {
			skipThis = true;
		}

		// minimizing window can't be moved to top,
		// if it come from user interaction
		if ( this._cache.minimizing && isEventTriggered ) {
			return;
		}

		var wasOnTop = this.$elem.hasClass( this.classes.windowTop );

		if ( this._cache.progress.close && ! skipThis ) {
			highest = true;

			// remove confirm close window from set of windows to blur,
			// it will be later moved to top by handler on bind to overlat
			if (
				 ! this._cache.confirmCloseMinimizing
				&& self.$confirmCloseWindow.length
			) {
				$skipCloseWindow = $skipCloseWindow
					.add( self.$confirmCloseWindow );
			}
		}

		var initialZIndex = taskbar.options.windowsInitialZIndex,
		    // "skipThis" lets blur all windows; combined with "highest",
		    // it will put the highest window on top - that's useful
		    // for reverting active window after user clicked outside of windows
		    $elem = skipThis ? null : this.$elem,
		    $otherWindows = $( "." + this.classes.window )
		    	.not( skipMinimizing ? null : "." + this.classes.windowMinimizing )
		    	.not( "." + this.classes.bodyOverlayed )
		    	.add( skipThis ? this.$elem : null )
		    	.not( $elem )
		    	.not( $skipCloseWindow )
		    	.not( "." + this.classes.modal )
		    	.filter( ":visible" );

		$( "." + this.classes.taskbar ).each( function () {
			var $taskbar = $( this );

			var instance = $taskbar.data( self._cnst.dataPrefix + "taskbar" );

			// find modals on top
			$modals = $modals.add(
				instance.windows()
					.parent()
					.filter( "." + self.classes.modal )
					.filter( "." + self.classes.windowTop )
					.not( "." + self.classes.windowMinimizing )
					.filter( ":visible" )
			);
		});

		$modals = $modals.not( $elem );

		// sort by z-index, we're later set new z-indexes using this order
		var windows = this._sortByZIndex( $otherWindows, "asc", "raw" );

		// if we minimize / close window, a next highest will become top window;
		// null accounts for no more windows to choose from
		if ( highest ) {
			$elem = windows.length ? windows.pop()[ 1 ] : null;
		}


		// if we're moving current window to top, and current window is modal,
		// minimize and revert other modals
		if ( $elem === this.$elem && ! skipThis && this.options.modal ) {
			this._revertActiveModalZIndexes();
			this._minimizeOtherModals({
				skipZIndexRevert: true
			});
		}

		this._removeTopClasses(
			$otherWindows
				.add( highest ? this.$elem : null )
				.not( $modal )
		);

		// place window overlays;
		// autodetect if they should be created
		$otherWindows
			.each( function () {
				$( this )
					.children( "." + self.classes.windowContent )
					.data( self._cnst.dataPrefix + "window" )
					._placeOverlay({
						window: "auto"
					});
			});

		// set new z-indexes
		$.each( windows, function ( index, set ) {
			set[ 1 ].css( "zIndex", initialZIndex );
			initialZIndex++;
		});

		var move;

		if ( $elem instanceof $ ) {
			if ( ! skipThis ) {
				// move element only if it's this instance window,
				if ( $elem === this.$elem ) {
					var thisWasFocused =
						   activeElement === this.$elem[ 0 ]
						|| $.contains( this.$elem[ 0 ], activeElement ),
					    thisHadWindowTopClasses =
						this.$elem.hasClass( this.classes.windowTop );

					// Math.max account for cases when top window is modal;
					// z-index cannot go lower than z-index set by modal logic
					var currentZIndex = parseInt( $elem.css( "zIndex" ), 10 );
					$elem.css( "zIndex", Math.max(
						initialZIndex, currentZIndex
					));

					// window cannot be moved to top if it has overlay,
					// meaning a confirm close procedure is ongoing
					if ( ! $elem.hasClass( this.classes.bodyOverlayed ) ) {
						this._setTopClasses( $elem );
					}

					// focus element is this window was not on top,
					// and the move to top didn't come from user action
					if (
						   ! thisHadWindowTopClasses
						&& ! silent
						&& ( isEventTriggered || ! thisWasFocused )
					) {
						this._focusTabbable();
						this._trigger( "focus", settings );
					}

					// set z-indexes to elements affected by modal overlay,
					// but only for the current window (other modals
					// were reverted eariler)
					if ( this.options.modal ) {
						this._modalZIndexes({
							revertActive: false
						});
					}

					// set window button state, also set state for window
					// on top, that could be active modal
					$elem
						.add( $modal )
						.each( function () {
							$( this )
								.children( "." + self.classes.windowContent )
								.data( self._cnst.dataPrefix + "window" )
								._setConnectedButtonState();
						});
				} else {
					move = true;
				}
			} else {
				// prevents infinite loop with only one window and it's
				// close window present; there's should be a better way
				// to deal with it than a last minute hack
				if(
					$elem[ 0 ].id !==this.$elem.attr( "data-close-window-for" )
				) {
					move = true;
				}
			}

			// use public API to moveToTop if element was not this window wrapper
			if ( move ) {
				$elem
					.children( "." + this.classes.windowContent )
					.window( "moveToTop" );

				return;
			}
		}

		if ( blurModals ) {
			this._removeTopClasses( $modals );
		}

		// destroy overlay if it's not full window overlay,
		// cause if it is, confirm close is in progress
		if ( ! this.$elem.hasClass( this.classes.bodyOverlay ) ) {
			this._placeOverlay({
				destroy: true
			});
		}

		if ( ! blurModals && $elem !== this.$elem ) {
			this._setTopModalState( $elem );
		}

		if (
			   $elem === this.$elem
			&& ! wasOnTop
			&& ! this._cache.progress.close
		) {
			this._trigger( "moveToTop", settings );
		}

		// return true if current window was really moved to top,
		// so _focusTabbable will fire
		if ( $elem === this.$elem && ! skipThis && ! highest && ! wasOnTop ) {
			return true;
		}
	},

	// set classes for window on top
	_setTopClasses: function ( $elem ) {
		var $this = $elem ? $elem : this.$elem;

		$this
			.addClass( this.classes.windowTop )
			.children( "." + this.classes.uiDialogTitlebar )
			.addClass( this.classes.uiStateActive );

		this._setConnectedButtonsState(
			$this.children( "." + this.classes.windowContent )
		);
	},

	// remove classes for window on top,
	// and trigger "moveToBackground" event
	// on windows that were on top
	_removeTopClasses: function ( $elem ) {
		var $this = $elem ? $elem : this.$elem,
		    self = this;

		$this.each( function () {
			var $this = $( this );

			if ( $this.hasClass( self.classes.windowTop ) ) {
				$this
					.removeClass( self.classes.windowTop )
					.children( "." + self.classes.uiDialogTitlebar )
					.removeClass( self.classes.uiStateActive );

				$this
					.children( "." + self.classes.windowContent )
					.data( self._cnst.dataPrefix + "window" )
					._trigger( "moveToBackground", {}, {} );
			}
		});

		this._setConnectedButtonsState(
			$this.children( "." + this.classes.windowContent )
		);
	},

	// trigger internal function on passed instances
	_setConnectedButtonsState: function( $elems ) {
		var self = this;

		$elems.each( function () {
			$( this )
				.data( self._cnst.dataPrefix + "window" )
				._setConnectedButtonState();
		});
	},

	// this wrapper will either perform jQuery animation
	// or trigger handlers and set CSS prop values immediately
	// of duration is set to false
	_animate: function ( css, animation ) {
		if ( animation.duration === false ) {
			this.css( css );

			if ( animation.start ) {
				animation.start();
			}

			if ( animation.complete ) {
				animation.complete();
			}

			if ( animation.always ) {
				animation.always();
			}
		} else {
			this.animate( css, animation );
		}
	},

	// main closing function
	_close: function( event ) {
		var self = this;

		// interaction is in progress, call this function on interaction end
		if ( this._onInteractionEnd( "close" ) === true ) {
			return;
		}

		// is closeIneavitable === true, this function was already called
		if ( this._cache.closeInevitable ) {
			return;
		}

		// trigger events or open confirm cloose window
		// if destroy was not called on window
		if ( ! this._cache.closeForced ) {
			// if confirmClose.confirm is true, but confirm close window
			// was not yet opened, open it now
			if ( this._openConfirmClose() === true ) {
				return;
			}

			// respect prevention of beforeClose event
			if (this._trigger( "beforeClose", event ) === false ) {
				return;
			}
		}

		// now the close couldn't not be canceled
		this._cache.closeInevitable = true;

		this._clearTimeouts();

		// is confirm close window was already opened,
		// second call of _close() function closes window
		// along with it confirm close window
		this._closeConfirmCloseWindow();

		this._taskbarUnbind();

		this._revertModalZIndexes({
			force: true
		});

		// this is for overlay so it will hide instantaneously
		this.options.durations = {
			minimize: false
		};

		this._hideOverlay();

		this._isOpen = false;

		this._destroyOverlay();

		this.destroy();

		if ( !this.opener.filter( ":focusable" ).focus().length ) {
			// Hiding a focused element doesn't trigger blur in WebKit
			// so in case we have nothing to focus on, explicitly blur the
			// active element https://bugs.webkit.org/show_bug.cgi?id=47182
			$( this.document[0].activeElement ).blur();
		}

		this._trigger( "close", event, {} );
	},

	// main function for showing
	// it's complicated tomove it to _show() because of dialog inheritance
	show: function ( event ) {
		var quick          = event === false,
		    parsedDuration = this._parseDuration( event );

		// don't show if animations is already in progress,
		// and it's not dblclick/force show
		if (
			   this._animationProgress()
			&& (
				   ! event
				|| ! parsedDuration
				|| ( event && event.type !== "dblclick" )
			)
			&& ! quick
		) {
			return;
		}

		// interaction is in progress, call this function on interaction end
		if ( this._onInteractionEnd( "minimize", event ) === true ) {
			return;
		}

		var ui = {};

		// respect prevetion of "beforeShow" event
		if (
			 ! this._cache.suppressEvents
			&& this._trigger( "beforeShow", event, ui ) === false
		) {
			return;
		}

		this.$elem.removeClass( this.classes.windowMinimized );

		if ( this._cache.minimized ) {
			// move to the right position before showing
			this.$elem.css( this._getButtonCoordinates() );
		}
		// +
		if ( ! this._cache.showing ) {
			this.$elem.stop( true, quick );
		}

		this._cache.minimized = false;
		this._cache.showing   = true;

		// cache current values
		var animationProgress = this._cache.animationProgress,
		    minimizing  = this._cache.minimizing
		    	? this.options.durations.minimize
		    	: undefined,
		    speedUpDuration;

		this.moveToTop();

		var self = this,
		    props = this._cache.maximized
		    	? this._cache.sizes.containment
		    	: this._cache.sizes.self;

		if ( minimizing !== undefined ) {
			// if there was minimize in progress, the current progress of it
			// is used to shorten show animation, so it is has the same speed
			// as minimize; otherwise reverting minimize in progress would
			// seem slow
			speedUpDuration = this._speedUpAnimation(
				"minimize", animationProgress
			);
		}

		props.opacity = 1;

		this._deleteBottomRight( props );

		this.$elem
			.show()
			.addClass( this.classes.windowShowing );

		this._interactionsState( false );

		var duration =
			this._cache.shown || event && event.type === "dblclick" || quick
			? false
			: speedUpDuration || parsedDuration || this.options.durations.show;
		// +
		this._cache.shown = true;

		var animation = {
			duration: duration,
			complete: function() {
				self._fixTitlebarTitleWidth();
				self._setContentHeight();
				self._focusTabbable();
				if ( self.$elem.hasClass( self.classes.windowTop ) ) {
					self._trigger( "focus" );
				}
			},
			progress: function () {
				self._fixTitlebarTitleWidthDuringAnimation.apply(
					self, arguments
				);
				self._setContentHeight();
			},
			always: function () {
				self.$elem
					.removeClass( self.classes.windowShowing )
					.removeClass( self.classes.windowMaximizing )
					.removeClass( self.classes.windowRestoring );

				self._cache.showing = false;
				self._interactionsState( true );
				self.refreshPosition();

				// remove opacity, so it won't interfere with
				// minimize all button hover opacity change
				self.$elem
					.css( "opacity" , "" );

				self._setRestoreSize();

				var ui = {};

				self._triggerInternal( "afterWindowAnimationStop" );

				if ( ! self._cache.suppressEvents ) {
					self._trigger( "show", {}, ui );
				}
			}
		};

		this._animate.call( this.$elem, props, animation );
		this._createOverlay();
		this._showOverlay();
	},

	_minimize: function ( event ) {
		var quick          = event === false,
		    parsedDuration = this._parseDuration( event );

		// don't minimize when animation if in progress and minimize
		// isn't forced
		if (
			   this._animationProgress()
			&& ! quick
			&& ! this._isMinimizeAllInProgress()
		) {
			return;
		}

		// interaction is in progress, call this function on interaction end
		if ( this._onInteractionEnd( "minimize", event ) === true ) {
			return;
		}

		var self = this,
		    skipZIndexRevert = event && event.skipZIndexRevert,
		    beforeUi = {
		    	minimizeAllInProgress: this._isMinimizeAllInProgress()
		    };

		// respect prevetion of "beforeMinimize" event
		if (
			 ! this._cache.suppressEvents
			&& this._trigger( "beforeMinimize", {}, beforeUi ) === false
		) {
			return;
		}

		this._clearTimeouts();

		// propagate minimize duration to confirm close window
		if ( this._cache.progress.close ) {
				var minimizeDuration = self.$confirmCloseWindow.window(
					"option", "durations.minimize"
				);

				self.$confirmCloseWindow
					.window( "option", "durations.minimize", quick
						? false
						: self.options.durations.minimize
					)
					.window( "minimize" )
					.window( "option", "durations.minimize", minimizeDuration );
		}

		if ( ! skipZIndexRevert ) {
			this._revertModalZIndexes();
		}

		// this class should be added before move moveToTop,
		// so next highest window could become active
		this.$elem
			.addClass( this.classes.windowMinimizing );
		// +
		if ( ! this._isMinimizeAllInProgress() && ! skipZIndexRevert ) {
			this._moveToTop({
				highest: true
			});
		}

		// moveToTop was not called when minimize all was in progress,
		// so classes has to be removed now
		if ( this._isMinimizeAllInProgress() || skipZIndexRevert ) {
			this.$elem.removeClass( this.classes.windowTop );
		}

		if ( skipZIndexRevert ) {
			this._revertModalZIndexes({
				$elem: this.$elem
			});
		}

		var props    = this._getButtonCoordinates(),
		    duration = quick
		    ? false
		    : parsedDuration || this.options.durations.minimize;

		this.$elem
			.stop( true, quick );

		this._blurActiveElement( true );
		this._cache.minimizing = true;
		this._interactionsState( false );

		var animation = {
			duration: duration,
			complete: function () {
				self._fixTitlebarTitleWidth();
				self._setContentHeight();
			},
			progress: function () {
				self._fixTitlebarTitleWidthDuringAnimation.apply(
					self, arguments
				);
				self._setContentHeight();
			},
			always: function () {
				self.$elem
					.hide()
					.addClass( self.classes.windowMinimized )
					.removeClass( self.classes.windowMinimizing );

				self._cache.minimizing = false;
				self._cache.minimized  = true;
				self._cache.shown      = false;

				self._destroyOverlay({
					justDestroy: true
				});

				var ui = {
					minimizeAllInProgress: self._isMinimizeAllInProgress()
				};

				if ( ! self._cache.suppressEvents ) {
					self._trigger( "minimize", {}, ui );
				}

				self._triggerInternal( "afterWindowAnimationStop" );
			}
		};

		this._hideOverlay();

		this._animate.call( this.$elem, props, animation );
	},

	// sets restored/maximized state
	_toggleMaximized: function( maximize, event ) {
		// toggle if no particular state was requested
		if ( typeof maximize === "undefined" ) {
			maximize = ! this.maximized();
		}

		var quick          = event === false,
		    parsedDuration = this._parseDuration( event ),
		    actionInverted = maximize ? "maximize"  : "restore",
		    action         = maximize ? "restore"   : "maximize",
		    state          = maximize ? "maximized" : "restored",
		    stateInverted  = maximize ? "restored" : "maximized",
		    beforeEvent    = "before" + this._ucFirst( actionInverted );

		var ui = {};

		// interaction is in progress, call this function on interaction end,
		// restore() could also be called during drag, in which case pass
		// the execution along
		if (
			 ! this._cache.progress.restoreMaximizedDraggable
			&& this._onInteractionEnd( action, event ) === true
		) {
			return;
		}

		var self              = this,
		    progress          = maximize ? "maximizing" : "restoring",
		    progressInverted  = maximize ? "restoring"  : "maximizing",
		    inProgress        =
		           action === "restore"  && this._cache.maximizing
		        || action === "maximize" && this._cache.restoring
		        || this._cache.minimizing
		        || this._cache.showing,
		    animationProgress = this._cache.animationProgress;

		if (
			   this._animationProgress()
			&& ! this._animationProgress( progressInverted )
			&& ! quick
		) {
			return;
		}

		// respect prevetion of "beforeRestore"/"beforeMaximize" event
		if (
			 ! this._cache.suppressEvents
			&& this._trigger( beforeEvent, {}, ui ) === false
		) {
			return;
		}

		// maximize or restore could be programatically called on minimized window
		if ( this._cache.minimized && ! this._cache.minimizing ) {
			this._cache.suppressEvents = true;

			this.$elem.removeClass( this.classes.windowMinimized );

			// cache current durations
			var durations = $.extend( true, {}, this.options.durations );
			// use false to skip animations
			this.options.durations = $.extend(
				true, {}, this._noAnimationDurations()
			);
			// now we're to use existing API to switch window into right state,
			// so let's show it, maximize or restore it, and minimize it again,
			// this way the last show called after durations has been reverted
			// acts like showing a maximized window
			this.show();

			if ( maximize ) {
				this.maximize();
			} else {
				this.restore();
			}

			this.minimize();

			this.$elem
				.addClass(
					maximize
						? this.classes.windowMaximizing
						: this.classes.windowRestoring
				);

			this.options.durations = durations;

			this.show( event );

			this._cache[ state ]         = true;
			this._cache[ stateInverted ] = false;

			this.$elem
				.removeClass( this.classes.windowShowing );

			this._cache.suppressEvents = false;

			this._trigger( maximize ? "maximize" : "restore", {}, {} );

			return;
		}

		this._cache.maximized = maximize;
		this._cache.restored  = !maximize;

		// this._cache.maximized = false;
		this._cache.minimized = false;

		this.$elem
			.find(
				"." + this.classes.uiDialogTitlebar +
				" ." + this.classes.uiButton
			)
			.removeClass( this.classes.uiStateHover );

		if ( ! maximize ) {
			this.$elem
				.removeClass( this.classes.windowMaximized );
		}

		this.$elem
			.stop( true, quick )
			.addClass( this.classes.window + "-" + progress );

		this._cache[ progress ]         = true;
		this._cache[ progressInverted ] = false;

		if (
			   this.$maximize
			&& this.$maximize.length
			&& this.$maximize.closest( this.uiDialogTitlebar ).length
		) {
			this._setButtonText({
				button: "maximize",
				label: action
			});

			this._setIcon({
				icon: action,
				button: "maximize"
			});
		}

		this._interactionsState( false );

		var props = maximize
			? this._cache.sizes.containment
			: this._cache.sizes.self;

		this._deleteBottomRight( props );

		// maximize or restore could be started in the middle of show or minimize,
		// so opacity is needed too
		props.opacity = 1;

		var duration = inProgress
			? this._speedUpAnimation( actionInverted, animationProgress )
			: this.options.durations[ actionInverted ];

		var animation = {
			duration: quick ? false : parsedDuration || duration,
			complete: function () {
				self._fixTitlebarTitleWidth();
				self._setContentHeight();
			},
			progress: function () {
				self._fixTitlebarTitleWidthDuringAnimation.apply(
					self, arguments
				);
				self._setContentHeight();
			},
			start: function () {
				self._cache.shown = true;
			},
			always: function () {
				self._cache[ progress ]         = false;
				self._cache[ progressInverted ] = false;
				self._cache[ state ]            = true;
				self._cache[ stateInverted ]    = false;

				self.$elem
					.removeClass( self.classes.window + "-" + progress )
					.toggleClass( self.classes.windowMaximized, maximize )
					// remove opacity, so it won't interfere with
					// minimize all button hover opacity change
					.css( "opacity" , "" );

				self._interactionsState( ! maximize );

				var ui = {};

				self._triggerInternal( "afterWindowAnimationStop" );

				self._fullPxPosition();

				if ( ! maximize && ! inProgress ) {
					self._setRestoreSize();
				}

				if ( ! self._cache.suppressEvents ) {
					self._trigger( actionInverted, {}, ui );
				}
			}
		};

		this._animate.call( this.$elem, props, animation );
		this._showOverlay();
	},

	// check is any animation is in progress,
	// or if specyfic animation is in progress
	// when it's name was passed
	_animationProgress: function ( key ) {
		if ( key ) {
			return this._cache[ key ];
		}

		return this._cache.showing
		    || this._cache.maximizing
		    || this._cache.minimizing
		    || this._cache.restoring;
	},

	// helper for quick changing window state
	_noAnimationDurations: function () {
		return  {
			maximize: false,
			minimize: false,
			show    : false,
			restore : false
		};
	},

	// titlebar buttons has to be enumerated,
	// because selectors will apply to attributes set here,
	// so they'll be in the right distance from the right widget edge
	_enumerateTitlebarButtons: function () {
		this.uiDialogTitlebar
			.children( "." + this.classes.uiButton )
			.removeAttr( "data-button-order" );

		this.uiDialogTitlebar
			.children(
				       "." + this.classes.uiButton
				+ ":not(." + this.classes.hidden + ")"
			)
			.each( function ( index ) {
				$( this ).attr( "data-button-order", index );
			});
	},

	_setConnectedButtonState: function () {
		// blur all window buttons
		$( "." + this.classes.taskbar + " ." + this.classes.taskbarWindowButton )
			.removeClass( this.classes.uiStateActive );

		// set active state to window button
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		var $button = this.$taskbar.taskbar( "button", this.$window );

		if ( $button.length ) {
			taskbar._setConnectedButtonState.call( $button[ 0 ], taskbar );
		}
	},

	_setWidth: function () {
		this._setDimension( "width" );
		this._setContentHeight();
	},

	_setHeight: function () {
		this._setDimension( "height" );
		this._setContentHeight();
	},

	// calculate dimensions, taking min/max/actual values
	// into account
	_setDimension: function ( name ) {
		var o               = this.options,
		    dimension       = o[ name ],
		    minKey          = "min" + this._ucFirst( name ),
		    maxKey          = "max" + this._ucFirst( name ),
		    min             = o[ minKey ],
		    current         = Math.round( parseFloat( this.$elem.css( name ) ) ),
		    containment     = this._cache.sizes.containment,
		    realContainment = this._getRealContainment();

		// auto width get natural content height,
		// measure it, and apply it if max or containment
		// are not lower
		if ( dimension === "auto" ) {
			this.$elem.css( name, "" );
			this.$window.css( maxKey, "" );

			current   = Math.round( parseFloat(
				window.getComputedStyle( this.$elem[ 0 ] )[ name ]
			));
		}

		dimension = this._cache.maximized
			? containment[ name ]
			: dimension === parseInt( dimension, 10 )
				? Math.max( min, dimension )
				: Math.max( min, current );


		if ( realContainment === "viewport" && containment ) {
			dimension = Math.round( Math.min( dimension, containment[ name ] ) );
		}

		this.$elem.css( name, dimension );
	},

	// sets icon to button
	_setIcon: function ( options ) {
		if ( typeof options.icon === "undefined" ) {
			options.icon = options.button;
		}

		this[ "$" + options.button ]
			.button(
				"option",
				"icons.primary",
				this.options.icons[ options.icon ]
			);

		this._addButtonClasses( this[ "$" + options.button ] );
	},

	// helper for refreshing all button icons
	_refreshButtonIcons: function () {
		this._setIcon({
			button: "close"
		});

		this._setIcon({
			button: "minimize"
		});

		this._setIcon({
			icon: this._cache.maximized ? "restore" : "maximize",
			button: "maximize"
		});
	},

	// sets labels for buttons
	_setButtonsTexts: function () {
		var self = this;

		$.each( this._titlebarButtons, function ( index, button ) {
			var $button = self[ "$" + button ];

			if (
				   $button
				&& $button.length
				&& $button.hasClass( self.classes.uiButton )
			) {
				self._setButtonText({
					button: button,
					// maximize/restore has custom label,
					// other buttons use their names as label keys
					label: button === "maximize"
						? self._cache.maximized
							? "maximize"
							: "restore"
						: undefined
				});
			}
		});
	},

	// set text to button, use label or button name as dictionary key
	_setButtonText: function ( options ) {
		this[ "$" + options.button ]
			.button(
				"option",
				"label",
				this._i18n( options.label || options.button )
			);

		this._addButtonClasses( this[ "$" + options.button ] );
	},

	// this classes is needed on button children, because taskbar inspects
	// window click event to check if it's being triggered on window or window
	// children, but the moment it happens, the original click target, in case
	// it's maximize/restore button, is detached, because of icon change,
	// so there's no way of finding it's parents, and some other way
	// of determining that this is part of window is required;
	// this class is the way do to it
	_addButtonClasses: function ( $button ) {
		$button
			.find(
				"." + this.classes.uiButtonIconPrimary +
				", ." + this.classes.uiButtonText
			)
			.addClass( this.classes.titlebarButtonIcon );
	},

	// set state (enabled/disabled) of user interaction
	_interactionsState: function( state ) {
		this._draggableState( state );
		this._resizableState( state );
	},

	// set interaction state or act as getter if first parameter isn't passed
	_interactionInProgress: function ( inProgress ) {
		// getter
		if ( typeof inProgress === "undefined" ) {
			return this._cache.progress.interaction;
		}

		// setter
		this._cache.progress.interaction = inProgress;

		// if draggable or resizable finished, check if
		// any action were requested during them, and fire them,
		if ( inProgress === false ) {
			var len = this._cache.onInteractionEnd.length;

			// iterate if there's anything to iterate over
			if ( len ) {
				for(var i = 0; i < len; i++ ) {
					var action = this._cache.onInteractionEnd[ i ];

					if ( $.inArray( action.action, [ "close", "destroy" ] ) > -1 ) {
						this[ action.action ]();

						// no more actions can be fired after close or destroy
						// has been fired
						break;
					}

					// fire action only if it was called with quick === true param,
					// or fire it if it is last action in queue
					if ( action.quick === false || i + 1 === len ) {
						this[ action.action ]( action.quick );
					}
				}

				// make this queue empty again
				this._cache.onInteractionEnd = [];
			}
		}
	},

	// add event to trigger after interaction finishes
	_onInteractionEnd: function( action, quick ) {
		if ( this._interactionInProgress() === true ) {
			this._cache.onInteractionEnd.push({
				action: action,
				quick : quick
			});

			return true;
		}
	},

	// set draggable widget state
	_draggableState: function ( state ) {
		if ( this.$elem.hasClass( this.classes.uiDraggable ) ) {
			// draggable is available anyway on fully maximized window with
			// "maximizedDraggable" option set to true, otherwise take
			// the passed param into account
			var maximizedDraggableAvailable = this.options.maximizedDraggable
				&& this._cache.maximized
				&& ! this._animationProgress(),
			    draggable = ( state || maximizedDraggableAvailable )
			    	&& this.options.draggable;

			this.$elem
				.draggable( draggable ? "enable" : "disable" );
		}

		this._removeClassDisabled();
	},

	_resizableState: function ( state ) {
		if ( this.$elem.hasClass( this.classes.uiResizable ) ) {
			this.$elem
				.resizable(
					state && this.options.resizable
						? "enable"
						: "disable"
				);
		}

		this._removeClassDisabled();
	},

	_clearTimeouts: function () {
		clearTimeout( this._cache.timeouts.closeWindowShow );
	},

	// on resizable and draggable, we only want the behaviour,
	// not the visual of widget's disabled state
	_removeClassDisabled: function () {
		this.$elem
			.removeClass( this.classes.uiStateDisabled );
	},

	_setRestoreSize: function () {
		// don't update size if window is maximized, maximizing,
		// minimized, or minimizing
		if ( ! this.maximized() && ! this.minimized() ) {
			var $e = this.$elem;

			// write the current window size and position along with
			// container size and position - it's required for calculations
			// later when taskbar position, number of taskbars
			// or window size changes
			this._cache.sizes = {
				self: this._getDimensions.call( $e, {
					position: true
				})
			};

			this._cache.sizes.diffs = {
				width : $e.outerWidth()  - $e.width(),
				height: $e.outerHeight() - $e.height()
			};

			this._refreshContainmentSize();
		}
	},

	_refreshContainmentSize: function () {
		this._cache.sizes.containment = this._getDimensions.call(
			this._getRealContainmentObject(), {
				position: true
			});

		this._refreshTaskbarMargins();

		// this allow maximize animation to go flawlessly
		this._cache.sizes.containment.width -= this._cache.sizes.diffs.width;
		this._cache.sizes.containment.height -= this._cache.sizes.diffs.height;
	},

	_refreshTaskbarMargins: function () {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		this._cache.sizes.margins = taskbar._getMaxTaskbarsMargins();
	},

	// get dimensions of element
	_getDimensions: function ( options ) {
		var $e = this;
		var position = $.extend( {},
			options && options.position ? $e.position() : $e.offset(),
			{
				width: options && options.outer ? $e.outerWidth() : $e.width(),
				height: options && options.outer ? $e.outerHeight() : $e.height(),
			}
		);

		position.bottom = position.height + position.top;
		position.right = position.width + position.left;

		return position;
	},

	// get the current offset of button this window if binded to,
	// so minimize/restore could have the right animation effect
	_getButtonCoordinates: function () {
		var $button = this.button(),
		    horizontal = this.$taskbar.hasClass( this.classes.taskbarHorizontal ),
		    dimensions = this._getDimensions.call( $button, {
		    	offset: true
		    });

		dimensions.top  -= $( window ).scrollTop();
		dimensions.left -= $( window ).scrollLeft();

		dimensions.opacity = 0;
		dimensions[ horizontal ? "height" : "width" ] = 0;

		var edge = this.$taskbar.data( this._cnst.dataPrefix + "taskbarEdge" );

		// this will minimize windows to the edge of the taskbar
		if ( edge === "top" ) {
			dimensions.top += this.$taskbar.height();
		}
		// this will minimize windows to the edge of the taskbar
		if ( edge === "left" ) {
			dimensions.left += this.$taskbar.width();
		}

		this._deleteBottomRight( dimensions );

		return dimensions;
	},

	// main function get refreshing window position
	_refreshPosition: function ( options ) {
		var self = this;

		options = options || {};

		if ( this._cache.minimized && ! this._cache.minimizing ) {
			return;
		}

		var currentContainment = this._getRealContainment();

		// refreshPosition is a time-consuming operation
		// skipOnFit let's skip the operation if window if withing containment
		// and the "containment" option value didn't change since last refresh,
		// and it's not "viewport", which is more restrict than "visible"
		if (
			   options
			&& options.skipOnFit
			&& currentContainment === this._cache.refreshPositionContainment
			&& currentContainment !== "viewport"
		) {
			var taskbar = this._getTaskbarInstance();

			if ( ! taskbar ) {
				return;
			}

			var containmentPosition = taskbar._extendedPosition.call(
				taskbar.$windowsContainment, "offset"
			);
			var windowPosition      = taskbar._extendedPosition.call(
				this.$elem, "offset"
			);

			if (
				   windowPosition.right  <= containmentPosition.right
				&& windowPosition.bottom <= containmentPosition.bottom
				&& windowPosition.top    >= containmentPosition.top
				&& windowPosition.left   >= containmentPosition.left
			 ) {
				return;
			}
		}

		// interaction is in progress, call this function on interaction end
		if ( this._animationProgress() ) {
			this._bindInternal( "afterWindowAnimationStop", function () {
				self.refreshPosition();
			});

			return;
		}

		this._cache.progress.refreshPosition = true;

		this.$elem.stop( true, true );

		this._refreshContainmentSize();
		this._setContainment();

		var c = this._cache.sizes.containment,
			e = this._cache.sizes.self;

		// maximized window should stretch to container and that's it
		if ( this.maximized() ) {
			this.$elem.css( c );
		}

		if ( this.$windowOverlay && this.$windowOverlay.length ) {
			// refresh existing overlays
			if ( this.$windowOverlay.hasClass( this.classes.contentOverlay ) ) {
				this._placeOverlay({
					content: true
				});
			} else {
				this._placeOverlay({
					window: true
				});
			}
		}

		// cache containment really used by this function
		this._cache.refreshPositionContainment = currentContainment;

		if ( this._cache.refreshPositionContainment === "visible" ) {
			this._setWidth();
			this._setHeight();

			this._moveIntoView();

			this._setRestoreSize();

			this._cache.progress.refreshPosition = false;

			this._refreshPositionOption();

			return;
		}

		e.width  = Math.min( e.width,  c.width );
		e.height = Math.min( e.height, c.height );

		var wasntRestored = false,
		    wasMaximized  = this.maximized(),
		    wasMinimized  = this.minimized(),
		    durations;

		if ( wasMaximized || wasMinimized ) {
			wasntRestored = true;

			this._cache.suppressEvents = true;

			durations = $.extend( true, {}, this.options.durations );

			this.options.durations = $.extend(
				true, {}, this._noAnimationDurations()
			);
			this.restore();
		}

		this._setRestoreSize();

		e = this._fixPosition( e );
		e = this._roundObj( e );

		$.extend( this._cache.sizes.self, e );

		this.$elem.css( e );

		this._setWidth();
		this._setHeight();

		this._setRestoreSize();

		if ( wasMaximized ) {
			this.maximize();
		}

		if ( wasMinimized ) {
			this.minimize();
		}

		if ( wasntRestored ) {
			this.options.durations = durations;
			this._cache.suppressEvents = false;
		}

		this._moveIntoView();
		this._fixTitlebarTitleWidth();
		this._setContentHeight();

		this._setRestoreSize();

		this._refreshPositionOption();

		this._cache.progress.refreshPosition = false;

		return this;
	},

	// this function will calculate window position
	// for "containment": "visible", and optionally apply
	// calculated values to widget
	_bringIntoView: function ( options ) {
		var $title = this.$title;
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		var td = taskbar._extendedPosition.call( this.$title, "offset" );
		var cd = taskbar._extendedPosition.call(
			this._getRealContainmentObject(), "offset"
		);
		var ed = taskbar._extendedPosition.call( this.$elem );
		var r  = this._bringIntoViewReserve();

		var tp =  window.getComputedStyle( this.$title[ 0 ] );

		var diffs = {}, realDiffs = {};

		realDiffs.top    = ( cd.top    - ( td.bottom - r ) ) * -1;
		realDiffs.bottom =   cd.bottom - ( td.top    + r )       ;
		realDiffs.left   = ( cd.left   - ( td.right  - r ) ) * -1;
		realDiffs.right  =   cd.right  - ( td.left   + r )       ;

		if ( options && options.round ) {
			realDiffs.top    = Math.round( realDiffs.top    );
			realDiffs.bottom = Math.round( realDiffs.bottom );
			realDiffs.left   = Math.round( realDiffs.left   );
			realDiffs.right  = Math.round( realDiffs.right  );
		}

		diffs.top    = Math.min( realDiffs.top   , 0 );
		diffs.bottom = Math.min( realDiffs.bottom, 0 );
		diffs.left   = Math.min( realDiffs.left  , 0 );
		diffs.right  = Math.min( realDiffs.right , 0 );

		if ( options && options.diffs ) {
			return diffs;
		}

		if ( options && options.move ) {
			var css   = {};
			css.top   = ed.top;
			css.left  = ed.left;
			css.top  -= diffs.top;
			css.top  += diffs.bottom;
			css.left -= diffs.left;
			css.left += diffs.right;
			css = this._roundObj( css );
			this.$elem.css( css );
		}
	},

	_fixPosition: function ( e ) {
		this._refreshContainmentSize();

		var realContainment = this._getRealContainment(),
		    c               = this._cache.sizes.containment,
		    e               = e || $.extend( {}, this._cache.sizes.self ),
		    self            = this;

		this._deleteBottomRight( e );

		// itterate over pair of top/left and height/width properties
		$.each( [
			{ edge: "top",  dimension: "height" },
			{ edge: "left", dimension: "width" }
			], function ( index, set ) {
			if ( realContainment === "viewport" ) {
				// constraint window to viewport: if it's over top/left edge,
				// correct that, and if it's wider/higher than containment,
				// correct that to match containment dimensions
				if (
					e[ set.edge ] !== (
						e[ set.edge ] =
						Math.max( e [ set.edge ], c[ set.edge ] ) )
					) {
					e[ set.dimension ] = Math.min(
						e[ set.dimension ], c[ set.dimension ]
					);
				}

				// constraint window to viewport: if it's over bottom/right edge,
				// calculate diff, then if diff is greater than top/left value,
				// extract it from top/left value, otherwise extract diff from
				// top/left value, then extract edge value from dimensions value
				if ( e[ set.edge ] + e[ set.dimension ]
					> c[ set.edge ] + c[ set.dimension ] ) {
					var diff = ( e[ set.edge ] + e[ set.dimension ] )
						- ( c[ set.edge ] + c[ set.dimension ] );
					if ( e[ set.edge ] >= diff ) {
						e[ set.edge ] -= diff;
					} else {
						e[ set.edge ] -= diff;
						e[ set.dimension ] -= Math.abs( e[ set.edge ] );
						e[ set.edge ] = 0;
					}
				}
			}

			var min = "min" + self._ucFirst( set.dimension );
			var max = "max" + self._ucFirst( set.dimension );

			// if current height/width is lower than minHeight/minWidth,
			// set width/height as high as possible
			if ( self.options[ min ] > e[ set.dimension ] ) {
				e[ set.dimension ] = Math.min(
					self.options[ min], c[ set.dimension ]
				);
			}
		});

		return e;
	},

	_deleteBottomRight: function( obj ) {
		// delete those two: we like to pass this object to jQuery css function,
		// and having both top/left and bottom/right set explicitly
		// does not work well with box-sizing: content-box, and probably
		// isn't good idea anyway, since we always use top/left/width/height
		// for all calculations anyway
		delete obj.bottom;
		delete obj.right;
	},

	// find by how much should the tolerance by for draggable
	// handle visibility, based on titlebar font-size
	_bringIntoViewReserve: function () {
		return parseInt(
			this.uiDialogTitlebar
				.find( "." + this.classes.uiDialogTitle )
				.css( "fontSize" ),
			10
		);
	},

	_moveIntoView: function () {
		this._bringIntoView({
			move: true
		});
	},

	// helper for rounding all values in a given object,
	// if they are roundable
	_roundObj: function ( obj ) {
		if ( typeof obj === "object" ) {
			$.each( obj, function ( index, elem ) {
				if ( ! isNaN( parseInt( elem ), 10 ) ) {
					obj[ index ] = Math.round( parseFloat( elem ) );
				}
			});
		}

		return obj;
	},

	// round css properties responsible for size and position,
	// optionally only those passed as argument,
	// not having full pixels causes hard to mantain behaviours,
	// so widget and window properties should always be rounded,
	// when they are changed
	_fullPxPosition: function ( props ) {
		var self = this;

		$.each( props || [ "top", "left", "width", "height" ],
		function ( index, pos ) {
			self.$elem.css( pos, Math.round(
				parseFloat( self.$elem.css( pos ) )
			));
		});
	},

	// sets calculated width of titlebar,
	// this function is usually called during resize and animations
	// todo
	_fixTitlebarTitleWidth: function() {
		var $lastButton = this.$elem.find(
				   "." + this.classes.uiDialogTitlebar
				+ " ." + this.classes.uiButton + ":last"
			),
		    $lastButtonPrev = $lastButton.prev( "." + this.classes.uiButton );

		if ( ! $lastButton.length || ! $lastButtonPrev.length ) {
			return;
		}

		var $title      = this.$elem.find( "." + this.classes.uiDialogTitle ),
		    space = $lastButtonPrev.offset().left
			- $lastButton.offset().left
			- $lastButton.outerWidth();

		$title.css(
			"width",
			$lastButton.offset().left - $title.offset().left - space
		);
	},

	_fixTitlebarTitleWidthDuringAnimation: function () {
		if ( typeof( arguments[ 1 ] ) == "number" ) {
			this._cache.animationProgress = arguments[ 1 ];
		}
		this._fixTitlebarTitleWidth();
	},

	_setWindowIcon: function() {
		var $icon = this.$elem.find( "." + this.classes.icon );

		if ( $icon.length && this.options.icons.main === null ) {
			$icon.remove();
		}

		this.uiDialogTitlebar.removeClass( this.classes.titlebarIcon );

		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		var $button = taskbar.$elem
			.find( "[data-window-id=" + this.$window[ 0 ].id + "]" );

		taskbar._refreshWindowButtonIcon.call( $button, taskbar );

		if ( this.options.icons.main === null ) {
			return;
		}

		this.uiDialogTitlebar.addClass( this.classes.titlebarIcon );

		if ( ! $icon.length ) {
			$icon = $( "<span></span>" )
				.prependTo( this.uiDialogTitlebar );
		}

		$icon
			.removeAttr( "class" )
			.addClass(
				        this.classes.uiIcon
				+ " " + this.classes.icon
				+ " " + this.options.icons.main
			);
	},

	_setContentHeight: function () {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		this.$window.css({
			height: "auto",
			maxHeight: ""
		});

		var e = taskbar._extendedPosition.call( this.$elem, "offset" );
		var w = taskbar._extendedPosition.call( this.$window, "offset" );

		var maxHeight = Math.round(
			e.bottom
			- w.top
			- parseFloat( this.$window.css( "borderBottomWidth") )
			- parseFloat( this.$window.css( "paddingTop" ) )
			- parseFloat( this.$window.css( "paddingBottom" ) )
		);

		if (
			   this.uiDialogButtonPane.length
			&& this.uiDialogButtonPane.children().length
		) {
			maxHeight -= this.uiDialogButtonPane.outerHeight();
		}

		this.$window.css( "maxHeight", maxHeight );
	},

	_createTitleForEmpty: function () {
		if ( this._hasTaskbar() ) {
			if ( this.options.title === null ) {
				var $containment = this.$taskbar
					.data( this._cnst.dataPrefix + "taskbar" )
					.$windowsContainment;

				var newWindowsCount = $containment
					.data( this._cnst.dataPrefix + "taskbarNewWindowsCount" ) || 0;

				var number = typeof this._cache.newWindowNumber === "number"
					? this._cache.newWindowNumber
					: ++newWindowsCount;

				this._cache.newWindowNumber = number;
				this._setNewWindowTitle( number );

				$containment.data(
					this._cnst.dataPrefix + "taskbarNewWindowsCount",
					newWindowsCount
				);
			}
		}
	},

	_title: function () {
		if ( this.options.titleLocalized ) {
			if ( this._i18n( this.options.titleLocalized ) ) {
				this._setTitle( this._i18n( this.options.titleLocalized ) );
			} else {
				this._setTitle( this._cache.title );

				var taskbar = this._getTaskbarInstance();

				this._debugLogAdd(
					"Missing translation for window title " +
					"with key \"" + this.options.titleLocalized
					+ "\" in language \"" + taskbar.options.language + "\".",
					2, 1
				);
			}
		} else {
			// null === createTitleForEmpty set the title already
			if ( this._cache.title !== null ) {
				this._setTitle( this._cache.title );
			}
		}
	},

	_setNewWindowTitle: function ( number ) {
		this._setTitle( number === 1
			? this._i18n( "newWindow" )
			: this._i18n( "newWindowNext", {
				counter: number
			}));
	},

	_setTitle: function ( title ) {
		if ( ! arguments.length ) {
			title = this._cache.realTitle;
		}

		this._cache.realTitle = title;

		if ( this.uiDialogTitlebar ) {
			var $title = this.uiDialogTitlebar
				.find("." + this.classes.uiDialogTitle );

			if ( ! this._cache.realTitle ) {
				$title.html( "&#160;" );
			} else {
				$title.text( this._cache.realTitle );
			}
		}

		this._setConnectedButtonTitle();
	},

	_setConnectedButtonTitle: function() {
		var title = this._cache.realTitle,
		    taskbar = this._getTaskbarInstance(),
		    $button;

		if ( ! taskbar ) {
			return;
		}

		try {
			$button = this.$taskbar.taskbar( "button", this.$window );
		} catch ( e ) {
			// there are no button yet, so it's too soon to set title
			// (it's set upon window button creation)
			return;
		}

		if ( $button.attr( "data-group-name" ) ) {
			var $menuItem = taskbar.connectedElement( $button )
				.filter( "." + this.classes.uiMenu )
				.find( "[data-window-id=\"" + this.$window[ 0 ].id + "\"]");

			taskbar._refreshWindowButtonIcon.call( $menuItem, taskbar );
		} else {
			taskbar._buttonSetTitle.call(
				$button, title, this._getTaskbarInstance()
			);
		}
	},

	_cacheTitle: function ( title ) {
		this._cache.title = title;
	},

	_focusTabbable: function( options ) {
		$( document.activeElement ).blur();
		this._super();
		this._blurActiveElement();
	},

	_sortByZIndex: function ( $elems, order, dataType ) {
		var windows = [];

		// so windows with removed zIndex won't be skipper
		var c = this._cnst.lowestPossibleZIndex;

		$elems
			.each( function () {
			// we either have numeric zIndex or use faked zIndex
			var zIndex = parseInt( $( this ).css( "zIndex" ), 10 ) || ++c;

			windows.push( [ zIndex, $( this ) ] );
		});

		// sort windows by zIndex
		windows.sort( function ( a, b ) {
			return order === "asc" ? a[ 0 ] - b[ 0 ] : b[ 0 ] - a[ 0 ];
		});

		if ( dataType === "raw" ) {
			return windows;
		}

		var $set = $();

		$.each( windows, function ( index, $elem ) {
			$set = $set.add ( $elem[ 1 ] );
		});

		return $set;
	},

	// set  z-indexes to element that should be covered and should not
	// be covered by modal overlay
	_setModalZIndexes: function () {
		this.$elem.removeClass( this.classes.modal );

		if ( !this.options.modal ) {
			return;
		}

		var self = this;

		this.$elem.addClass( this.classes.modal );

		var modalOverlay = this.options.modalOverlay,
		    zIndex       = this._cnst.lowestPossibleZIndex,
		    isNot        = false,
		    $setCover   = $(),
		    $setNoCover = $(),
		    $taskbars   = $( "." + this.classes.taskbar ),
		    $windows    = $( "." + this.classes.window );

		if ( modalOverlay === "all" ) {
			$setCover = $setCover
				.add( $taskbars )
				.add( $windows );

			$setNoCover = $();
		} else if ( modalOverlay === "viewport" ) {
			$setCover = $setCover
				.add( $windows );

			$setNoCover = $setNoCover.add( $taskbars );
		} else if ( modalOverlay instanceof $ ) {
			$setCover = $setCover
				.add( $taskbars )
				.add( $windows )
				.not( modalOverlay );

			$setNoCover = modalOverlay;
		} else {
			return;
		}

		$setCover = $setCover
			.not( this.$elem )
			.not( "." + this.classes.modal + "." + this.classes.windowTop );

		$setNoCover = $setNoCover
			.not( this.$elem )
			.not( "." + this.classes.modal + "." + this.classes.windowTop );

		var ui = {};

		ui.$setCover   = $setCover;
		ui.$setNoCover = $setNoCover;

		this._trigger( "modalOverlaySetsCreated", {}, ui );

		$setCover   = ui.$setCover;
		$setNoCover = ui.$setNoCover;

		var set = function ( covered ) {
			var $this = $( this ),
			    selfZIndex = parseInt( $this.css( "zIndex" ), 10 );

			zIndex = Math.max( selfZIndex, zIndex );

			var inlineZIndex = self._hasInlineProperty( $this, "z-index" );

			var className = covered
				? self.classes.coveredByOverlay + self.uuid
				: self.classes.notCoveredByOverlay + self.uuid;

			if ( ! $this.hasClass( className ) ) {
				$this
					.data(
						self._cnst.dataPrefix + "previousZIndex" + self.uuid,
						selfZIndex
					)
					.data(
						self._cnst.dataPrefix + "inlineZIndex" + self.uuid,
						inlineZIndex
					)
					.addClass( className );
			}
		};

		if ( $setCover.length ) {
			$setCover.each( function () {
				set.call( this, true );
			});

			$setCover = this._sortByZIndex( $setCover, "desc" );

			var zIndexDown = zIndex;

			$setCover.each( function () {
				$( this ).css( "zIndex", --zIndexDown );
			});
		}

		this.$overlaySet = $setCover;

		if ( ! this.overlay ) {
			this._createOverlay();
			this._hideOverlay( false );
		}

		if ( zIndex === this._cnst.lowestPossibleZIndex ) {
			zIndex = parseInt( this.$elem.css( "zIndex" ), 10 );
		}

		this._cache.modalOverlayZIndex = ++zIndex;

		this.overlay.css( "zIndex", this._cache.modalOverlayZIndex );

		if ( $setNoCover.length ) {
			$setNoCover.each( function () {
				set.call( this, false );
			});

			$setNoCover = this._sortByZIndex( $setNoCover, "asc" );

			$setNoCover.each( function () {
				$( this ).css( "zIndex", ++zIndex );
			});
		}

		this.$elem.css( "zIndex", ++zIndex );
	},

	_modalZIndexes: function ( options ) {
		if ( ! options || options.revertActive !== false ) {
			this._revertActiveModalZIndexes();
		}
		this._revertModalZIndexes();
		this._setModalZIndexes();
	},

	_revertModalZIndexes: function ( force ) {
		if ( ! this.options.modal ) {
			return;
		}

		var options = {};

		if ( typeof force === "object" ) {
			options = force;
			force = !! options.force;
		}

		var self = this;

		var revert = function () {
			var $this        = $( this );

			if (
				   $this.hasClass( self.classes.modal )
				&& $this.hasClass( self.classes.windowTop ) && ! force
			) {
				return true;
			}

			var zIndex       = $this.data(
			    	self._cnst.dataPrefix + "previousZIndex" + self.uuid
			    ),
			    inlineZIndex = $this.data(
			    	self._cnst.dataPrefix + "inlineZIndex" + self.uuid
			    ),
			    revertZIndex = inlineZIndex ? zIndex : "";

			$this
				.removeData( self._cnst.dataPrefix + "previousZIndex" + self.uuid )
				.removeData( self._cnst.dataPrefix + "inlineZIndex" + self.uuid )
				.removeClass( self.classes.coveredByOverlay + self.uuid )
				.removeClass( self.classes.notCoveredByOverlay + self.uuid )
				.css( "zIndex", revertZIndex );
		};

		if ( options.$elem ) {
			$( options.$elem ).each( revert );

			return;
		}

		$( "." + this.classes.coveredByOverlay + this.uuid ).each( revert );
		$( "." + this.classes.notCoveredByOverlay + this.uuid ).each( revert );
	},

	_revertActiveModalZIndexes: function () {
		var $activeModals = this._getAllModals();

		var self = this;

		if ( $activeModals.length ) {
			$activeModals
				.children( "." + this.classes.windowContent )
				.each( function () {
					var $this = $( this );

					var instance = $this.data( self._cnst.dataPrefix + "window" );

					instance._revertModalZIndexes({
						force: true
					});
				});
		}
	},

	// if modal was on top, keep it there
	_setTopModalState: function ( $elem ) {
		var $modal = this._getActiveModal();

		if ( this.options.modal ) {
			$modal = $modal.add( this.$elem );
		}

		$modal = $modal.filter( "." + this.classes.windowTop );

		if (
			$modal.length
			&& ( ! $elem || $modal.attr( "id" ) !== $elem.attr( "id" ) )
		) {
			$modal
				.children( "." + this.classes.windowContent )
				.window( "moveToTop", null, true );
		}
	},

	_getActiveModal: function () {
		return $( "." + this.classes.modal )
			.not( "." + this.classes.windowMinimizing + ":visible" )
			.not( this.$elem );
	},

	_getAllModals: function () {
		return $( "." + this.classes.modal )
			.not( this.$elem );
	},

	_minimizeOtherModals: function ( options ) {
		if ( ! this.options.modal ) {
			return;
		}

		var self = this;

		// there could be only one modal present
		// - if there is already modal opened and it's not this window,
		// minimize it
		var $modal = this._getActiveModal();

		if ( $modal.length ) {
			$modal.each( function () {
				var $window = $( this ).children( "." + self.classes.windowContent );

				// force minimize window
				var minimize = $window.window( "option", "durations.minimize" );

				$window.window( "option", "durations.minimize", false )
					.window( "minimize", options )
					.window( "option", "durations.minimize", minimize );
			});
		}
	},

	_isMinimizeAllInProgress: function () {
		return !! this._getTaskbarInstance()
			.$windowsContainment
			.data( this._cnst.dataPrefix + "minimizeAllInProgress" );
	},

	_hideTaskbarsSubordinates: function () {
		$( "." + this.classes.taskbar ).taskbar( "hideSubordinates" );
	},

	_createOverlay: function() {
		if ( this.overlay || ! this.options.modal ) {
			return;
		}

		this._super();

		var self = this;

		// mimics
		// github.com/jquery/jquery-ui/commit/55360eeb7eae5c560d51b09178e64d83c59223a6
		if ( this._versionOf( "dialog", "==", "1.10.0" ) ) {
			this.overlay
				.appendTo( this._appendTo() );
		}

		this.overlay
			.addClass( this.classes.dialogOverlay )
			.css( "zIndex", this._cache.modalOverlayZIndex )
			.attr( "data-taskbar-uuid", this._getTaskbarInstance().uuid )
			.attr( "data-window-uuid", this.uuid )
			.on(
				"click." + this._cache.uep +
				" dblclick." + this._cache.uep,
				function ( event ) {
				if ( self.options.minimizable ) {
					self.minimize( event.type === "dblclick" ? false : undefined );
				}
			});
	},

	_destroyOverlay: function ( options ) {
		var justDestroy = options && options.justDestroy;

		if ( ! this.overlay ) {
			return;
		}

		this.overlay.stop( true, true );

		if ( this.options.modal && ! justDestroy ) {
			this._revertModalZIndexes({
				force: true
			});
		}

		this._super();

		// jQuery UI 1.10.0 fix
		if ( this.overlay && this.overlay.length ) {
			this.overlay = null;
		}
	},

	_showOverlay: function () {
		if ( ! this.options.modal || ! this.overlay ) {
			return;
		}

		var self = this;

		var opacity = this
			._getTaskbarInstance()
			._styleIndicator( this.classes.uiWidgetOverlay, "opacity" )
			.opacity;

		this.overlay
			.show()
			.stop( false, true );

		var props = {
			opacity: opacity
		};

		var animation = {
			duration: this.options.durations.show
		};

		this._animate.call( this.overlay, props, animation );
	},

	_hideOverlay: function ( quick ) {
		if ( !this.options.modal ) {
			return;
		}

		var self = this;

		if ( ! this.overlay ) {
			return;
		}

		this.overlay.stop( true, true );

		var props = {
			opacity: 0
		};

		var animation = {
			duration: typeof quick !== "undefined"
				? quick
				: this.options.durations.minimize,
			always: function () {
				if ( self.overlay ) {
					self.overlay.hide();
				}
			}
		};

		this._animate.call( this.overlay, props, animation );
	},

	_placeOverlay: function ( options ) {
		options = options || {};

		this.$elem.find(
			  "." + this.classes.windowOverlay
			+ ":not(." + this.classes.bodyOverlay + ")"
		).remove();

		this.$elem.removeClass( this.classes.contentOverlayed );
		this.$windowOverlay = null;

		if ( options && options.window === "auto" ) {
			options.window = this.$elem.hasClass( this.classes.bodyOverlay );
		}

		var self = this;

		if ( options && options.destroy ) {
			if ( options.window ) {
				this.$elem
					.removeClass( this.classes.bodyOverlayed )
					.find( "." + this.classes.windowOverlay )
					.remove();
			}

			return;
		}

		options.content =
			( this.options.embeddedContent || options.content )
			&& ( ! options || ! options.window );

		if ( this.$elem.hasClass( this.classes.windowTop ) && options.content ) {
			return;
		}

		// can't have focused elements under the overlay
		this._blurActiveElement();

		if ( ! options.content && options.destroy ) {
			return;
		}

		if ( options.content || options.window ) {
			// return if window overlay is already present and content overlay is about to be set
			if (
				   this.$elem.find( "." + this.classes.bodyOverlay ).length
				&& ( ! options || ! options.window )
			) {
				return;
			}

			this.$windowOverlay = $( "<div></div>")
				.addClass(
					        this.classes.windowOverlay
					+ " " + this.classes.uiWidgetOverlay
				)
				.addClass(
					options.content
						? this.classes.contentOverlay
						: this.classes.bodyOverlay
				);

			this.$elem
				.find(  "." + this.classes.windowOverlay )
				.remove();

			this.$elem.prepend( this.$windowOverlay );


			this.$elem.addClass(
				options.content
					? this.classes.contentOverlayed
					: this.classes.bodyOverlayed
			);
		}

		if ( options.content ) {
			this.$windowOverlay
				.on( "mousedown." + this._cache.uep, function( event ) {
					self._clearTrigger( event );
				});
		}

		if ( options.window ) {
			// show confirm close window when user tries to moveToTop
			// window with confirm close in progress
			this.$windowOverlay
				.off( "mousedown." + this._cache.uep )
				.on( "mousedown." + this._cache.uep, function () {
					if (
						   self._cache.progress.close
						&& self.$confirmCloseWindow.length
					) {
						self.$confirmCloseWindow.window( "show" );
					}
				});
		}
	},

	_preventGlobalWindowClick: function () {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		// number of global clicks to block equals number of taskbar instances
		var current = taskbar.$windowsContainment
			.data( this._cnst.dataPrefix + "taskbars" ) || 0;

		var prev = taskbar.$windowsContainment
			.data( this._cnst.dataPrefix + "preventClicks" ) || 0;

		this._cache.taskbarsOnClickPrevention = current;

		taskbar.$windowsContainment
			.data( this._cnst.dataPrefix + "preventClicks", current + prev );
	},

	_revertGlobalWindowClick: function () {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		var prev = taskbar.$windowsContainment
			.data( this._cnst.dataPrefix + "preventClicks" );

		var current = this._cache.taskbarsOnClickPrevention;

		var newClicks = Math.max( prev - current, 0 );

		taskbar.$windowsContainment
			.data( this._cnst.dataPrefix + "preventClicks", newClicks );
	},

	_createButtons: function () {
		this._super();

		var self = this;

		if ( this.uiDialog.hasClass( this.classes.uiDialogButtons ) ) {
			var iteration = 0;

			$.each( this.options.buttons, function ( index, button ) {
				var textLocalized;

				if ( button.textLocalized ) {
					textLocalized = self._i18n( button.textLocalized );

					if ( textLocalized !== "undefined" ) {
						$(
							"." + self.classes.uiButton +
							":eq(" + iteration + ")",
							self.uiDialogButtonPane
						).button({
							label: textLocalized
						});
					}
				}

				if (
					 ( ! button.textLocalized || textLocalized === "undefined" )
					&& ! button.text
					&& ! isNaN( parseInt( index ) )
				) {
					self._debugLogAdd(
						"No text or textLocalized providen " +
						"for button \"" + index + "\".", 2, 1
					);
				}

				++iteration;
			});
		}
	},

	_setMinimizableMaximizableClasses: function () {
		this.$elem.toggleClass(
			this.classes.unminimizable,
			this.options.minimizable === false
		);
		this.$elem.toggleClass(
			this.classes.unmaximizable,
			this.options.maximizable === false
		);
	},

	_languageChange: function () {
		this._createTitleForEmpty();
		this._title();

		this._propagateConfirmCloseOptions({
			confirmClose: {},
			title       : null
		});

		// refresh titlebar buttons texts
		this._setButtonsTexts();

		// refresh buttonset button's labels
		this._createButtons();
	},

	_size: function () {
		// mimics
		// github.com/jquery/jquery-ui/commit/62cda1f95d0e7040153f0b5fe5745d199a0a094e
		if ( this._versionOf( "dialog", "==", "1.10.0" ) ) {
			this._isOpen = true;
		}

		this._super();
	},

	_debugLogAdd: function( msg, level, type ) {
		var taskbar = this._getTaskbarInstance();

		if ( taskbar ) {
			taskbar._consolePrefix( this.$window[ 0 ].id, "window" );
			taskbar._debugLogAdd( msg, level, type );
			taskbar._consolePrefix( true );
		}
	},

	_hasInlineProperty: function ( $elem, property ) {
		var style = $elem.prop( "style" );

		for ( var prop in style ) {
			if( style.hasOwnProperty( prop ) && style[ prop ] === property ) {
				return true;
			}
		}

		return false;
	},

	_clearTrigger: function ( event ) {
		var taskbar = this._getTaskbarInstance();

		if ( ! taskbar ) {
			return;
		}

		$( window ).trigger( "click." + taskbar._cache.uep, event );
	},

	_blurActiveElement: function ( any ) {
		var element = this.document[ 0 ].activeElement,
		    wrapper = this.bindings[ 0 ];

		// if no other focusable element is present inside of the dialog,
		// focus is set to the close button; let's revert this, because windows
		// are intended to be longer-living than dialogs and close should not be
		// the default action; optionally, passing any as true will blur
		// any active element inside this window
		if (
			  any && ( $.contains( wrapper, element ) || element === wrapper )
			||
			! any && element === this.uiDialogTitlebarClose[ 0 ]
		) {
			$( element ).blur();
		}
	},

	_ucFirst: function ( string ) {
		return string[ 0 ].toUpperCase() + string.slice( 1 );
	},

	// test if particular widget from jQuery UI is in given version;
	// used in deciding behaviour/hacks/flow
	_versionOf: function ( widget, operator, compare ) {
		return $.simone.taskbar.prototype._versionOf
			.call( null, widget, operator, compare );
	},

	_parseDuration: function ( speed ) {
		// copied from _normalizeArguments function of jQuery UI effects
		return typeof speed === "number"
			? speed
			: speed in $.fx.speeds
				? $.fx.speeds[ speed ]
				: undefined;
	},

	_trigger: function ( name, event, ui ) {
		// don't trigger dialog inherited event "open"
		if ( name === "open" ) {
			return;
		}

		// trigger create after window was fully created, not mid-way,
		// (default widget factory behaviour)
		if ( name === "create" && ! this._cache.initialized ) {
			return;
		}

		// extend ui by useful information
		$.extend ( ui, {
			instance: this,
			$widget : this.$elem,
			$window : this.$window,
		});

		// "taskbarNotFound" carries those properties,
		// also when it's triggered, they cannot be obtained the usual way
		if ( name !== "taskbarNotFound" ) {
			$.extend ( ui, {
				taskbar : this._getTaskbarInstance(),
				$taskbar: this.$taskbar
			});
		}

		return this._super( name, event, ui );
	},

	/* public methods */
	button: function () {
		var taskbar = this._getTaskbarInstance();

		if ( taskbar ) {
			return taskbar.button( this.$window );
		}

		return $();
	},

	close: function ( event ) {
		this._close( event );
	},

	confirmCloseWindow: function () {
		return this.$confirmCloseWindow;
	},

	containment: function () {
		return this._getRealContainment();
	},

	maximize: function ( event ) {
		this._toggleMaximized( true, event );
	},

	maximized: function () {
		return this._cache.maximized && ! this._cache.maximizing;
	},

	maximizing: function () {
		return this._cache.maximizing;
	},

	minimize: function ( event ) {
		this._minimize( event );
	},

	minimized: function () {
		return this._cache.minimized && ! this._cache.minimizing;
	},

	minimizing: function () {
		return this._cache.minimizing;
	},

	modalOverlay: function () {
		return this.overlay || $();
	},

	moveToTop: function ( settings, silent ) {
		this._moveToTop( settings, silent );
	},

	open: function ( event ) {
		if ( this._cache.initialized ) {
			this._debugLogAdd(
				"Method \"open\" is an alias for method \"show\"."
				+ " Use method \"show\" instead.", 2, 2
			);
			this.show( event );
		} else {
			this._super();
		}
	},

	refreshPosition: function( options ) {
		this._refreshPosition( options );
	},

	restore: function ( quick ) {
		this._toggleMaximized( false, quick );
	},

	restored: function () {
		return this.shown() && ! this.maximized();
	},

	restoring: function () {
		return this._cache.restoring;
	},

	shown: function () {
		return this.$elem.is( ":visible" ) && ! this._animationProgress();
	},

	showing: function () {
		return this._cache.showing;
	},

	taskbar: function () {
		return this.$taskbar;
	},

	title: function () {
		return this._cache.realTitle;
	},

	_checkForInvalidOptions: function ( options, key, initialization ) {
		var taskbar = this._getTaskbarInstance();

		if ( taskbar ) {
			taskbar._consolePrefix( this.$window[ 0 ].id, "window" );
			taskbar._checkForInvalidOptions( options, key, initialization );
			taskbar._consolePrefix( true );
		}
	},

	_setOptions: function( options ) {
		var self             = this,
		    o                = this.options,
		    resize           = false,
		    refreshPosition  = false,
		    resizableOptions = {};

		$.each( options, function( key, value ) {
			self._setOption( key, value );

			if ( key in self.sizeRelatedOptions ) {
				// dont use dialog resize with widht and height
				// - window's setHeight and setWidth will be used
				if ( $.inArray( key, self._cnst.dimensions ) === -1 ) {
					resize = true;
				} else {
					self.options[ key ] = value =
						Math.max(
							value,
							self.options[ "min" + self._ucFirst( key ) ]
						);
				}

				refreshPosition = true;
			}

			if ( key in self.resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
			this._position();
		}

		if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}

		if ( refreshPosition ) {
			this._setWidth();
			this._setHeight();
			this.refreshPosition();
		}
	},

	_setOption: function ( key, value ) {
		var prev = $.extend( true, {}, this.options[ key ] );

		this._checkForInvalidOptions( $.simone.window.prototype.options, key );

		if ( key === "title" ) {
			this._cacheTitle( value );

		} else if ( key === "taskbar" ) {
			this._taskbarUnbind();

		} else if ( key === "modal" || key === "modalOverlay" ) {
			this._revertModalZIndexes({
				force: true
			});
			this._destroyOverlay();
		}

		if ( key === "widgetClass" ) {
			this.uiDialog
				.removeClass( this.options.widgetClass )
				.addClass( value );
		}

		if (
			// set the closeText without executing parent,
			// so the debug can be generated if it's not false
			   key !== "closeText"
			// window has own setter for "position"
			&& key !== "position"
		) {
			this._superApply( arguments );
		} else {
			this.options[ key ] = value;
		}

		this._debugOptions();

		if ( key === "minimizable" || key === "maximizable" ) {
			this._setMinimizableMaximizableClasses();
		}

		if ( key === "maximizable" ) {
			this._createButton( "maximize" );

		} else if ( key === "minimizable" ) {
			this._createButton( "minimize" );

		} else if ( key === "icons" ) {
			this._setWindowIcon();
			this._refreshButtonIcons();
			this._propagateConfirmCloseOptions( key, prev );

		} else if ( key === "titleLocalized" || key === "title" ) {
			this._createTitleForEmpty();
			this._title();
			this._propagateConfirmCloseOptions( key, prev );

		} else if ( key === "maximized" ) {
			this._toggleMaximized( value );

		} else if (key === "containment" ) {
			this._setContainment();
			this.refreshPosition();

		} else if ( key === "position" ) {
			this._position();
			this._setRestoreSize();
			this.refreshPosition();

		} else if ( key === "width" || key === "maxWidth" ) {
			this._setWidth();
			this.refreshPosition();

		} else if ( key === "height" || key === "maxHeight" ) {
			this._setHeight();
			this.refreshPosition();

		} else if ( key === "modal" || key === "modalOverlay" ) {
			this._createOverlay();
			this._modalZIndexes({
				revertActive: false
			});

		} else if ( key === "closable" ) {
			this._setButtonCloseState();

		} else if ( key === "buttons" ) {
			this.refreshPosition();

		} else if ( key === "taskbar" ) {
			this._rebindTaskbar();
			this._propagateConfirmCloseOptions( key, prev );

		} else if ( key === "confirmClose" || key === "durations" ) {
			this._propagateConfirmCloseOptions( key, prev );

		} else if ( key === "embeddedContent" ) {
			this._placeOverlay();

		} else if ( key === "group" ) {
			this._refreshGroup();

		} else if ( $.inArray( key, this._unsupportedOptions ) > -1 ) {
			this._debugUnsupportedOptions();
			this._resetUnsupportedOptions();

		} else if ( key === "appendTo" && this.overlay ) {
			// this.uiDialog.appendTo( this._appendTo() )
			// is covered by this._superApply( arguments );
			this.overlay.prependTo( this._appendTo() );
		}
	},

	destroy: function ( ) {
		if ( this._onInteractionEnd( "destroy" ) === true ) {
			return this;
		}

		// destroy was already called
		if ( this._cache.destroyed ) {
			return;
		}

		// call close with no way of preventing it,
		// close will then call destroy()
		if ( ! this._cache.closeInevitable && this._cache.initialized ) {
			this._cache.closeForced = true;
			this.close();

			return;
		}

		var self = this;

		this._cache.destroyed = true;

		this._clearTimeouts();

		this._preventGlobalWindowClick();

		// we have to remove modal classes before
		// moveToTop(), otherwise highest window would
		// stay blurred, because windows should be blurred
		// when modal is on top
		this.$elem.removeClass( this.classes.modal );
		// +
		this._moveToTop({
			highest: true
		});

		this.$window
			.removeUniqueId()
			.removeClass(
				        this.classes.windowContent
				+ " " + this.classes.confirmClose
			)
			.removeData( this._cnst.dataPrefix + "window" );

		this.$elem
			.stop( true, true )
			.removeClass( this.classes.window );

		this._super();

		this.$window.attr( "style", this._cache.inlineCSS );

		// remove empty attributes
		$.each( [ "class", "style" ], function ( index, attr ) {
			if ( self.$window.attr( attr ) === "" ) {
				self.$window.removeAttr( attr );
			}
		});
	}
});

// allow settings options for all future instances at once,
// or if "propagateToInstances" is set to true, affect both prototype
// and the current instances
$.simone.windowSetup = function ( propagateToInstances, options ) {
	options = arguments.length === 1 ? propagateToInstances : options;
	if ( propagateToInstances === true && arguments.length > 1 ) {
		$( "." + $.simone.window.prototype.classes.windowContent )
			.window( "option", options );
	}
	var o = $.simone.window.prototype.options;
	return options ? $.extend( true, o, options ) : o;
};
})( jQuery );

