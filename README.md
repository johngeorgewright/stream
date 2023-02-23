# stream

Reactive programming tools using the Web Streams API.

See the [docs](https://johngeorgewright.github.io/stream/) for more information.

## Building

1. Install [node.js](https://nodejs.org/)
1. We recommend using [NVM](https://github.com/nvm-sh/nvm). Once doing so install the node version we're using: `nvm install`
1. Install [Yarn](https://yarnpkg.com/): `corepack enable`
1. Install dependencies: `yarn`
1. Start an incremental build tool: `yarn start`. Or build once: `yarn build`

### Building Documentation

We're using a combination of [Jekyll](https://jekyllrb.com/) for static file generation and [Typedoc](https://typedoc.org/) for API generation.

1. Install [Ruby](https://www.ruby-lang.org/).
1. Install depenedencies: `bundle install`
1. Build documentation: `yarn build:docs`. Or start a server: `yarn serve:docs`.
