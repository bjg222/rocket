/**
 * 
 */

(function($) {
	
	$.fn.editable = (function(options) {
		var opts = $.extend({}, $.fn.editable.defaults, options);
		
		if (opts.hover && !$.isEmptyObject(opts.hover)) {
			var f = function(el) {
				var current = el.css(Object.keys(opts.hover));
				return [function() {
							if (opts.require && $.isFunction(opts.require) && opts.require($(this)))
								$(this).css(opts.hover); 
						},
				        function() { 
							if (opts.require && $.isFunction(opts.require) && opts.require($(this)))
								$(this).css(current); 
						}];
			}(this);
			this.hover(f[0], f[1]);
		}
		
		this.each(function() {
			var type = opts.defaulttype;
			if (!opts.type && opts.supportedtypes && !$.isEmptyObject(opts.supportedtypes)) {
				for (var i = 0; i < opts.supportedtypes.length; i ++) {
					if ($(this).hasClass(opts.supportedtypes[i])) {
						type = opts.supportedtypes[i];
						break;
					}
				}
			} else
				type = opts.type;
			if (!type)
				type = 'text';
			
			$(this).click(function(ev) {
				if (opts.require && $.isFunction(opts.require) && !opts.require($(this)))
					return
				ev.stopPropagation();
				var el = $(this);
				var elval = el.clone();
				if (opts.remove)
					$.each(($.isArray(opts.remove) ? opts.remove : [opts.remove]), function(i,v) {elval.find(v).remove(); });
				elval = $.trim(elval.text());
				var elcss;
				if (opts.carryover && !$.isEmptyObject(opts.carryover))
					elcss = el.css(opts.carryover);
				else
					elcss = {};
				if (opts.hover && !$.isEmptyObject(opts.hover))
					$.extend(elcss, opts.hover);
				if (opts.emphasis && !$.isEmptyObject(opts.emphasis))
					$.extend(elcss, opts.emphasis);
				if (opts.add && !$.isEmptyObject(opts.add))
					$.extend(elcss, opts.add);
				var inp = false;
				switch (type) {
					case 'select':
						inp = $('<select>').css(elcss);
						$.each(opts.selectoptions, function(i, val) {
							inp.append($('<option>').text(val));
						});
						inp.val(elval);
						break;
					case 'date':
						inp = $('<input>').attr('type', 'date').val(elval).css(elcss); 
						break;
					case 'textarea':
						inp = $('<textarea>').val(elval).css(elcss);
						break;
					case 'text':
					default:
						inp = $('<input>').attr('type', 'text').val(elval).css(elcss); 
				}
				if (inp) {
					if (opts.keepclasses)
						$.each(el.attr('class').split(' '), function(i, v) { inp.addClass(v); });
					if (opts.removeclasses)
						$.each(($.isArray(opts.removeclasses) ? opts.removeclasses : opts.removeclasses.split(' ')), function(i, v) { inp.removeClass(v); });
					var ret = undefined;
					if (opts.create && $.isFunction(opts.create))
						ret = opts.create(inp, el);
					if (ret && typeof ret == 'string')
						inp.val(ret);
					el.hide();
					var done = (function(it, discard) {
						var newval = $.trim(it.val());
						if ((!newval && opts.noempty) || elval == newval)
							discard = true;
						if (!discard && opts.callback && $.isFunction(opts.callback)) {
							var ret = opts.callback(el, newval);
							if ($.type(ret) !== 'undefined' && !ret)
								discard = true;
						}
						var ret = undefined;
						if (opts.destroy && $.isFunction(opts.destroy))
							ret = opts.destroy(inp, el, !discard);
						if (!discard && ret !== false) {
							if (ret instanceof jQuery)
								newval = ret.clone();
							else if (ret && ret !== true)
								newval = ret;
							else if (!newval && opts.emptyinsert)
								newval = (opts.emptyinsert instanceof jQuery ? opts.emptyinsert.clone() : opts.emptyinsert);
							if (newval instanceof jQuery)
								el.html(newval);
							else
								el.text(newval);
						}
						it.remove();
						el.show();
					});
					inp.insertAfter(el).focus();
					inp.click(function(ev) { ev.stopPropagation(); });
					inp.blur(function(ev) { 
						ev.stopPropagation();
						done($(this));
					});
					inp.keyup(function(ev) {
						if (ev.which == 13)
							done($(this));
						else if (ev.which == 27)
							done($(this), true);
					});
				}
			});
		});
		
		return this;
	});
	
	$.fn.editable.defaults = {
			keepclasses: true,
			removeclasses: [],
			carryover: ['font', 'padding', 'margin', 'border', 'color', 'background', 'height', 'width'],
			add: {},
			emphasis: {'outline': 'black solid 1px', 'outline-offset': '1px'},
			hover: {'background-color': 'rgba(255,255,255,0.5)'},
			type: undefined,
			defaulttype: 'text',
			supportedtypes: ['text', 'textarea', 'date', 'select'],
			require: function(el) { return true; },
			remove: undefined,
			noempty: false,
			emptyinsert: '&nbsp',
			callback: function(el, val) { return true; },
			create: function() {},
			destroy: function() {},
	};
	
})($);