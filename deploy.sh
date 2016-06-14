#!/usr/bin/env bash

REMOTE_MACHINE=$1
DIRNAME=$(basename `pwd`)

rm -rf public
brunch build --production
rsync -azP public ${REMOTE_MACHINE}:/var/www/${DIRNAME}
