#!/bin/bash

TOTAL=$1
OFFSET=0

while [ $OFFSET -lt $TOTAL ]; do
    nodejs index $OFFSET $TOTAL > $OFFSET.log &
    OFFSET=$(($OFFSET+1))
done
