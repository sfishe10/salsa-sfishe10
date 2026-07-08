#!/bin/bash
cd ~/salsa/attendance-frontend/dist/client/browser
npx serve -s . -l 443 \
  --ssl-cert "/etc/letsencrypt/live/807.band/fullchain.pem" \
  --ssl-key "/etc/letsencrypt/live/807.band/privkey.pem"
