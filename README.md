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

## Demo

## Documentation

* [Getting Started](#getting-started)
* [Elements](#elements)
    * [Element](#vectorelement)
    * [Graphics](#vectorgraphics)
    * [Geometry](#vectorgeometry)
    * [SVG](#vectorsvg-1)
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

For those elements which has no wrapper implemented in `Vector.svg`, the
`Vector.Element` interface is useful.
```javascript
var paper = Vector("paper", 400, 300);

var rect = paper.rect(100, 100)
          .attr("fill", "red");

// title variable is a instance of Vector.Element class
var title = rect.element("title");
title.textContent("This is 100x100 rect");
```
#### Vector.Graphics

`Vector.Graphics` is a subclass of `Vector.Element`. <br/>

This class represents the native interface `SVGGraphicsElement`. This class normally
does nothing, but it is useful when you want to add your own methods to all
the graphics elements.

#### Vector.Geometry

`Vector.Geometry` is a subclass of `Vector.Graphics`.<br/>

It wraps the `SVGGeometryElement` native interface. It provides some useful methods
to all the shape elements i.e. `Rect`, `Circle`, `Path` etc.

##### prototype.pathLength()

Sets and gets the value of `pathLength` attribute.

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
Also, if the `width` and `height` or any others dimensions of the shape is in percentage,
then you can get the actual length easily by this method.
 
```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();
g.attr("fill", "none")
 .attr("stroke-width", 2)
 .attr("stroke", "purple");
 
var rect = g.rect("30%", "50.56%");
rect.x("5%")
    .y("5%");
    
alert(rect.length());
```

#### Vector.SVG

`Vector.SVG` is a subclass of `Vector.Graphics`.<br/>

This class represents the inner `<svg>` element i.e. nested svg document.

```javascript
var paper = Vector("paper", 600, 300);

var svg = paper.svg(100, 100, 10, 10);

svg.circle(40, 50, 50)
   .attr("fill", "purple")
   .attr("stroke", "green");
```
##### prototype.x()

Sets and gets the value of `x` attribute.

##### prototype.y()

Sets and gets the value of `y` attribute.

##### prototype.width()

Sets and gets the value of `width` attribute.

##### prototype.height()

Sets and gets the value of `height` attribute.

##### prototype.size()

Sets and gets the size of the `svg` in easy way.

It is equivalent to:

```javascript
svg.width(w).height(h);
```

##### prototype.viewBox()

Sets and gets the `viewBox` of the `svg` element.

As a setter:

```javascript
var paper = Vector("paper", 600, 300);
paper.viewBox(0, 0, 10, 10);

paper.circle(4)
     .cx(5)
     .cy(5)
     .attr("fill", "purple");
```
When it is called as getter, it returns a object containing of `x`, `y`, `width`
and `height` properties.

```javascript
var paper = Vector("paper", 600, 300);
paper.viewBox(0, 0, 10, 10);

paper.circle(4)
     .cx(5)
     .cy(5)
     .attr("fill", "purple");
     
var v = paper.viewBox();
alert(v.x + " " + v.y + " " + v.width + " " + v.height);
```
##### prototype.aspectRatio()

Sets and gets the value of `preserveAspectRatio` attribute.

```javascript
var paper = Vector("paper", 600, 300);
paper.viewBox(0, 0, 400, 500);
paper.aspectRatio("xMinYMin meet");

paper.circle(70)
     .cx(100)
     .cy(100)
     .attr("fill", "purple");
```

#### Vector.SVGDoc

`Vector.SVGDoc` is a subclass of `Vector.SVG`.<br/>

The return value of `Vector()` function is a `Vector.SVGDoc` instance. It wraps
the SVG document i.e. the outer most `<svg>` element.

```javascript
var paper = Vector("paper", 400, 300);
```

##### prototype.container()

Changes the container element for the SVG document.

```javascript
var paper = Vector(null, 600, 300); // Creates a paper without container
paper.container("paper"); // Now sets the container element by its id or dom instance.

paper.circle(70)
     .cx(100)
     .cy(100)
     .attr("fill", "purple");
```

##### prototype.defs()

There is only one `<defs>` element for every SVG document and that resides
as the direct child of the the outer most `<svg>` element.
This instance can be accessed by `defs()` method.

```
var defs = paper.defs();
```

#### Vector.Rect

`Vector.Rect` is a subclass of `Vector.Geometry`.<br/>

Creates a basic rectangle shape. It wraps the `SVGRectElement` native interface.

```javascript
var paper = Vector("paper", 600, 300);

paper.rect()
     .size(100, 200)
     .x(50)
     .y(50)
     .rx(50)
     .ry(50)
     .attr("fill", "red")
     .attr("stroke", "purple");
```

##### prototype.x()

Sets and gets the value of `x` attribute.

##### prototype.y()

Sets and gets the value of `y` attribute.

##### prototype.width()

Sets and gets the value of `width` attribute.

##### prototype.height()

Sets and gets the value of `height` attribute.

##### prototype.size()

Sets and gets the size of the `rect` in easy way.

It is equivalent to:

```javascript
rect.width(w).height(h);
```
##### prototype.rx()

Sets and gets the value of `rx` attribute.

##### prototype.ry()

Sets and gets the value of `ry` attribute.

#### Vector.Circle

`Vector.Circle` is a subclass of `Vector.Geometry`.<br/>

Creates a circle of the specified radius. It wraps the `SVGCircleElement` native interface.

```javascript
var paper = Vector("paper", 600, 300);

paper.circle(100)
     .cx(100)
     .cy(100)
     .attr("fill", "red")
     .attr("stroke", "purple");
       
```
##### prototype.r()

Sets and gets the value of `r` attribute.

##### prototype.cx()

Sets and gets the value of `cx` attribute.

##### prototype.cy()

Sets and gets the value of `cy` attribute.

#### Vector.Path

`Vector.Path` is a subclass of `Vector.Geometry`.<br/>

Path is used to create complex shapes unlike Polyline.
It wraps the `SVGPathElement` native interface. 

```javascript
var paper = Vector("paper", 600, 300);

var path = paper.path();
path.d("M0,0H50A20,20,0,1,0,150,50v40C100,125,0,85,0,85z")
    .attr("fill", "red")
    .attr("stroke", "purple");
     
alert(path.length());
```

##### prototype.d()

Sets and gets the path string i.e. the value of `d` attribute. 

#### Vector.Line

`Vector.Line` is a subclass of `Vector.Geometry`.<br/>

Creates a straight line from one point to another point. It wraps the
`SVGLineElement` native interface.

```javascript
var paper = Vector("paper", 600, 300);

var line = paper.line();
line.from(10, 100)
    .to(200, 30)
    .attr("fill", "red")
    .attr("stroke", "purple");
```

##### prototype.x1()

Sets and gets the value of `x1` attribute.

##### prototype.y1()

Sets ans gets the value of `y1` attribute.

##### prototype.x2()

Sets and gets the value of `x2` attribute.

##### prototype.y2()

Sets and gets the value of `y2` attribute.

##### prototype.from()

Sets and gets the starting point of the line.

It is equivalent to:

```javascript
line.x1(50).y1(60);
```
##### prototype.to()

Sets and gets the destination point of the line.

Equivalent to the following:

```javascript
line.x2(100).y2(150);
```

#### Vector.Ellipse

`Vector.Ellipse` is a subclass of `Vector.Geometry`.<br/>

Creates a basic ellipse shape, to get rotated ellipse please use transform.
It wraps the `SVGEllipseElement` native interface.

```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();
g.attr("fill", "none")
 .attr("stroke", "purple");
 
g.ellipse(60, 30)
 .cx(70)
 .cy(50)
 // To create a rotated ellipse
 .attr("transform", "rotate(45, 70, 50)");
```

##### prototype.rx()

Sets and gets the value of `rx` attribute.

##### prototype.ry()

Sets and gets the value of `ry` attribute.

##### prototype.cx()

Sets and gets the value of `cx` attribute.

##### prototype.cy()

Sets and gets the value of `cy` attribute.

#### Vector.Polygon

`Vector.Polygon` is a subclass of `Vector.Geometry`.<br/>

The polygon element defines a closed shape consisting of a set of
connected straight line segments.
It wraps the `SVGPolygonElement` native interface.

```javascript
var paper = Vector("paper", 600, 300);

var polygon = paper.polygon();
polygon.points("50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40")
       .attr("fill", "purple");
```

##### prototype.points()

Sets and gets the polygon point-string i.e. the value of `points`
attribute.


#### Vector.Polyline

`Vector.Polyline` is a subclass of `Vector.Geometry`.<br/>

Polyline element defines a set of connected straight line segments.
Typically, polyline elements define open shapes.
It wraps the `SVGPolylineElement` native interface.

```javascript
var paper = Vector("paper", 600, 300);

var polyline = paper.polyline();
polyline.points("50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40")
        .attr("fill", "none")
        .attr("stroke", "purple");
```

##### prototype.points()

Sets and gets the polyline point-string i.e. the value of `points`
attribute.

#### Vector.Defs

`Vector.Defs` is a subclass of `Vector.Graphics`.<br/>

It wraps `<defs>` elements. The `<defs>` element is a container element for referenced elements.
Elements that are descendants of a `<defs>` are not rendered directly.
For understandability and accessibility reasons, it is recommended that, 
whenever possible, referenced elements be defined inside of the `<defs>` element.
There is only one `<defs>` element for every SVG document and that resides
as the direct child of the the outer most `<svg>` element.
This instance can be accessed by `defs()` method on the `Vector.SVDoc` instance.

```javascript
var paper = Vector("paper", 600, 300);

// Access <defs> element and add a circle into this.
var circle = paper.defs().circle(50, 60, 60);

// reference that circle by <use> element.
paper.use(circle)
     .attr("fill", "purple");
```

The `defs` instance can also be accessed from any element throught `doc()` method.

```javascript
circle.doc().defs();
```
#### Vector.G

`Vector.G` is a subclass of `Vector.Graphics`.<br/>

This class wraps `<g>` elements. The `<g>` element is a container element for
grouping together related graphics elements. Grouping elements can be useful
if you want to transform a set of elements as if it were one.

```javascript
var paper = Vector("paper", 600, 300);

// Create a group and apply some transforms
var g = paper.g();
g.attr("transform", "translate(100, 100)");

g.rect(100, 100)
 .attr("fill", "red");
 
// You also can add another element
var circle = paper.circle(50);
circle.attr("fill", "purple");
g.append(circle);
```
#### Vector.Symbol

`Vector.Symbol` is a subclass of `Vector.Element`.<br/>

It wraps the `<symbol>` elements. The `<symbol>` element is used to define graphical 
template objects which can be instantiated by a `<use>` element.
The key distinction between a `<symbol>` and a `<g>` is `<symbol>` element itself
is not rendered. Only instances of a `<symbol>` element are rendered.

```javascript
var paper = Vector("paper", 600, 300);

var symbol = paper.defs().symbol();
symbol.rect(100, 100)
      .attr("fill", "red");
      
paper.use(symbol);
```
##### prototype.viewBox()

Sets and gets the value of `viewBox` attribute.

##### prototype.aspectRatio()

Sets and gets the value of `preserveAspectRatio` attribute.

#### Vector.Use

`Vector.Use` is a subclass of `Vector.Graphics`.<br/>

This class wraps the `<use>` elements. The `<use>` element references
another element and indicates that the graphical contents of that element 
is included/drawn at that given point in the document.

```javascript
var paper = Vector("paper", 600, 300);

var circle = paper.defs().circle(15);

paper.use(circle)
     .attr("fill", "purple")
     .x(20)
     .y(20);
     
paper.use(circle)
     .attr("fill", "red")
     .x(80)
     .y(80);
     
paper.use(circle)
     .attr("fill", "green")
     .x(140)
     .y(140);
```

##### prototype.x()

Sets and gets the value of `x` attribute.

##### prototype.y()

Sets and gets the value of `y` attribute.

##### prototype.width()

Sets and gets the value of `width` attribute.

##### prototype.height()

Sets and gets the value of `height` attribute.

##### prototype.href()

Sets and gets the value of the `xlink:href` attribute.

When the first argument is `null` then the `xlink:href` attribute will be
deleted. Also, you can pass any element directly or the `url` as a referenced element.

```javascript
var paper = Vector("paper", 600, 300);

var circle = paper.defs().circle(15);
var url = "#" + circle.id();
paper.use(url)
     .attr("fill", "purple")
     .x(20)
     .y(20);
```



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
