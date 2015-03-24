/**
 * 
 */

var page = (function($) {
	
	
	function newTask() {
		return $('.task.proto').clone(true).removeClass('proto').attr('id', 'idnew').appendTo('#tasks');
	}
	
	function addTask(data) {
		return updateTask(newTask(), data)
	}
	
	function updateTask(task, data) {
		setTaskId(task, data.id);
		setTaskAdded(task, data.added);
		setTaskCompleted(task, data.completed);
		setTaskDone(task, data.done);
		setTaskTitle(task, data.title);
		setTaskPriority(task, data.priority);
		setTaskDue(task, data.due);
		setTaskNotes(task, data.notes);
	}
	
	function getTask(task) {
		if ($.isNumeric(task))
			return $('#tasks .task#id' + task);
		if (task instanceof jQuery && task.hasClass('task'))
			return task;
		if (task instanceof jQuery && task.parents('.task').exists())
			return task.parents('.task');
		if (task.id && $.isNumeric(task.id))
			return $('#tasks .task#id' + task.id);
		if (task.id)
			return $('#tasks .task#' + task.id)
		return $();
	}
	
	function isTask(task) {
		return getTask(task).length > 0;
	}
	
	function sortTasks() {
		$('#tasks .task').not('.proto').sort(compareTasks).detach().appendTo('#tasks');
	}
	
	function compareTasks(a, b) {
		//	Return:
		//		-1 if a should be higher in the list than b
		//		 1 if a should be lower in the list than b
		//  	 0 otherwise
		//	Sort order (top to bottom):
		//		done (not done to done)
		//		if both done:
		//			completed date (later to earlier)
		//			due date (later to earlier)
		//			added (later to earlier)
		//		if neither done:
		//			due date (earlier to later)
		//			added date (earlier to later)
		a = getTask(a);
		b = getTask(b);
		var done = compareTasksDone(a, b);
		var priority = compareTasksPriority(a, b);
		var completed = compareTasksCompleted(a, b);
		var due = compareTasksDue(a, b);
		var added = compareTasksAdded(a, b);
		if (done)	return done;
		if (getTaskDone(a) && getTaskDone(b)) {
			if (completed)	return -completed;
			if (due)		return -due;
			if (added)		return -added;
			if (priority)	return priority;
		} else {
			if (priority)	return priority;
			if (due)		return due;
			if (added)		return added;
		}
		return 0;
	}
	
	function compareTasksDone(a, b) {
		if (!getTaskDone(a) && getTaskDone(b))
			return -1;
		if (getTaskDone(a) && !getTaskDone(b))
			return 1;
		return 0;
	}
	
	function compareTasksPriority(a, b) {
		if (getPriorityOrder(getTaskPriority(a)) < getPriorityOrder(getTaskPriority(b)))
			return -1;
		if (getPriorityOrder(getTaskPriority(a)) > getPriorityOrder(getTaskPriority(b)))
			return 1;
		return 0;
	}
	
	function compareTasksDue(a, b) {
		return compareDates(getTaskDue(a), getTaskDue(b));
	}
	
	function compareTasksCompleted(a, b) {
		return compareDates(getTaskCompleted(a), getTaskCompleted(b));
	}
	
	function compareTasksAdded(a, b) {
		return compareDates(getTaskAdded(a), getTaskAdded(b));
	}
	
	function setTaskId(task, id) {
		if ($.isNumeric(id)) {
			task.attr('id', 'id' + id);
			task.find('.id').text(id);
		}
	}
	
	function getTaskId(task) {
		return +task.find('.id').text();
	}
	
	function setTaskAdded(task, added) {
		setDate(task.find('.added'), moment(added));
	}
	
	function getTaskAdded(task) {
		return getDate(task.find('.added'));
	}
	
	function setTaskCompleted(task, completed) {
		setDate(task.find('.completed'), moment(completed));
	}
	
	function getTaskCompleted(task) {
		return getDate(task.find('.completed'));
	}
	
	function setTaskDone(task, done) {
		task.find('.done :checkbox').prop('checked', done);
	}
	
	function getTaskDone(task, done) {
		return task.find('.done :checkbox').prop('checked');
	}
	
	function setTaskTitle(task, title) {
		task.find('.title .value').text(title);
	}
	
	function getTaskTitle(task) {
		return task.find('.title .value').text();
	}
	
	function setTaskPriority(task, priority) {
		if ($.isNumeric(priority))
			priority = getPriorityValue(priority)
		//if (isPriority(priority))
		task.find('.priority').removeClass(getPriorityValues().join(' ').toLowerCase()).addClass(priority.toLowerCase()).find('.value').text(priority.capitalizeWords());
	}
	
	function getTaskPriority(task) {
		return task.find('.priority .value').text();
	}
	
	function setTaskDue(task, val) {
		var due = task.find('.due');
		if (val) {
			var date = moment(val);
			if (date) {
				setDueValue(due, date);
				setDueAction(due, date);
			} else
				return;
		} else {
			setDueValue(due);
			setDueAction(due);
		}
	}
	
	function setDueValue(due, val) {
		setDate(due.find('.value'), val);
	}
	
	function setDueAction(due, val) {
		if (val)
			due.find('.action').text('X').removeClass('empty');
		else
			due.find('.action').text('D').addClass('empty');
	}
	
	function getTaskDue(task) {
		return getDate(task.find('.due .value'));
	}

	function setTaskNotes(task, notes) {
		if (notes)
			task.find('.notes .value').text(notes);
	}
	
	function getTaskNotes(task) {
		if (task.find('.notes .value .empty').length)
			return '';
		return task.find('.notes .value').text();
	}
	
	function setDate(date, val) {
		if (val) {
			date.find('.year').text(val.year());
			date.find('.month').text(val.month()+1);
			date.find('.day').text(val.date());
			date.find('.hour').text(val.hour());
			date.find('.minute').text(val.minute());
			date.find('.second').text(val.second());
		} else {
			date.find('.year').text('');
			date.find('.month').text('');
			date.find('.day').text('');
			date.find('.hour').text('');
			date.find('.minute').text('');
			date.find('.second').text('');
		}
	}
	
	function getDate(date) {
		return moment([+date.find('.year').text(), 
		               +date.find('.month').text()-1, 
		               +date.find('.day').text(),
		               +date.find('.hour').text(),
		               +date.find('.minute').text(),
		               +date.find('.second').text()]);
	}
	
	function compareDates(a, b) {
		if (a.isValid() && !b.isValid())
			return -1;
		if (!a.isValid() && b.isValid())
			return 1;
		if (!a.isValid() && !b.isValid())
			return 0;
		if (a < b)
			return -1;
		if (a > b)
			return 1;
		return 0;
	}

	

	
	function getPriorityValues() {
		return $('#data #priorities .priority').not('.proto').find('.value').map(function() { return $(this).text(); }).get();
	}
	
	function getPriorityId(val) {
		return +$('#data #priorities .priority .value:contains(' + val + ')').parent().find('.id').text();
	}
	
	function getPriorityOrder(val) {
		if (!$.isNumeric(val))
			val = getPriorityId(val);
		return +$('#data #priorities .priority .id:contains(' + val + ')').parent().find('.order').text();
	}
	
	function getPriorityValue(val) {
		return $('#data #priorities .priority .id:contains(' + val + ')').parent().find('.value').text();
	}
	
	function isPriority(val) {
		return (($.isNumeric(val) && getPriorityValue(val).length > 0) || (!$.isNumeric(val) && getPriorityId(val) > 0));
	}
	
	
	
	var ret = {
		task: {
			add: addTask,
			update: function(t, v) { return updateTask(getTask(t), v); },
			exists: isTask,
			sort: sortTasks,
			id: {
				get: function(t) { return getTaskId(getTask(t)); },
				set: function(t, v) { return setTaskId(getTask(t), v); },
			},
			done: {
				get: function(t) { return getTaskDone(getTask(t)); },
				set: function(t, v) { return setTaskDone(getTask(t), v); },
				done: function(t) { return setTaskDone(t, true); },
				undone: function(t) { return setTaskDone(t, false); },
			},
			title: {
				get: function(t) { return getTaskTitle(getTask(t)); },
				set: function(t, v) { return setTaskTitle(getTask(t), v); },
			},
			priority: {
				get: function(t) { return getTaskPriority(getTask(t)); },
				set: function(t, v) { return setTaskPriority(getTask(t), v); },
			},
			due: {
				get: function(t) { return getTaskDue(getTask(t)); },
				set: function(t, v) { return setTaskDue(getTask(t), v); },
			},
			notes: {
				get: function(t) { return getTaskNotes(getTask(t)); },
				set: function(t, v) { return setTaskNotes(getTask(t), v); },
			},
		},
		data: {
			priorities: {
				values: getPriorityValues,
				id: getPriorityId,
				order: getPriorityOrder,
				value: getPriorityValue,
				exists: isPriority,
			}
		}
	};
	
	return ret;
	
})($);