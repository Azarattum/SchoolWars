_CurrentRequestScript = document.currentScript.src;
_DefaultRequestScript = "";

function setScript(script)
{
	_DefaultRequestScript = script;
}

function request(request, param1, param2, param3)
{
	var arguments = [];
	var script = _DefaultRequestScript;
	var async, callback;

	switch (typeof(param1)) {
		case "string": script = param1; break;
		case "object": arguments = param1; break;
		case "function": callback = param1; break;
		case "boolean": async = param1; break;
	}
	
	switch (typeof(param2)) {
		case "string": script = param2; break;
		case "object": arguments = param2; break;
		case "function": callback = param2; break;
		case "boolean": async = param2; break;
	}
	
	switch (typeof(param3)) {
		case "string": script = param3; break;
		case "object": arguments = param3; break;
		case "function": callback = param3; break;
		case "boolean": async = param3; break;
	}
	
	if (async == undefined)
		async = callback ? true : false;
	
	return _request(request, arguments, script, async, callback);
}

function _request(request, arguments, script, async, callback)
{
	var x = new(this.XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
	x.open("GET", _getLibLoc(), async);
	
	x.setRequestHeader("Script", _encode(script));
	x.setRequestHeader("Request", _encode(request));
	x.setRequestHeader("Arguments", _encode(JSON.stringify(arguments)));
	
	if (async) {
		x.onload = function (progressEvent) {
			var response = _decode(progressEvent.target.responseText);
			if (response.indexOf("<!--error-->") == 0) {
				console.error(response);
				if (callback)
					callback(null);
			} else if (callback)
				callback(response);
		}
	}
	
	x.send(null);
	
	if (!async) {
		var response = _decode(x.responseText);
		if (response.indexOf("<!--error-->") == 0)
			console.error(response);
		else
			return response;
	}

	return null;
}

function _encode(plainText)
{
	return encodeURIComponent(plainText).replace(new RegExp("%20","g"),"+");
}
	
function _decode(encodedText)
{
	return decodeURIComponent(encodedText.replace(new RegExp("[+]","g"),"%20"));
}
	
function _getLibLoc()
{
	var libdir = _CurrentRequestScript.replace(new RegExp("\\\\","g"),"/").split(".").slice(0,-1).join(".") + ".php";
	return libdir;
}