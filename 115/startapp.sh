#!/bin/sh

export HOME=/config
sh /usr/local/115/115.sh
/bin/bash -c "exec -a $0 /usr/local/115/115" $0