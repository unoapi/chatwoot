#!/bin/bash

prog=mail_room

start() {
  # see if running
  local pids=$(pgrep $prog)

  if [ -n "$pids" ]; then
    echo "$prog (pid $pids) is already running"
    return 0
  fi
                
  echo -n $"Starting $prog: "
  mail_room -c /app/mail_room/config.yml &> /tmp/mail_room.log &
  RETVAL=$?
  PID=$!
  echo $PID > /tmp/mail_room.pid
  return $RETVAL
}

stop() {
  echo -n $"Stopping $prog: "
  kill -15 $(cat /tmp/mail_room.pid) && rm -f /tmp/mail_room.pid

  RETVAL=$?

  return $RETVAL
}

reload() {
    stop
        start
}

# See how we were called.
case "$1" in
  start)
                start
                ;;
  stop)
                stop
                ;;
  status)
    status $prog
                RETVAL=$?
        ;;
  restart)
                stop
                start
        ;;
  *)
        echo $"Usage: $prog {start|stop|restart}"
        RETVAL=2
  esac

exit $RETVAL