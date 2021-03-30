(function () {
  formsaver();
})();
$("#create").on("submit", function (e) {
  e.preventDefault();
  var form = $(this);
  var url = form.attr("action");
  var data = $(this).serialize().split("&");
  //console.log(data);
  var obj = {};
  for (var key in data) {
    console.log(data[key]);
    obj[data[key].split("=")[0]] = data[key].split("=")[1];
  }
  setCookie(`cookie_${obj.name}`, obj.value, 60);
  //console.log(obj);
});
$("#deleteAllCookie").on("click", function (e) {
  e.preventDefault();
  deleteAllCookies();
});
setInterval(() => {
  var tobeprinted = getCookies();
  tobeprinted.localStorageAvailable = localStorageAvailable();
  $("#allcookies").text(JSON.stringify(tobeprinted, null, 4));
}, 1000);

function getCookies() {
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
  }
  return cookies;
}

function setCookie(cname, cvalue, minutes) {
  var d = new Date();
  d.setTime(d.getTime() + minutes * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    if (window.CP.shouldStopExecution(0)) break;
    var c = ca[i];
    while (c.charAt(0) == " ") {
      if (window.CP.shouldStopExecution(1)) break;
      c = c.substring(1);
    }
    window.CP.exitedLoop(1);
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  window.CP.exitedLoop(0);
  return "";
}

function localStorageAvailable() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
