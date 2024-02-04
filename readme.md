# Jquery Form Saver JS

https://github.com/dimaslanjaka/jquery-form-saver

## Features

-   Automatically save all input field whole document web to reuse later
-   Allow browser save user input automatically and restore after page loaded.
-   Work without jquery (auto detect jquery undefined) using `smartform` function

## Requirements

-   field has name attribute (auto create if not exists)
-   field has id attribute (auto create if not exists)

## Usages

### in module
#### without jquery

```js
import JqueryFormSaver from 'jquery-form-saver';

// auto save input,textarea,select elements
const elements = document.querySelectorAll('input,textarea,select');
// debug to console.log
const show_debug = true;
if (show_debug) console.log(elements);
elements.forEach(function (el, _key, _parent) {
    new JqueryFormSaver(el, { debug: show_debug, method: 'vanilla' });
});
```

#### with jquery

```js
// debug to console.log
const show_debug = true;
jQuery('input,textarea,select').each(function (_i, _el) {
    new JqueryFormSaver(this, { debug: show_debug, method: 'jquery' });
});
```

in browser

```html
<!--include jquery before this, if your project has jquery-->
<script src="dist/release/bundle.min.js"></script>
<script>
    (function () {
        console.clear();
        console.log("Form saver page start");
        //automatically save and restore all forms
        formsaver(true); // true for debug
    })();
</script>
```

or automatically trigger save all inputs without any calls.

```html
<script src="https://rawcdn.githack.com/dimaslanjaka/jquery-form-saver/87404cd0bdb9497691042fdd51b8e44d150aa6a2/dist/release/autosave.js"></script>
```

### Codepen Example
- [Multiple Example](http://dimaslanjaka.github.io/jquery-form-saver/)
- [Text Input](https://codepen.io/dimaslanjaka/pen/qBNOoOe?editors=1010)
- [Radio Button](https://codepen.io/dimaslanjaka/pen/LYjbjvr)
- [Ignore Save](https://www.webmanajemen.com/jquery-form-saver/ignore.html) (ignoring input to save the data)
