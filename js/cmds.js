/**
 * 
 */

var cmds = (function(ajax) {
	
	var nextPage = 1;
	
	function dummy() {};
	
	function command(cb, cmd, data) {
		ajax.send({c: cmd}, data,
				function(data) {
					if (!data.success)
						cb(false, (data.err ? data.err : []));
					else
						cb(true, (data.data ? data.data : data.rows));
				},
				function(xhr, status, error) {
					cb(false, [status, error]);
				});
	}
	
	function getAll(cb) {
		command(cb, 'get', {all: true});
	}
	
	function getId(cb, id) {
		command(cb, 'get', {id: id});
	}
	
	function get(cb, page, pagesize) {
		data = {};
		if (page)
			data['page'] = page;
		if (pagesize)
			data['pagesize'] = pagesize;
		command(cb, 'get', data);
	}
	
	
	
	function complete(cb, id, val) {
		command(cb, 'complete', {id: id, done: val});
	}
	
	function remove(cb, id) {
		command(cb, 'remove', {id: id});
	}
	
	function add(cb, title, notes, priority, due) {
		data = {title: title};
		if (notes)
			data.notes = notes;
		if (priority)
			data.priority = priority;
		if (due)
			data.due = due;
		command(cb, 'add', data);
	}
	
	function edit(cb, id, field, val) {
		if (typeof field === 'string' && typeof val !== 'undefined') {
			data = {id: id};
			data[field] = val;
		} else {
			data = field;
			data.id = id;
		}
		command(cb, 'edit', data);
	}
	
	
	var priorityFns = {
			
			get: 
			function getPriorities(cb) {
				command(cb, 'priorities');
			},
			
	};
	
	
	
	return {
		getAll: getAll,
		getId: getId,
		get: get,
		getNext: (function(cb) { get(cb, nextPage++); }),
		resetNext: (function() { nextPage = 1; }),
		setNext: (function(n) { nextPage = n;}),
		add: add,
		remove: remove,
		edit: edit,
		complete: (function(cb, id) { complete(cb, id, true); }),
		uncomplete: (function(cb, id) { complete(cb, id, false); }),
		
		priorities: priorityFns,
	};
})(ajax);