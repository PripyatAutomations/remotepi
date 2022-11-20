 var sip_ready_cb = function(e) {
   createSipStack();
 };
 
 var sip_error_cb = function(e) {
   console.error('SIPml5 failed to initialize: ' + e.message);
 };
 SIPml.init(sip_ready_cb, sip_error, cb);
 var sip_stack;

 var sip_evt_listener = function(e) {
    if (e.type == 'started') {
       login();
    } else if (e.type == 'i_new_message') {
       acceptMessage(e);
    } else if (e.type == 'i_new_call') {
       acceptCall(e);
    }
 }
 
 function sip_create_stack() {
    sip_stack = new SIPml.Stack({
       // XXX: Need to move this somewhere configurable
       realm: '10.11.0.3',
       impi: 'guest',
       impu: 'sip:guest@10.11.0.3',
       password: 'guest',
       display_name: 'FT891 Web User',
       websocket_proxy_url: 'ws://10.11.0.3:8088/pbx/ws',
       outbound_proxy_url: 'udp://10.11.0.3:5060/',
       enable_rfcweb_breaker: false,
       events_listener: {
         events: '*',
         listener: sip_evt_listener
       },
       sip_headers: [
         { name: 'User-Agent', value: 'remotepi/0.1 sipML5-v1.0.0.0' },
         { name: 'Organization', value: 'remotepi' }
       ],
    });
 }

 var registerSession;
    var eventsListener = function(e) {
       console.info('session event = ' + e.type);

       if (e.type == 'connected' && e.session == registerSession) {
          makeCall();
          sendMessage();
          publishPresence();
//          subscribePresence('johndoe');
       }
    }

    var login = function() {
       registerSession = sipStack.newSession('register', {
          events_listener: { events: '*', listener: eventsListener
       } // optional: '*' means all events
    });
    registerSession.register();
 }
        
 var callSession;

 var eventsListener = function(e) {
    console.info('session event = ' + e.type);
 }

 var makeCall = function() {
    callSession = sipStack.newSession('call-audiovideo', {
       video_local: document.getElementById('video-local'),
       video_remote: document.getElementById('video-remote'),
       audio_remote: document.getElementById('audio-remote'),
       events_listener: { events: '*', listener: eventsListener } // optional: '*' means all events
    });
    callSession.call('johndoe');
 }

 var acceptCall = function(e) {
    e.newSession.accept();
    // e.newSession.reject(); // or reject the call
 }

 var messageSession;
 var eventsListener = function(e) {
    console.info('session event = ' + e.type);
 }

 var sendMessage = function() {
    messageSession = sipStack.newSession('message', { events_listener: { events: '*', listener: eventsListener } });
//    messageSession.send('target', 'Subject', 'text/plain;charset=utf-8');
 }
 var acceptMessage = function(e){
    e.newSession.accept();
    // e.newSession.reject(); // or reject the message
    console.info('SMS-content = ' + e.getContentString() + ' and SMS-content-type = ' + e.getContentType());
 }
 sip_stack.start();
