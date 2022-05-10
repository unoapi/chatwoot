FROM ruby:3-slim

WORKDIR /app/relay

RUN export DEBIAN_FRONTEND=noninteractive && apt-get update

RUN apt-get install -y make build-essential libicu-dev
RUN gem install charlock_holmes -v 0.7.7
RUN gem install sidekiq -v 6.4.2
RUN gem install gitlab-mail_room

ADD config/mailboxes.yml /app/mailboxes.yml
ADD bin/relay.sh /bin/relay.sh


# add config required for HEROKU_EXEC
# ENV HEROKU_EXEC_DEBUG=1
RUN apt-get install -y python3 curl python-is-python3 openssh-server iproute2
RUN rm /bin/sh \
 && ln -s /bin/bash /bin/sh \
 && mkdir -p /app/.profile.d/ \
 && printf '#!/usr/bin/env bash\n\nset +o posix\n\n[ -z "$SSH_CLIENT" ] && source <(curl --fail --retry 7 -sSL "$HEROKU_EXEC_URL")\n' > /app/.profile.d/heroku-exec.sh \
 && chmod +x /app/.profile.d/heroku-exec.sh

RUN apt-get clean


CMD ["sh", "/bin/relay.sh"]