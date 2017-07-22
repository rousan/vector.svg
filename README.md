# Vector.svg

A Javascript library for creating vector graphics using SVG. It uses the SVG W3C Recommendation
and written in pure ES5. It provides `SVG DOM manipulation`, `data binding` and `animation` functionality.

## Install

If you use NPM, run the following command, Otherwise download the latest release from Github. It supports UMD module loader i.e.
AMD, CommonJS, and VanillaJS environments. In VanillaJS, a `Vector` global is exported:

`npm install vector.svg`

After downloading just insert it into your HTML page:

`<script src="vector.svg.min.js"></script>`

## Build

`npm run build`     
     
## Test

`npm test`

## Documentation

* [Getting Started](#getting-started)
* [Elements](#elements)
    * [Element](#vectorelement)
    * [Graphics](#vectorgraphics)
    * [Geometry](#vectorgeometry)
    * [SVG](#vectorsvg)
    * [SVGDoc](#vectorsvgdoc)
    * [Rect](#vectorrect)
    * [Circle](#vectorcircle)
    * [Path](#vectorpath)
    * [Line](#vectorline)
    * [Ellipse](#vectorellipse)
    * [Polygon](#vectorpolygon)
    * [Polyline](#vectorpolyline)
    * [Defs](#vectordefs)
    * [G](#vectorg)
    * [Symbol](#vectorsymbol)
    * [Use](#vectoruse)
* [Containers](#containers)
* [Manipulation](#manipulation)
* [Events](#events)
* [Data Binding](#data-binding)
* [Utilities](#utilities)


### Getting Started

First of all, create a HTML page consisting of a HTML element with an `id` attribute and ready to serve as the container:

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

That's it, isn't it so simple?
[Here](https://jsfiddle.net/ariyankhan/u25uoLny/) is the fiddling, go and play with Vector.svg.

### Elements

#### Vector.Element

The `Vector.Element` class is the Base class for all the SVG DOM wrapper elements. This class
is used to wrap `SVGElement` native interface and its subclasses.
This class provides some basic methods that all the wrappers inherit.

```javascript
var paper = Vector("paper", 400, 300);

var rect = new Vector.Element(Vector.createElement("rect"));
rect.attr("width", 100)
    .attr("height", 100)
    .attr("fill", "red");

paper.append(rect);
```
#### Vector.Graphics

`Vector.Graphics` is a subclass of [Vector.Element](#vectorelement). <br/>

This class represents the native interface `SVGGraphicsElement`. This class normally
does nothing, but it is useful when you want to add your own methods to all
the graphics elements.

#### Vector.Geometry

`Vector.Geometry` is a subclass of `Vector.Graphics`.<br/>

It wraps the `SVGGeometryElement` native interface. It provides some useful methods
to all the shape elements i.e. `Rect`, `Circle`, `Path` etc.

##### prototype.pathLength()

This method sets and gets the value `pathLength` attribute.

##### prototype.length()

It returns the user agent's computed value for the total length of 
the shape in user units.

```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();
g.attr("fill", "none")
 .attr("stroke-width", 2)
 .attr("stroke", "purple");
 
var path = g.path();
path.d("M0,0h100q50,50,0,100z");  

var rect = g.rect(100, 100);
rect.x(50)
    .y(120);
    
var ellipse = g.ellipse();
ellipse.cx(250)
       .cy(100)
       .rx(70)
       .ry(50);
       
alert(path.length());
alert(rect.length());
alert(ellipse.length());
```

#### Vector.SVG

`Vector.SVG` is a subclass of `Vector.Graphics`.<br/>

### Containers
     
### Manipulation

### Data Binding

### Utilities


## Contributors

   * [Ariyan Khan](https://github.com/ariyankhan)
   
   Contributions are welcome
   
## License

MIT License

Copyright (c) 2017 Ariyan Khan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
