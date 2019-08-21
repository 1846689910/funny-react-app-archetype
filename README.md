# funny-react-app-archetype

## Introduction

`funny-react-app-archetype` is an archetype of react app configuration, including babel and webpack.

## Usage

`src/client/.babelrc.js`:

```js
module.exports = {
  extends: "funny-react-app-archetype/config/babel/babelrc-client"
};
```

`src/server/.babelrc.js`:

```js
module.exports = {
  extends: "funny-react-app-archetype/config/babel/babelrc-server"
};
```

`webpack.config.js`:
```js
module.exports = require("funny-react-app-archetype/config/webpack/webpack.config");
```

`webpack.config.dev.js`:
```js
module.exports = require("funny-react-app-archetype/config/webpack/webpack.config.dev");
```

`.eslintrc.js`:
```js
module.exports = {
  extends: "./node_modules/funny-react-app-archetype/.eslintrc.js"
};
```

## Overwrite

To overwrite `optimization.splitChunks`:
```js
const { splitChunks } = require("funny-react-app-archetype/config/webpack/partial/split-chunks.js")().optimization;
const config = require("funny-react-app-archetype/config/webpack/webpack.config");
config.optimization.splitChunks = Object.assign({}, splitChunks, {/* User Defined Options */});
```