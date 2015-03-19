/**
 * 
 */

var ajax = (function($) {
	
	var url = 'php/ajax.php';
	var lastData = {};
	
	function doAjax(url, method, data, success, failure) {
		if (!data)
			data = '';
		$.ajax({
			url: url,
			type: method,
			dataType: 'json',
			data: data,
			success: success,
			error: failure
		});
	}
	
    function callback(func, failure) {
		if (failure) {
			return (function(xhr, status, error) {
				lastData = null;
				if (func)
					func(status, error);
			});
		} else {
			return (function(data) {
				lastData = data;
				if (func)
					func(data);
			});
		}
	}

	
	var send = (function(getData, postData, success, failure) { 
		doAjax((postData && getData ? url + '?' + $.param(getData) : url), 
				(postData ? 'POST' : 'GET'), (postData ? postData : getData), callback(success), callback(failure, true));
		});
	var get = (function(data, success, failure) { send(data, {}, success, failure); });
	var post = (function(data, success, failure) { send({}, data, success, failure); });
	var last = (function() { return lastData; });
	
	return {
		send: send,
		get: get,
		post: post,
		last: last
	};
})($);