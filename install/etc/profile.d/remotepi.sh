export PATH=$PATH:/opt/remotepi/bin
[ -d ~/.local/share/WSJT-X/save ] && {
   echo "* Trying to mount wsjtx tmpfs"
   mountpoint ~/.local/share/WSJT-X/save 2>&1 >/dev/null || sudo mount -t tmpfs wsjtx-tmp ~/.local/share/WSJT-X/save/
}
