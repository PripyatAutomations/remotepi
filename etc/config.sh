#
# Configurations
#
# My Call
MYCALL=N0CALL
# Sound card (USB)
CARD=0

# Digital modes volume preset
DIGI_MIC=12
DIGI_SPKR=29
# this is in hamlib units (ugh) - 35 watts
DIGI_POWER=0.35

# Phone mode volume presets
PHONE_MIC=38
PHONE_SPKR=30
PHONE_POWER=1.0

# Packet mode volume presets
PKT_MIC=10
PKT_SPKR=30
PKT_POWER=0.35

# digi mode programs to kill when switching to phone
EXTRA_DIGI="fldigi js8call wsjtx ardopc pat direwolf"

# Extension to dial into
CONF_EXTEN=0
RUN=/opt/remotepi/run

# WM is windowmanager or tool to move flrig window to 0,0
# try: xdotool search 'flrig' windowmove 0 0
WM=jwm
FLRIG_SZ=425x297
RADIO_NAME=ft891
BPP=24
DPI=96
RFB_DISPLAY=30
DISPLAY=":${RFB_DISPLAY}"
RFB_PORT=$((44560+${RFB_DISPLAY}))
HTML_PORT=$((45560+${RFB_DISPLAY}))
#LOCAL_ONLY="-interface 127.0.0.1 -localhost"
HOST=remote-pi.remotepi.lan
TMUX_SESS=remotepi

# SIP configuration
UA_CHAN=radio0
UA_PORT=15060
UA_DIR=/opt/remotepi/etc/baresip-${UA_CHAN}
UA_USER=radio0
UA_PASS=abcde12345
UA_CONTEXT=radio0
AU_OUTDEV=alsa,default
AU_INDEV=alsa,default
AU_ALERTDEV=alsa,default

LISTENER_USER=guest
LISTENER_PASS=guest
ADMIN_USER=joe-mobile
ADMIN_PASS=1234567890

# ham radio menu password, for "untrusted" phones
HAM_PASS=4321
