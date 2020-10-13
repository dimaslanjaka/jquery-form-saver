(function () {
	smartform();
})();
$("#create").on("submit", function (e) {
	e.preventDefault();
	var form = $(this);
	var url = form.attr("action");
	var data = form.serialize();
	console.log(data);
});

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
