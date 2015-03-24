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

String.prototype.ellipsize = function(len) {
	if (!len)
		len = 20;
	if (this.length > len)
		return this.substring(0, len) + '...';
	return this;
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
