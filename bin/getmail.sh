#!/bin/bash

set -e

# if [ "$CHATWOOT_PREPARE" == "true" ] ; then
#   echo "Chatwoot prepare app..."
#   bundle exec rails db:chatwoot_prepare
#   bundle exec rails db:prepare
# fi

echo "Starting app..."
mail_room -c /app/getmail/config.yml


# #!/bin/bash
# #
# # mail_room start up script to listen to imap for requests

# # Source function library.
# . /etc/rc.d/init.d/functions

# prog=mail_room

# start() {
#           # see if running
#           local pids=$(pgrep $prog)

#           if [ -n "$pids" ]; then
#             echo "$prog (pid $pids) is already running"
#             return 0
#           fi
                
#         echo -n $"Starting $prog: "
#         cd /var/www/r4/current/
# 				# note RVM wrapper is required to load gems and mail_room script
# 				# http://rvm.io/deployment/init-d
# 				# nohup allows the script to run in a detached shell
#         bundle exec mail_room -c /app/getmail/config.yml &> /var/www/r4/current/log/mail_room.log &
#         RETVAL=$?
#         PID=$!
#         echo $PID > /tmp/mail_room.pid
#         return $RETVAL
# }

# stop() {
#   echo -n $"Stopping $prog: "
#   kill -15 $(cat /tmp/mail_room.pid) && rm -f /tmp/mail_room.pid

#   RETVAL=$?

#   return $RETVAL
# }

# reload() {
#     stop
#         start
# }

# # See how we were called.
# case "$1" in
#   start)
#                 start
#                 ;;
#   stop)
#                 stop
#                 ;;
#   status)
#     status $prog
#                 RETVAL=$?
#         ;;
#   restart)
#                 stop
#                 start
#         ;;
#   *)
#         echo $"Usage: $prog {start|stop|restart}"
#         RETVAL=2
# esac

# exit $RETVAL