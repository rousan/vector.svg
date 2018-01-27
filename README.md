[![NPM version](https://img.shields.io/npm/v/vector.svg.svg)](https://www.npmjs.com/package/vector.svg)
[![NPM total downloads](https://img.shields.io/npm/dt/vector.svg.svg)](https://www.npmjs.com/package/vector.svg)
[![License](https://img.shields.io/github/license/rousan/vector.svg.svg)](https://github.com/rousan/vector.svg/blob/master/LICENSE)

# Vector.svg

A lightweight Javascript library for creating `Vector` graphics and manipulating `SVG`.

> Lightweight library for manipulating SVG.

## Install

### NPM

Install it from `npm`:

```bash
$ npm install --save vector.svg
```

### CDN

If you prefer CDN, then just insert it into your HTML page:

`<script src="https://cdn.jsdelivr.net/npm/vector.svg/dist/vector.svg.min.js"></script>`

## Demo

[This](https://rousan.github.io/vector.svg/drawing-pad/) is a simple Drawing Pad built with `Vector.svg` library.

## Getting Started

First of all, create a HTML page consisting of a HTML element with an `id` attribute and ready to serve as the container of the drawing:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vector.svg Getting Started</title>
</head>
<body>

<div id="paper"></div>

</body>
</html>
```

Then, create a SVG Document within the container element:

```javascript
var paper = Vector("paper", 400, 300);
```

Now, lets create some basic shapes:

```javascript
var paper = Vector("paper", 400, 300);

var circle = paper.circle(50).cx(60).cy(60);
circle.attr("stroke", "red")
      .attr("fill", "purple");

var rect = paper.rect(100, 100).x(100).y(100);
rect.attr("stroke", "purple")
    .attr("fill", "green");
```

That's it. [Here](https://jsfiddle.net/rousan/u25uoLny/) is the `JSFiddle` link.

## Contributing

Your PRs and stars are always welcome.

Please, try to follow:

* Clone the repository.
* Checkout `develop` branch.
* Install dependencies.
* Add your new features or fixes.
* Build the project.

```sh
$ git clone https://github.com/rousan/vector.svg.git
$ cd vector.svg
$ git checkout develop
$ npm i
$ npm run build
```

### [Documentation and Wiki](https://github.com/rousan/vector.svg/wiki/Docs)