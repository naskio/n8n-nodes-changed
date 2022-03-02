# n8n-nodes-changed

n8n node to detect if something changed between the current execution and the previous one.

[![n8n](https://github.com/naskio/n8n-nodes-changed/blob/main/assets/screenshot.png?raw=true)](https://nask.io)

> This node works only in trigger mode (with Cron, Webhook, etc.), in manual mode it will always use the default value.

# Description

This node take an input and redirect the stream based on if the input has changed between the current and the previous
execution or not.

# Use Case

Avoid sending multiple emails, notifications, alerts etc. Send only the input changes.

# Contribute

Pull requests are welcome! For any bug reports, please create
an [issue](https://github.com/naskio/n8n-nodes-changed/issues).

See the [contributing guide](./CONTRIBUTING.md) for more information.

# License

[MIT](./LICENSE)
