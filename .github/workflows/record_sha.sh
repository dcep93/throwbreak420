#!/bin/bash

set -euo pipefail

printf "%s\n%s\n" "$(TZ='America/New_York' date)" "$(git log -1)" >.github/workflows/recorded_sha.txt
