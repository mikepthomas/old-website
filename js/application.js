require(["require-config"],function(){require(["jquery"],function(e){e("html").find("*[data-js]").each(function(n,o){var r=e(o),u=r.data("js");u?e.each(u.split(" "),function(e,n){require([n],function(e){e.default(r)},function(e){console.log(e.requireModules[0]+".js not found.")})}):console.error("Empty data-js tag found, remove references.")})})});
//# sourceMappingURL=application.js.map
