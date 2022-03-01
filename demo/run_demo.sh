#### install package locally
#!/bin/bash

DEMO_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

echo DEMO_DIR: $DEMO_DIR

quick=${1:-true} # set to false to install all dependencies

if [[ ! -d "${DEMO_DIR}/node_modules" ]]; then
	echo "Installing node modules..."
	cd ${DEMO_DIR}/
	yarn install
	cd ./../
fi

if [ $quick = true ]; then
	cd ${DEMO_DIR}/
	cd ./../
	echo "Building n8n-node ..."
	yarn run build
	cd ${DEMO_DIR}/
	yarn run start
else
	# go to package root
	cd ${DEMO_DIR}/
	cd ./../
	# Install package dependencies
	yarn install
	# Build the package locally
	yarn run build
	# "Publish" the package locally
	yarn link
	# or
	# yarn install && yarn build && yarn link
	#### --------------------------------------------------
	# run n8n locally
	cd ${DEMO_DIR}/
	yarn link "n8n-nodes-changed"
	#	yarn install
	#	yarn unlink "n8n-nodes-changed"
	# yarn add n8n-nodes-changed
	yarn run start
fi
