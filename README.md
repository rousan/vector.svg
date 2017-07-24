# Vector.svg

A Javascript library for creating vector graphics using SVG. It uses the SVG W3C Recommendation
and written in pure ES5. It provides `SVG DOM manipulation`, `data binding` and `animation` functionality.

## Install

If you use NPM, run the following command, Otherwise download the latest release from Github. It supports UMD module loader i.e.
AMD, CommonJS, and VanillaJS environments. In VanillaJS, a `Vector` global object is exported:

`npm install vector.svg`

For VanillaJS, just insert it into your HTML page:

`<script src="vector.svg.min.js"></script>`

## Build

`npm run build`     
     
## Test

`npm test`

## Demo

[This](http://byter.in/) is a simple Drawing Pad built with Vector.svg library.

## Documentation

* [Getting Started](#getting-started)
* [Elements](#elements)
    * [`Element`](#vectorelement)
    * [`Graphics`](#vectorgraphics)
    * [`Geometry`](#vectorgeometry)
    * [`SVG`](#vectorsvg-1)
    * [`SVGDoc`](#vectorsvgdoc)
    * [`Rect`](#vectorrect)
    * [`Circle`](#vectorcircle)
    * [`Path`](#vectorpath)
    * [`Line`](#vectorline)
    * [`Ellipse`](#vectorellipse)
    * [`Polygon`](#vectorpolygon)
    * [`Polyline`](#vectorpolyline)
    * [`Defs`](#vectordefs)
    * [`G`](#vectorg)
    * [`Symbol`](#vectorsymbol)
    * [`Use`](#vectoruse)
* [`Vector` Global](#vector-global)
* [SVG DOM](#svg-dom)
* [Events](#events)
* [Data Binding](#data-binding)
* [Containers](#containers)
    * [`Container`](#container)
    * [`GenericContainer`](#genericcontainer)
    * [`ShapeContainer`](#shapecontainer)
    * [`StructuralContainer`](#structuralcontainer)



### Getting Started

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

That's it, isn't it so simple? [Here](https://jsfiddle.net/ariyankhan/u25uoLny/) is the fiddling.

Test all the following code snippets [Here](https://jsfiddle.net/ariyankhan/zdw1z7ns/). Just
copy and paste into the fiddling editor and run it. All the necessary files are already
attached.

### Elements

#### `Vector.Element`

`Vector.Element` implements `Container` and `GenericContainer` classes.

The `Vector.Element` class is the Base class for all the SVG DOM wrapper elements. This class
is used to wrap `SVGElement` native interface and its subclasses.
This class provides some basic methods that all the wrappers inherit.

For those elements which has no wrapper implemented yet in `Vector.svg`, the
`Vector.Element` interface is useful.

```javascript
var paper = Vector("paper", 400, 300);

var rect = paper.rect(100, 100)
          .attr("fill", "red");

// title variable is a instance of Vector.Element wrapper
var title = rect.element("title");
title.textContent("This is 100x100 rect");
```

##### `prototype.attr()`

This method is frequently used to manipulate attributes of a element. 

All the forms are:

* `attr(attrName, value, namespace)` : Sets the attribute and returns itself,

* `attr(attrName, value)` : Equivalent to `attr(attrName, value, null)`,

* `attr(attrName, null, namespace)` : Deletes the attribute and returns itself,

* `attr(attrName, null)` : Equivalent `attr(attrName, null, null)`,

* `attr(attrObject, namespace)` : Sets and deletes (if `null` is passed as value) multiple
attributes at once with the specified namespace and returns itself,

* `attr(attrObject)` : Equivalent to `attr(attrObject, null)`

* `attr(attrName)` : Returns the attribute value with namespace = null,

* `attr(attrNamesArr, namespace)` : Returns attribute values as map of attribute names and values,

* `attr(attrNamesArr)` : Equivalent to `attr(attrNamesArr, null)`,

* `attr()` : Returns all the attributes as map of attribute names and values

```javascript
var paper = Vector("paper", 600, 300);

var rect = paper.rect();

// Sets a single attribute
rect.attr("width", 100)
    .attr("height", 100);
    
// Sets multiple attributes    
rect.attr({
  fill: 'red',
  stroke: "purple",
  x: 50,
  y: 50
});

// Sets a single attribute with namespace
rect.attr("href", "rect doesn't contain href attr", Vector.ns.xlink);

// Deletes a attribute
rect.attr("fill", null);

// Gets a attribute value
var fill = rect.attr("stroke");

// Gets a attribute value with namespace
var href = rect.attr(["href"], Vector.ns.xlink).href;

alert(fill);
alert(href);
```

##### `prototype.node()`

Returns the underlying DOM element of the wrapper object. Remember after creating a wrapper, 
you should not change the underlying dom element, if necessary then create a new wrapper.

```javascript
var paper = Vector("paper", 600, 300);

var rect = paper.rect(100, 100).x(10).y(10);
// Gets SVGRectElement DOM node
var node = rect.node();
node.style.fill = "purple";
node.style.stroke = "red";
```

##### `prototype.doc()`

Returns the SVG document to which current element belongs, as `SVGDoc` instance.

```javascript
var paper = Vector("paper", 600, 300);

var rect = paper.rect(100, 100).x(10).y(10);

alert(rect.doc() === paper);
```

##### `prototype.id()`

Sets and gets the `id` attribute. When called as `getter` if the `id` attribute does not exist then a new random id
will be created and returns it.

```javascript
var paper = Vector("paper", 600, 300);

var rect = paper.rect(100, 100).x(10).y(10);
// Attach a new random id
rect.id();

alert(rect.id());
```

##### `prototype.tag`

Returns the tag name of the underlying SVG dom element.

```javascript
var paper = Vector("paper", 600, 300);

var rect = paper.rect(100, 100).x(10).y(10);

alert(rect.tag);
```

#### `Vector.Graphics`

`Vector.Graphics` is a subclass of `Vector.Element`. <br/>

This class represents the native interface `SVGGraphicsElement`. This class normally
does nothing, but it is useful when you want to add your own methods to all
the graphics elements by extending it.

#### `Vector.Geometry`

`Vector.Geometry` is a subclass of `Vector.Graphics`.<br/>

It wraps the `SVGGeometryElement` native interface. It provides some useful methods
to all the shape elements i.e. `Rect`, `Circle`, `Path` etc.

##### `prototype.pathLength()`

Sets and gets the value of `pathLength` attribute.

##### `prototype.length()`

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
Also, if the `width` and `height` or any other dimensions of the shape is in percentage,
then you can get the actual length easily by this method:
 
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

#### `Vector.SVG`

`Vector.SVG` is a subclass of `Vector.Graphics`.<br/>
It implements `ShapeContainer` and `StructuralContainer` classes.<br/>

This class represents the inner `<svg>` element i.e. nested svg document.

```javascript
var paper = Vector("paper", 600, 300);

var svg = paper.svg(100, 100, 10, 10);

svg.circle(40, 50, 50)
   .attr("fill", "purple")
   .attr("stroke", "green");
```
##### `prototype.x()`

Sets and gets the value of `x` attribute.

##### `prototype.y()`

Sets and gets the value of `y` attribute.

##### `prototype.width()`

Sets and gets the value of `width` attribute.

##### `prototype.height()`

Sets and gets the value of `height` attribute.

##### `prototype.size()`

Sets and gets the size of the `<svg>` element in shortcut.

It is equivalent to:

```javascript
svg.width(w).height(h);
```

##### `prototype.viewBox()`

Sets and gets the `viewBox` of the `<svg>` element.

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
##### `prototype.aspectRatio()`

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

#### `Vector.SVGDoc`

`Vector.SVGDoc` is a subclass of `Vector.SVG`.<br/>

The return value of `Vector()` function is a `Vector.SVGDoc` instance. It wraps
the SVG document i.e. the outer most `<svg>` element.

```javascript
var paper = Vector("paper", 400, 300);
```

##### `prototype.container()`

Changes the container element for the SVG document.

```javascript
var paper = Vector(null, 600, 300); // Creates a paper without container
paper.container("paper"); // Now sets the container element by its id or dom instance.

paper.circle(70)
     .cx(100)
     .cy(100)
     .attr("fill", "purple");
```

##### `prototype.defs()`

There is only one `<defs>` element for every SVG document and that resides
as the direct child of the the outer most `<svg>` element.
This instance can be accessed by `defs()` method.

```javascript
var defs = paper.defs();
```

#### `Vector.Rect`

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

##### `prototype.x()`

Sets and gets the value of `x` attribute.

##### `prototype.y()`

Sets and gets the value of `y` attribute.

##### `prototype.width()`

Sets and gets the value of `width` attribute.

##### `prototype.height()`

Sets and gets the value of `height` attribute.

##### `prototype.size()`

Sets and gets the size of the `<rect>` element in shortcut.

It is equivalent to:

```javascript
rect.width(w).height(h);
```
##### `prototype.rx()`

Sets and gets the value of `rx` attribute.

##### `prototype.ry()`

Sets and gets the value of `ry` attribute.

#### `Vector.Circle`

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
##### `prototype.r()`

Sets and gets the value of `r` attribute.

##### `prototype.cx()`

Sets and gets the value of `cx` attribute.

##### `prototype.cy()`

Sets and gets the value of `cy` attribute.

#### `Vector.Path`

`Vector.Path` is a subclass of `Vector.Geometry`.<br/>

Path is used to create complex shapes unlike Polyline or Polygon.
It wraps the `SVGPathElement` native interface. 

```javascript
var paper = Vector("paper", 600, 300);

var path = paper.path();
path.d("M0,0H50A20,20,0,1,0,150,50v40C100,125,0,85,0,85z")
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "purple");
```

##### `prototype.d()`

Sets and gets the path string i.e. the value of `d` attribute. 

#### `Vector.Line`

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

##### `prototype.x1()`

Sets and gets the value of `x1` attribute.

##### `prototype.y1()`

Sets ans gets the value of `y1` attribute.

##### `prototype.x2()`

Sets and gets the value of `x2` attribute.

##### `prototype.y2()`

Sets and gets the value of `y2` attribute.

##### `prototype.from()`

Sets and gets the starting point of the line.

It is equivalent to:

```javascript
line.x1(50).y1(60);
```
##### `prototype.to()`

Sets and gets the end point of the line.

Equivalent to the following:

```javascript
line.x2(100).y2(150);
```

#### `Vector.Ellipse`

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

##### `prototype.rx()`

Sets and gets the value of `rx` attribute.

##### `prototype.ry()`

Sets and gets the value of `ry` attribute.

##### `prototype.cx()`

Sets and gets the value of `cx` attribute.

##### `prototype.cy()`

Sets and gets the value of `cy` attribute.

#### `Vector.Polygon`

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

##### `prototype.points()`

Sets and gets the polygon point-string i.e. the value of `points`
attribute.

#### `Vector.Polyline`

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

##### `prototype.points()`

Sets and gets the polyline point-string i.e. the value of `points`
attribute.

#### `Vector.Defs`

`Vector.Defs` is a subclass of `Vector.Graphics`.<br/>
It implements `ShapeContainer` and `StructuralContainer` classes.<br/>

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

The `<defs>` instance can also be accessed from any element through `doc()` method.

```javascript
circle.doc().defs();
```
#### `Vector.G`

`Vector.G` is a subclass of `Vector.Graphics`.<br/>
It implements `ShapeContainer` and `StructuralContainer` classes.<br/>

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

#### `Vector.Symbol`

`Vector.Symbol` is a subclass of `Vector.Element`.<br/>
It implements `ShapeContainer` and `StructuralContainer` classes.<br/>

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

##### `prototype.viewBox()`

Sets and gets the value of `viewBox` attribute.

##### `prototype.aspectRatio()`

Sets and gets the value of `preserveAspectRatio` attribute.

#### `Vector.Use`

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

##### `prototype.x()`

Sets and gets the value of `x` attribute.

##### `prototype.y()`

Sets and gets the value of `y` attribute.

##### `prototype.width()`

Sets and gets the value of `width` attribute.

##### `prototype.height()`

Sets and gets the value of `height` attribute.

##### `prototype.href()`

Sets and gets the value of the `xlink:href` attribute.

When the first argument is `null` then the `xlink:href` attribute will be
deleted. Also, you can pass any element directly as a referenced element:

```javascript
var paper = Vector("paper", 600, 300);

var circle = paper.defs().circle(15);
paper.use()
     .href(circle)
     .attr("fill", "purple")
     .x(20)
     .y(20);
```

Pass any relative or absolute URL as reference:

```javascript
var paper = Vector("paper", 600, 300);

var circle = paper.defs().circle(15);
var url = "#" + circle.id();
paper.use()
     .href(url)
     .attr("fill", "purple")
     .x(20)
     .y(20);
```

### `Vector` Global

#### The `Vector()` function

This function is called before any drawing. It returns a `Element.SVGDoc` instance
and provides a drawing paper to draw on it.

The syntax is:

```javascript
var paper = Vector(container, width, height);
```

Where,

* `container` : Its value can be a `Element.SVGDoc` object or `window.SVGSVGElement` object or
`window.HTMLElement` object or a string `id`. For others value it returns a 
`SVGDoc` instance which is not attached to the document DOM tree initially, and 
it can be attached by calling `paper.container()` method.

* `width` : The width of the newly created svg document. Default value is `100%`,

* `hieght` : The height of the newly created svg document. Default value is `100%`.

Example:

```javascript
var container = document.getElementById("paper");
var paper = Vector(container, 600, 300);

paper.circle(100)
     .attr("fill", "purple")
     .cx(150)
     .cy(150);
```

If `container` is not given,

```javascript
var paper = Vector().size(600, 300);

paper.circle(100)
     .attr("fill", "purple")
     .cx(150)
     .cy(150);
     
var container = document.getElementById("paper");
paper.container(container);
```

#### `Vector.merge()`

This method copies all own properties(enumerable and non-enumerable)
carefully with descriptors from source objects to target object and merges them.
It does not make deep copy of properties.

The syntax is:

```javascript
var target = Vector.merge(target, sourceObjects);
```

Where,

* `target` : Target object which will be merged by sources,

* `sourceObjects` : The source objects

It returns `target` object.

Example:

```javascript
var source1 = {};
var source2 = {
    a: 999,
    b: 1223
};

Object.defineProperties(source1, {
    x: {
        get: function () {
            return 90;
        },
        configurable: true,
        enumerable: true
    },

    y: {
        get: function () {
            return 888;
        },
        configurable: true,
        enumerable: true
    }
});

// Now all the properties of source1 and source2 will be copied
// into the target object with descriptors.
var target = Vector.merge({}, source1, source2);

alert(Object.getOwnPropertyNames(target));
```

#### `Vector.createElement()`

Creates a SVG element for the specified tag name and returns the actual svg dom node,
not the wrapper one.

The syntax is:

```javascript
var element = Vector.createElement(tagName);
```

Where,

* `tagName` : The tag name of the svg element that will be created.

It returns the newly created svg dom node.

Example:

```javascript
var paper = Vector("paper", 600, 300);

var rect = Vector.wrap(Vector.createElement("rect"));
rect.size(100, 100)
    .attr("fill", "purple");

paper.insert(rect);
```

#### `Vector.setAttribute()`

Sets attribute to a SVG DOM Element.

The syntax is:

```javascript
Vector.setAttribute(svgDomNode, name, value, namespace);
```

Where,

* `svgDomNode` : Any SVG dom element,

* `name` : Attribute name,

* `value` : Attribute value,

* `namespece` : Namespace URI. Default value is `null`.

#### `Vector.setAttributes()`

Sets multiple attributes to a SVG DOM Element.

The syntax is:

```javascript
Vector.setAttributes(svgDomNode, attrs, namespace);
```

Where,

* `svgDomNode` : Any SVG dom element,

* `attrs` : An object containing attributes in key-value pairs,

* `namespece` : Namespace URI. Default value is `null`.

#### `Vector.hasAttribute()`

Checks whether the attribute exists in a SVG DOM Element or not.

The syntax is:

```javascript
var hasAttr = Vector.hasAttribute(svgDomNode, name, namespace);
```

Where,

* `svgDomNode` : Any SVG dom element,

* `name` : Attribute name to be checked,

* `namespece` : Namespace URI. Default value is `null`.

It returns true or false.

#### `Vector.getAttribute()`

Returns attribute value from a SVG DOM element in string.

The syntax is:

```javascript
var attrValue = Vector.getAttribute(svgDomNode, name, namespace);
```

Where,

* `svgDomNode` : Any SVG dom element,

* `name` : Attribute name,

* `namespece` : Namespace URI. Default value is `null`.

It returns attribute value in string.

### `Vector.removeAttribute()`

Deletes a attribute from a SVG DOM Element.

The syntax is:

```javascript
Vector.removeAttribute(svgDomNode, name, namespace);
```

Where,

* `svgDomNode` : Any SVG dom element,

* `name` : Attribute name to be removed,

* `namespece` : Namespace URI. Default value is `null`.

#### `Vector.uuid()`

It is a utility method. It generates RFC4122 version 4 compliant UUID.

```javascript
var uuid = Vector.uuid();

alert(uuid);
```

#### `Vector.unique()`

Returns an array of unique values from an array of values.
Its time complexity is: O(n). It does not alter the main array.

The syntax is:

```javascript
var uniqueVals = Vector.unique(arr);
```

Where,

* `arr` : Any array or array-like object

It returns a new array of unique values.

Example:

```javascript
var obj1 = {};
var obj2 = {};
var values = [100, -22, 56, -22, 5, 100, "abc", obj1, null, undefined, obj2, obj1, obj2, "abc"];

var uniqueValues = Vector.unique(values);

alert(uniqueValues);
```

#### `Vector.wrap()`

It wraps a existing SVG DOM node with a appropriate wrapper class.

The syntax is:

```javascript
var wrappedElem = Vector.wrap(svgDOMNode);
```

Where,

* `svgDOMNode` : Any svg dom node

If `svgDOMNode` is not a `SVGElement` then it returns null,
and if `svgDOMNode` is already wrapped then previous wrapper will be returned,
otherwise a new wrapper object will be returned of appropriate wrapper class.

Example:

```javascript
var paper = Vector("paper", 600, 400);

var rect = Vector.wrap(Vector.createElement("rect"));
var title = Vector.wrap(Vector.createElement("title"));

rect.size(100, 100)
    .attr("fill", "purple")
    .append(title.textContent("Vector.svg is amazing"));

paper.append(rect);
```

#### `Vector.isWrapped()`

Checks if a SVG dom element is wrapped or not.

The syntax is:

```javascript
var isWrapped = Vector.isWrapped(svgDOMNode);
```

Where,

* `svgDOMNode` : Any svg dom node

It returns true or false.

Example:

```javascript
var paper = Vector("paper", 600, 400);

var rectNode = Vector.createElement("rect");

alert(Vector.isWrapped(rectNode));

Vector.wrap(rectNode);

alert(Vector.isWrapped(rectNode));
```

#### `Vector.toIntLength()`

It converts any value to Integer length (Positive Integer value).

The syntax is:

```javascript
var length = Vector.toIntLength(value);
```

Where,

* `value` : Any value

It returns positive integer value.

#### `Vector.unHoles()`

It returns an array of values without holes from an array or array-like object.

The syntax is:

```javascript
var arrWithoutHoles = Vector.unHoles(arr);
```

Where,

* `arr` : Any array or array-like object

It returns a new array, it does'nt alter the main array.

Example:

```javascript
var arrWithHoles = [1, 2,,,, 3, 55, 22,,,99];
var arrWithoutHoles = Vector.unHoles(arrWithHoles);
alert(arrWithoutHoles);
```

#### `Vector.points()`

It formats a pointString (the `points` attribute value of Polygon or Polyline) 
as a array of points. Every point in array is a object containing `x`
and `y` properties.

The syntax is:

```javascript
var pointsArr = Vector.points(pointString);
```

Where,

* `pointString` : A point-string value

It returns a new array of points, every point is a object containing two
coordinates `x` and `y`.

Example:

```javascript
var pointString = "50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40";
var pointArr = Vector.points(pointString);
alert(pointArr);
alert(pointArr[0].x + ", " + pointArr[0].y);
```

#### `Vector.pointString()`

It formats an array of points to a point-string. If pointList is formatted
like: `pointList = [{x: 12, y: 11}, {x: 11, y: 33}, {x: 111, y: 999}]`
then it will be converted to a point string like `"12,11 11,33 111,999"`,
otherwise if pointList is primitive(i.e. string) then it is passed to
`Vector.points()` and then its output value is interpreted.

The syntax is:

```javascript
var pointString = Vector.pointString(pointList);
```

Where,

* `pointList` : A string of points or array or array-like object containing points

It returns a formatted string of points like: `"12,22 34,55 11,44"`.

Example:

```javascript
var points = [{x: 10, y: 18}, {x: 66, y: 667}, {x: 1, y: -44}];

alert(Vector.pointString(points));
```

#### `Vector.isIEOrEdgeBrowser()`

Checks if the current browser is Internet Explorer or Edge or not.

```javascript
var v = Vector.isIEOrEdgeBrowser();
alert("This browser is " + (v ? "" : "not ") + "IE or Edge");
```

#### `Vector.isFirefox()`

Checks if the current browser is firefox or not.

```javascript
var v = Vector.isFirefox();
alert("This browser is " + (v ? "" : "not ") + "firefox");
```
#### `Vector.distance()`

Calculates distance between two points.

The syntax is:

```javascript
var distance = Vector.distance(x1, y1, x2, y2);
```

Where,

* `x1` : x coordinate of first point,

* `y` : y coordinate of first point,

* `x2` : x coordinate of second point,

* `y2` : y coordinate of second point

It returns the distance between two specified points.

```javascript
var distance = Vector.distance(129, 100, 34, 677);
alert(distance);
```

#### `Vector.svgSupported`

Detects whether the current browser `svg` supports or not.

```javascript
if(Vector.svgSupported)
	alert("Yah! You can use Vector.svg in your browser");
else
	alert("Sorry! You can't use Vector.svg in your browser");
```

#### `Vector.ns`

It is a object containing of necessary namespace URIs.

* `ns.svg` : SVG namespace URI,

* `ns.xlink` : XLink namespace URI,

* `ns.ev` : XML-Events namespace URI,

* `ns.xhtml` : XHTML namespace URI,

* `ns.xml` : XML namespace URI


### SVG DOM

These are SVG Document Tree manipulation APIs and are available to all svg
wrapper elements. 

#### `Element.prototype.children()`

Returns all direct child svg elements as an array of wrappers.

The syntax is:

```javascript
var children = elem.children();
```

It returns an array of wrapper objects.

```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();
g.attr("fill", "purple");

var rect = g.rect(100, 100);
var circle = g.circle(50, 150, 150);

alert(g.children().length);
alert(g.children()[0] === rect);
alert(g.children()[1] === circle);
```

#### `Element.prototype.insert()`

Inserts an element at the specified index.

The syntax is:

```javascript
var parent = parent.insert(newElem, index);
```

Where,

* `newElem` : new element to be added,

* `index` : index at which `newElem` will be added

It returns itself for chaining.

```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();

g.insert(paper.rect(100, 100).attr("fill", "purple"))
 .insert(paper.circle(50, 100, 100).attr("fill", "red"), 0)
 .insert(paper.ellipse(70, 30, 140, 60).attr("fill", "green"), 1);
```

#### `Element.prototype.append()`

Inserts an element at the end.

The syntax is:

```javascript
var parent = parent.append(newElem);
```

Where,

* `newElem` : new element to be added,

It returns itself for chaining.

```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();

g.append(paper.rect(100, 100).attr("fill", "purple"))
 .append(paper.circle(50, 100, 100).attr("fill", "red"))
 .append(paper.ellipse(70, 30, 140, 60).attr("fill", "green"));
```

#### `Element.prototype.remove()`

Removes an element or an element of the given index from parent.

The syntax is:

```javascript
var parent = parent.remove(elem);
```

Where,

* `elem` : child element or index of the element

It returns itself for chaining.

#### `Element.prototype.has()`

Checks whether a element is a child of the parent.

The syntax is:

```javascript
var isChild = parent.has(elem);
```

Where,

* `elem` : child element to be checked

It returns true or false.

#### `Element.prototype.replace()`

Replaces an existing child element with a new element.

The syntax is:

```javascript
var parent = parent.replace(newElem, oldElem);
```

Where,

* `newElem` : new element,

* `oldElem` : existing child element

It returns itself for chaining.

#### `Element.prototype.textContent()`

Sets text content of any node.
It is useful for `<title>` or `<desc>` elements.

The syntax is:

```javascript
var parent = parent.textContent(text);
```

Where,

* `text` : texts that will be added

It returns itself for chaining.

### Events



### Data Binding



### Containers

Note: The following Container classes are internal part of this library and not exported
to `Vector` global object. If you are interested to contribute to this project
you should know these APIs.

#### `Container`

This class is the super class of all the containers.
These containers provide container based methods to add elements and
these methods are merged to actual svg wrapper class, so remember
these containers are not in the prototype chain of actual svg wrapper classes.

##### `makeInheritance()`

Merges all the exported container methods from container's `prototype.exports` object
to the wrapper class's `prototype` object, that's why wrapper elements can
call `rect()`, `circle()`, `line()`, `path()`, `g()` etc methods to insert
a new element.

##### `prototype.exports`

This object holds the container based methods that will be exported to wrapper
class when `container.makeInheritance()` method is called.

#### `GenericContainer`

`GenericContainer` is a subclass of `Container`.<br/>

This type of container provides capability of adding any svg element
as `Vector.Element` wrapper class. This Interface is useful when a svg
element has no wrapper class implemented yet in `Vector.svg`.
In this case `Vector.Element` is used to wrap.

##### `prototype.exports.element()`

This method is used to add any svg element to a container and in this case
`Vector.Element` is used to wrap. It adds the new element as last child.

The syntax is:

```javascript
var elem = container.element(tagName);
```

Where,

* `tagName` : The tag name of svg element that will be created

It returns a new instance of `Vector.Element`.

```javascript
var paper = Vector("paper", 600, 300);

var desc = paper.element("desc");
desc.textContent("Vector.svg is a SVG manipulation library. \
I love Vector.svg");

alert(paper.textContent());
```

#### `ShapeContainer`

`ShapeContainer` is a subclass of `Container`.<br/>

This type of container can add shape elements i.e.
`<path>`, `<rect>`, `<circle>` etc.

##### `prototype.exports.rect()`

Appends a new `<rect>` element to a container to the end.

The syntax is:

```javascript
var rect = container.rect(width, height, x, y, rx, ry);
```

Where,

* `width` : width of the rect,

* `height` : height of the rect,

* `x` : x coordinate of top-left corner,

* `y` : y coordinate of top-left corner,

* `rx` : horizontal corner radius of the rect,

* `ry` : vertical corner radius of the rect

It returns a new instance of `Vector.Rect`.

```javascript
var paper = Vector("paper", 600, 300);

var rect = paper.rect(160, 150, 50, 50, 10, 10);
rect.attr("fill", "purple");
```

##### `prototype.exports.circle()`

Appends a new `<circle>` element to a container to the end.

The syntax is:

```javascript
var circle = container.circle(r, cx, cy);
```

Where,

* `r` : radius of the circle,

* `cx` : x coordinate of the centre of the circle,

* `cy` : y coordinate of the centre of the circle

It returns a new instance of `Vector.Circle`.

```javascript
var paper = Vector("paper", 600, 300);

var circle = paper.circle(50, 100, 100);
circle.attr("fill", "purple");
```

##### `prototype.exports.ellipse()`

Appends a new `<ellipse>` element to a container to the end.

The syntax is:

```javascript
var ellipse = container.ellipse(rx, ry, cx, cy);
```

Where,

* `rx` : x-radius of the ellipse,

* `ry` : y-radius of the ellipse,

* `cx` : x coordinate of the centre of the ellipse,

* `cy` : y coordinate of the centre of the ellipse

It returns a new instance of `Vector.Ellipse`.

```javascript
var paper = Vector("paper", 600, 300);

var ellipse = paper.ellipse(70, 50, 100, 100);
ellipse.attr("fill", "purple");
```

##### `prototype.exports.line()`

Appends a new `<line>` element to a container to the end.

The syntax is:

```javascript
var line = container.line(x1, y1, x2, y2);
```

Where,

* `x1` : x coordinate of the starting point,

* `y1` : y coordinate of the starting point,

* `x2` : x coordinate of the end point,

* `y2` : y coordinate of the end point

It returns a new instance of `Vector.Line`.

```javascript
var paper = Vector("paper", 600, 300);

var line = paper.line(0, 0, 300, 300);
line.attr("stroke", "purple");
```

##### `prototype.exports.path()`

Appends a new `<path>` element to a container to the end.

The syntax is:

```javascript
var path = container.path(d);
```

Where,

* `d` : path string of the path,

It returns a new instance of `Vector.Path`.

```javascript
var paper = Vector("paper", 600, 300);

var path = paper.path("M0,0H50A20,20,0,1,0,150,50v40C100,125,0,85,0,85z");
path.attr("stroke", "purple")
    .attr("fill", "none");
```

##### `prototype.exports.polygon()`

Appends a new `<polygon>` element to a container to the end.

The syntax is:

```javascript
var polygon = container.polygon(points);
```

Where,

* `points` : point string of the polygon,

It returns a new instance of `Vector.Polygon`.

```javascript
var paper = Vector("paper", 600, 300);

var polygon = paper.polygon("50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40");
polygon.attr("stroke", "purple")
       .attr("fill", "none");
```

##### `prototype.exports.polyline()`

Appends a new `<polyline>` element to a container to the end.

The syntax is:

```javascript
var polyline = container.polyline(points);
```

Where,

* `points` : point string of the polyline,

It returns a new instance of `Vector.Polyline`.

```javascript
var paper = Vector("paper", 600, 300);

var polyline = paper.polyline("50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40");
polyline.attr("stroke", "purple")
        .attr("fill", "none");
```

#### `StructuralContainer`

`StructuralContainer` is a subclass of `Container`.<br/>

This type of container can contain structural elements i.e
`<defs>`, `<g>`, `<svg>`, `<symbol>`, `<use>`.

Note: Only `SVGDoc` wrapper can contain `<defs>` element by `defs()` method.

##### `prototype.exports.g()`

Appends a new `<g>` element to a container to the end.

The syntax is:

```javascript
var group = container.g();
```

It returns a new instance of `Vector.G`.

```javascript
var paper = Vector("paper", 600, 300);

var g = paper.g();
g.attr("fill", "purple")
 .attr("transform", "translate(80, 80)")
 .circle(20, 30, 30);

// Nested groups
var g1 = g.g();
g1.attr("fill", "red")
  .attr("transform", "translate(80, 80)")
  .circle(20, 30, 30);
```

##### `prototype.exports.svg()`

Appends a new `<svg>` element to a container to the end.

The syntax is:

```javascript
var svg = container.svg(width, height, x, y);
```

Where,

* `width` : width of the svg doc viewport,

* `height` : height of the svg doc viewport,

* `x` : x coordinate of top-left corner,

* `y` : y coordinate of top-left corner

It returns a new instance of `Vector.SVG`.

```javascript
var paper = Vector("paper", 600, 300);

var svg = paper.svg(100, 100, 10, 10);

svg.circle(40, 50, 50)
   .attr("fill", "purple")
   .attr("stroke", "green");
```

##### `prototype.exports.symbol()`

Appends a new `<symbol>` element to a container to the end.

The syntax is:

```javascript
var symbol = container.symbol();
```

It returns a new instance of `Vector.Symbol`.

```javascript
var paper = Vector("paper", 600, 300);

var symbol = paper.defs().symbol();
symbol.rect(100, 100)
      .attr("fill", "red");
      
paper.use(symbol);
```

##### `prototype.exports.use()`

Appends a new `<use>` element to a container to the end.

The syntax is:

```javascript
var use = container.use(elem, width, height, x, y);
```

Where,

* `elem` : wrapper element or any URL or null to remove,

* `width` : width of the use element,

* `height` : height of the use element,

* `x` : x coordinate of top-left corner,

* `y` : y coordinate of top-left corner

It returns a new instance of `Vector.Use`.

```javascript
var paper = Vector("paper", 600, 300);

var circle = paper.defs().circle(15);

paper.use(circle)
     .attr("fill", "purple")
     .x(20)
     .y(20);
```

## Contributors

   * [Rousan Ali](https://github.com/ariyankhan)
   
   Contributions are welcome
   
## License

MIT License

Copyright (c) 2017 Rousan Ali

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
