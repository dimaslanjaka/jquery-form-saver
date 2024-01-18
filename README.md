# Smartform JS

https://github.com/dimaslanjaka/smartform

## Features

-   Automatically save all input field whole document web to reuse later
-   Allow browser save user input automatically and restore after page loaded.

## Requirements

-   field has name attribute (auto create if not exists)
-   field has id attribute (auto create if not exists)

## Usages

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
<script src="https://rawcdn.githack.com/dimaslanjaka/smartform/87404cd0bdb9497691042fdd51b8e44d150aa6a2/dist/release/autosave.js"></script>
```

### Codepen Example
- [Multiple Example](http://dimaslanjaka.github.io/smartform/)
- [Text Input](https://codepen.io/dimaslanjaka/pen/qBNOoOe?editors=1010)
- [Radio Button](https://codepen.io/dimaslanjaka/pen/LYjbjvr)
- [Ignore Save](https://www.webmanajemen.com/smartform/ignore.html) (ignoring input to save the data)
