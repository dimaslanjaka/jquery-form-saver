# Smartform JS

https://github.com/dimaslanjaka/smartform

## Features

-   Automatically save all input field whole document web to reuse later
-   Allow browser save user input automatically and restore after page loaded.

## Requirements

-   field has name attribute (auto create if not exists)
-   field has id attribute (auto create if not exists)

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

### Codepen Example
- [Multiple Example](http://dimaslanjaka.github.io/smartform/)
- [Text Input](https://codepen.io/dimaslanjaka/pen/qBNOoOe?editors=1010)
- [Radio Button](https://codepen.io/dimaslanjaka/pen/LYjbjvr)
