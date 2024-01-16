function loadAutoSaveJS(url, completeCallback) {
   var script = document.createElement('script'), done = false,
       head = document.getElementsByTagName("head")[0];
   // when <head/> not set
   if (!head) {
      // append to first <body/> tag
      head = document.getElementsByTagName("body")[0];
   }
   if (!head) {
      // append to first <script/> tag
      head = document.getElementsByTagName("script")[0];
   }
   script.src = url;
   script.onload = script.onreadystatechange = function(){
     if ( !done && (!this.readyState ||
          this.readyState == "loaded" || this.readyState == "complete") ) {
       done = true;
       completeCallback();

      // IE memory leak
      script.onload = script.onreadystatechange = null;
      head.removeChild( script );
    }
  };
  head.appendChild(script);
}

loadAutoSaveJS("https://raw.githack.com/dimaslanjaka/smartform/master/dist/release/bundle.min.js", function(){
   // auto save all inputs, select, radio, textarea without debug (silently)
   autosave();
});
