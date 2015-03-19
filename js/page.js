/**
 * 
 */

var page = (function($) {
	
	function getTask(task) {
		if ($.isNumeric(task))
			return $('#tasks .task#id' + task);
		if (task instanceof jQuery && task.hasClass('task'))
			return task;
		if (task instanceof jQuery && task.parents('.task').exists())
			return task.parents('.task');
		return $();
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
		if (val) {
			due.find('.value .year').text(val.year());
			due.find('.value .month').text(val.month()+1);
			due.find('.value .day').text(val.date());
		} else {
			due.find('.value .year').text('');
			due.find('.value .month').text('');
			due.find('.value .day').text('');
		}
	}
	
	function setDueAction(due, val) {
		if (val)
			due.find('.action').text('X').removeClass('empty');
		else
			due.find('.action').text('D').addClass('empty');
	}
	
	function getTaskDueValue(task) {
		var val = task.find('.due .value');
		return moment([val.find('.year').text(), val.find('.month').text()-1, val.find('.day').text()]);
	}
	
	function setTaskPriority(task, priority) {
		if ($.isNumeric(priority))
			priority = getPriorityValue(priority)
		//if (isPriority(priority))
			task.find('.priority').removeClass(getPriorityValues().join(' ').toLowerCase()).addClass(priority.toLowerCase()).find('.value').text(priority.capitalizeWords());
	}
	
	function getTaskPriority(task) {
		task.find('.priority').text();
	}
	

	

	
	function getPriorityValues() {
		return $('#data #priorities .priority').not('.proto').find('.value').map(function() { return $(this).text(); }).get();
	}
	
	function getPriorityId(val) {
		return +$('#data #priorities .priority .value:contains(' + val + ')').parent().find('.id').text();
	}
	
	function getPriorityValue(val) {
		return $('#data #priorities .priority .id:contains(' + val + ')').parent().find('.value').text();
	}
	
	function isPriority(val) {
		return (($.isNumeric(val) && getPriorityValue(val).length > 0) || (!$.isNumeric(val) && getPriorityId(val) > 0));
	}
	
	
	
	var ret = {
		task: {
			due: {
				get: function(t) { return getTaskDueValue(getTask(t)); },
				set: function(t, v) { return setTaskDue(getTask(t), v); },
			},
			priority: {
				get: function(t) { return getTaskPriority(getTask(t)); },
				set: function(t, v) { return setTaskPriority(getTask(t), v); }
			},
		},
		data: {
			priorities: {
				values: getPriorityValues,
				id: getPriorityId,
				value: getPriorityValue,
				exists: isPriority,
			}
		}
	};
	
	return ret;
	
})($);