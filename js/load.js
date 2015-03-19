/**
 * 
 */

$.fn.editable.defaults.removeclasses = 'editable';
$.fn.editable.defaults.require = function(el) { return el.parents('.task.expanded').exists(); };
$.fn.editable.defaults.remove = '.empty';
//$.fn.editable.defaults.noempty = false;
$.fn.editable.defaults.create = function() { $('.task').onFirst('click.prevent', function(ev) { ev.stopImmediatePropagation(); console.log('stopped'); }); };
$.fn.editable.defaults.destroy = function() { setTimeout(function() { $('.task').off('click.prevent'); console.log('removed'); }, 500); };

$(document).ready(function() {
	
	var prioritiesReady = function() {
		$('.priority .editable').editable({callback: on.priority, type: 'select', selectoptions: page.data.priorities.values()});
	};
	
	on.load({priorities: prioritiesReady});
	$('.task :checkbox').click(on.done);
	$('.task .remove').click(on.remove);
	$('.task').click(on.task);
	$('#actions #all').click(on.all);
	$('#actions #none').click(on.none);
	$('#actions #add').click(on.add);
	$('.title .editable').editable({callback: on.title, noempty: true});
	$('.notes .editable').editable({callback: on.notes, type: 'textarea', emptyinsert: $('.task.proto .notes .empty').clone()});
	$('.due .editable').editable({callback: on.due, type: 'date', add: {'min-width': '100px', 'min-height': '16px'},
		create: function(inp, el) {
			$.fn.editable.defaults.create();
			var y = el.find('.year').text();
			var m = el.find('.month').text();
			var d = el.find('.day').text();
			return  y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
		},
		destroy: function(inp, el, good) {
			$.fn.editable.defaults.destroy();
			if (!good)
				return;
			if (!$.trim(inp.val())) {
				el.find('.year').text('');
				el.find('.month').text('');
				el.find('.day').text('');
			} else {
				var d = new Date(inp.val().substr(0,4), inp.val().substr(5,2)-1, inp.val().substr(8,2), 0, 0, 0, 0);
				if (!d)
					return false;
				el.find('.year').text(d.getFullYear());
				el.find('.month').text(d.getMonth() + 1);
				el.find('.day').text(d.getDate());
			}
			return el.children();
		}});
	$('.due .action').click(on.dueAction);
});