/**
 * 
 */

var on = (function($, cmds) {
	
	var MAXTRIES = 3;
	
	function retrier(retry, success, failure, max) {	//TODO: put this in util
		var cb;
		if (!max)
			max = MAXTRIES;
		cb = (function() {
			var tries = 1;
			return (function callback(status, val) {
				if (status) {
					if (success)
						success(val);
				} else if (tries < max) {
					console.log('Trying again (' + tries + ')');
					retry(callback);
					tries ++;
				} else {
					if (failure)
						failure(val);
					console.log(val);
				}
			});
		})();
		return cb;
	}
	
	function doTries(func, success, failure) {
		func(retrier(func, success, failure));
	}
	
	function fillPriority(el, priority) {	//TODO: put this in page
		el.find('.id').text(priority.id);
		el.find('.order').text(priority.ordinal);
		el.find('.value').text(priority.textval);
	}
	
	function getTaskId(el) {	//TODO: put this in page
		var e = $(el);
		if (!e.hasClass('task'))
			e = $(el).parents('.task');
		return +e.find('.id').text();
	}
	
	function getTaskTitle(el) {	//TODO: put this in page
		var e = $(el);
		if (!e.hasClass('task'))
			e = $(el).parents('.task');
		return e.find('.title').text();
	}
	
	
	
	
	function onLoad(cbs) {
		getPriorities(cbs && 'priorities' in cbs ? cbs.priorities : undefined);
		getTasks(cbs && 'tasks' in cbs ? cbs.tasks : undefined);
	}
	
	function onDone() {
		setDone(getTaskId(this), $(this).prop('checked'));
	}
	
	function onRemove() {
		if (confirm('Delete "' + page.task.title.get(this).ellipsize() + '"'))
			remove(getTaskId(this));
	}
	
	function onAdd() {
		title = $('#addtitle').val();
		if (!title) {
			alert('Please enter some text');
			return;
		}
		addTask(title);
	}
	
	function onAll() {
		$('.task').not('.proto, .expanded').click();
	}
	
	function onNone() {
		$('.task.expanded').not('.proto').click();
	}
	
	function onTask() {
		expandTask(getTaskId(this));
	}
	
	function onTitleEdit(el, val) {
		editTask(getTaskId(el), 'title', val);
	}
	
	function onNotesEdit(el, val) {
		editTask(getTaskId(el), 'notes', val);
	}
	
	function onDueEdit(el, val) {
		console.log(val);
		editTask(getTaskId(el), 'due', val);
	}
	
	function onDueAction(ev) {
		ev.stopPropagation();
		if ($(this).hasClass('empty'))
			$(this).parent().find('.value').click();
		else
			onDueEdit($(this), '');
	}
	
	function onPriorityEdit(el, val) {
		editTask(getTaskId(el), 'priority', page.data.priorities.id(val));
	}
	
	
		
	function getTasks(after) {
		doTries(cmds.getAll, function(t) { updateTasks(t); if (after) after(); });
	}
	
	function getTask(id, after) {
		doTries(function(cb) { cmds.getId(cb, id); }, function(t) { updateTasks(t); if (after) after(); });
	}
	
	function getPriorities(after) {
		doTries(cmds.priorities.get, function(p) { savePriorities(p); if (after) after(); });
	}
	
	function updateTasks(tasks) {
		if (!$.isArray(tasks))
			tasks = [tasks];
		$.each(tasks, function(i,t) {
			if (page.task.exists(t))
				page.task.update(t, t);
			else
				page.task.add(t);
		});
		page.task.sort();
	}
	
	function savePriorities(priorities) {
		if (!$.isArray(priorities))
			priorities = [priorities];
		priorities.sort(function(a,b) { return a.ordinal - b.ordinal; });
		$('#data #priorities').children().not('.proto').remove();
		$.each(priorities, function(i, priority) {
			var p = $('.priority.proto').clone(true).removeClass('proto').appendTo('#data #priorities');
			fillPriority(p, priority);
		});
	}
	
	function setDone(id, val) {
		doTries(function(cb) { (val ? cmds.complete(cb, id) : cmds.uncomplete(cb, id)); }, function() { getTask(id); }); //function() { markDoneCheckbox(id, val); }, function() { markDoneCheckbox(id, !val); });
	}
	
	function markDoneCheckbox(id, val) {
		$('#id'+id+' .done :checkbox').prop('checked', val);
	}
	
	function remove(id) {
		doTries(function(cb) { cmds.remove(cb, id); }, function() { removeTask(id); });
	}
	
	function removeTask(id) {
		$('#id'+id).remove();
	}
	
	function addTask(title) {
		doTries(function(cb) { cmds.add(cb, title); }, updateTasks);
	}
	
	function expandTask(id) {
		$('#id'+id).toggleClass('expanded');
	}
	
	function editTask(id, field, val) {
		console.log(id + ' - ' + field + ': ' + val);
		doTries(function(cb) { cmds.edit(cb, id, field, val); }, function() { getTask(id); });
	}
	
	return {
		load: onLoad,
		done: onDone,
		remove: onRemove,
		add: onAdd,
		task: onTask,
		all: onAll,
		none: onNone,
		title: onTitleEdit,
		notes: onNotesEdit,
		priority: onPriorityEdit,
		due: onDueEdit,
		dueAction: onDueAction,
	};
})($, cmds);