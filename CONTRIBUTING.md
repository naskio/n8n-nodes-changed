# Contributing

## Setup

Install dependencies:

```shell
yarn install
```

## Update dependencies and dev dependencies to latest versions

```shell
yarn run update
```

## Run

Use `demo/run_demo.sh` to run n8n with `n8n-nodes-changed` installed.

```shell
./demo/run_demo.sh
# or
yarn run demo
# or
yarn run demo:build
```

## Release

To release a new version, create a new release (with tag) on GitHub.

To cancel a release, delete the release on GitHub, remove the tag on GitHub and delete the release from npmjs.org.

## Overview

This n8n-node calculate the hash of the input (the json of items) and persist data using workflow `staticData`.

The `staticData` persist and retrieve data from the workflow only on `trigger`mode. In `manual`mode it will not persist
nor retrieve data. The default value will always be used in `manual`mode.

After each execution, we compare the hash of the current input with the hash of the previous input and redirect the
stream based on that.
