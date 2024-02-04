#!/bin/bash

set -euo pipefail

# npx create-react-app throwbreak420 --template typescript
# yarn add @babel/plugin-proposal-private-property-in-object --dev

cd throwbreak420

npm install
yarn build
rm -rf node_modules
