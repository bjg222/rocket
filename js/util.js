/**
 * 
 */

String.prototype.capitalizeWords = function(keep) {
    return (keep ? this : this.toLowerCase()).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.pad = function(places) {
	if (isNaN(this))
		return;
	if (!places)
		places = 2;
	var s = (+this) + '';
	return (new Array(Math.max(places-s.length+1, 0)).join('0') + s);
}

$.fn.exists = function () {
    return this.length > 0;
};

$.fn.onFirst = function(event, handler) {
	this.on(event, handler);
	this.each(function() {
		var e = $._data(this, 'events');
		e[event.split('.')[0]].unshift(e.click.pop());
	});
	return this;
};

//Date.prototype.isValid = function() {
//	return (this != 'Invalid Date' && this.getTime());
//}
//
//Date.toLocalTimezone = function() {
//	if (this.getTimezoneOffset() == (new Date()).getTimezoneOffset())
//		return this;
//	var diff = 
//}
//
//Date.make = function(d) {
//	var date = (function() {
//		if (d instanceof Date)
//			return d;
//		if (d instanceof Array) {
//			switch (d.length) {
//			case 0: return new Date();
//			case 1: return new Date(d[0]);
//			case 2: return new Date(d[0], d[1]);
//			case 3: return new Date(d[0], d[1], d[2]);
//			case 4: return new Date(d[0], d[1], d[2], d[3]);
//			case 5: return new Date(d[0], d[1], d[2], d[3], d[4]);
//			case 6: return new Date(d[0], d[1], d[2], d[3], d[4], d[5]);
//			case 7: return new Date(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
//			}
//		}
//		return new Date(d);
//	})();
//	return (date.isValid() ? date.toLocalTimezone() : undefined);
//}