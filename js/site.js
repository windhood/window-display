var current_region;

$(function() {
	$('#background').height($(window).height());
	$('#background').hover(function() {
		$('#image_functions').fadeOut();
	});
	$.ui.draggable.prototype.destroy = function (ul, item) { }; 
	$('#photos').jcarousel({ vertical: true });
	$('#bg_color').data('value', '#91ada0');
	$('#bg_color').ColorPicker({
		color: '#91ada0',
		onSubmit: function (hsb, hex, rgb, el) {
			$('body').css('backgroundColor', '#' + hex);
			$('#bg_color').css('backgroundColor', '#' + hex);
			$(this).data('value', '#' + hex);
			$(el).ColorPickerHide();
		},
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		}
	});
	$('#frame_color').ColorPicker({
		color: '#000',
		onSubmit: function (hsb, hex, rgb, el) {
			$('#display div').css('border-color', '#' + hex);
			$('#frame_color').css('backgroundColor', '#' + hex);
			$(el).ColorPickerHide();
		},
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		}
	});
	update_layout('triptych');

	$.each(patterns, function(e, i) {
		var img = $(document.createElement('img'))
			.attr('src', i);
		var link = $(document.createElement('a'))
			.attr('href', '#')
			.append(img)
			.click(function() {
				$('body').css('background', $('#bg_color').data('value') + ' url(' + i + ')');
				return false;
			});
		$('#patterns').append(link);
	});
	
	$.each(furniture, function(e, i) {
		var img = $(document.createElement('img'))
			.attr('src', i.small);
		var link = $(document.createElement('a'))
			.attr('href', '#')
			.append(img)
			.click(function() {
				//$('#background').css('background-image', "url(" + i.large + ")");
				return false;
			});
		$('#furniture').append(link);
	});
	$.each(layouts, function(e, i) {
		var img = $(document.createElement('img'))
			.attr('src', i.thumbnail);
		var link = $(document.createElement('a'))
			.attr('href', '#')
			.append(img)
			.click(function() {
				update_layout(e);
				return false;
			});
		$('#layouts').append(link);
	});
	
	$('#photos li div').draggable({
		opacity: 0.5,
		helper: 'clone',
		appendTo: 'body'
	});
	$('#zoomin').click(function() {
		if(current_region.data('typeshift') == 'height') {
			current_region.animate({ height: '+=20' });
		} else {
			current_region.animate({ width: '+=20' });
		}	
		return false;
	});
	$('#reset').click(function() {
		current_region.fadeOut('fast', function() {
			set_image_size(current_region.parent(), current_region);
		});
		return false;
	});
	$('#zoomout').click(function() {
		if(current_region.data('typeshift') == 'height') {
			current_region.animate({ height: '-=20' });
		} else {
			current_region.animate({ width: '-=20' });
		}	
		return false;
	});
	$('#shiftleft').click(function() {
		current_region.animate({ left: '-=10' });
		return false;
	});
	$('#shiftright').click(function() {
		current_region.animate({ left: '+=10' });
		return false;
	});
	$('#shiftdown').click(function() {
		current_region.animate({ top: '+=10' });
		return false;
	});
	$('#shiftup').click(function() {
		current_region.animate({ top: '-=10' });
		return false;
	});

	$('#config_right a').click(function() {
		if($('#configs').css('left') == '-200px') {
			$('#configs').animate({ left: 0 });
			$(this).addClass('close').removeClass('plus');
		} else {
			$('#configs').animate({ left: -200 });
			$(this).addClass('plus').removeClass('close');
		}
	});
	$('#phototab_left a').click(function() {
		if($('#phototab').css('right') == '-100px') {
			$('#phototab').animate({ right: 0 });
			$(this).addClass('close').removeClass('plus');
		} else {
			$('#phototab').animate({ right: -100 });
			$(this).addClass('plus').removeClass('close');
		}
	});
});

var update_layout = function(layout) {
	$('#image_functions').fadeOut();
	$('#display div').remove();
	$.each(layouts[layout].photos, function(e, i) {
		var element = $(document.createElement('div'));
		element.data('name', e)
			.css(i)
			.css('display', 'none')
			.droppable({
				hoverClass: 'hovering',
				drop: function(event, ui) { drag_drop(this, ui.draggable); }
			})
			.hover(function() {
				current_region = $(this).find('img');
				var image_functions = $('#image_functions');
				var p = $(this).offset();
				image_functions.css({ left: p.left + $(this).width()/2 - 70, top: p.top + $(this).height() + 13}).show();
				return false;
			});
		$('#display').append(element);
	});
	var left_shift = ($(document).width() - layouts[layout].width) / 2;
	var top_shift = (($(document).height() - 200) - layouts[layout].height) / 2;
	if(top_shift < 0) {
		top_shift = 10;
	}
	$('#display').css({ left: left_shift, top: top_shift });
	$('#display div').fadeIn();

};

var set_image_size = function(element, img) {
	var img_aspect_ratio = img.width() / img.height();
	var div_aspect_ratio = $(element).width() / $(element).height();
	if(img_aspect_ratio >= div_aspect_ratio) {
		var new_width = img.width()*$(element).height()/$(img).height();
		img.data('typeshift', 'height');
		img.height($(element).height());
		var left_shift = ($(element).width() - new_width) / 2;
		img.css({ left: left_shift, top: 0 });
	} else {
		var new_height = img.height()*$(element).width()/$(img).width(); 
		img.data('typeshift', 'width');
		img.width($(element).width());
		var top_shift = ($(element).height() - new_height) / 2;
		img.css({ top: top_shift, left: 0 });
	}
	img.fadeIn();
};

var drag_drop = function(element, dropped) {
	$(element).find('img').remove();
	var img = $(document.createElement('img'))
		.attr('src', dropped.find('img').attr('src').replace(/-[0-9][0-9][0-9]x[0-9][0-9][0-9]\.jpg/, '.jpg'))
		.css('display', 'none');
	$(element).append(img);
	set_image_size(element, img);
	return;
};

var patterns = {
	'plain' : '',
	'pattern-1' : 'images/pattern1.png',
	'pattern-2' : 'images/pattern2.png',
	'pattern-3' : 'images/pattern3.png'
};
var furniture = {
	'table' : {
		'small' : 'images/table_small.png',
		'large' : 'images/table.png'
	},
	'sofa' : {
		'small' : 'images/sofa_small.png',
		'large' : 'images/sofa.png'
	}
};

var layouts = {
	'triptych': {
		'width': 750,
		'height': 300,
		'thumbnail': 'images/layout_triptych.jpg',
		'photos' : {
			'one' : {
				'height': 300,
				'width': 200
			},
			'two' : {
				'left': 240,
				'height': 300,
				'width': 200
			},
			'three' : {
				'left': 470,
				'height': 300,
				'width': 200
			}
		}
	},
	'double': {
		'width': 450,
		'height': 300,
		'thumbnail': 'images/layout_double.jpg',
		'photos' : {
			'one' : {
				'height': 300,
				'width': 200
			},
			'two' : {
				'left': 240,
				'height': 300,
				'width': 200
			}
		}
	},
	'4x4':{
		'width': 350,
		'height': 420,
		'thumbnail': 'images/layout_double.jpg',
		'photos' : {
			'one' : {
				'height': 150,
				'width': 150
			},
			'two' : {
				'left': 190,
				'height': 150,
				'width': 150
			},
			'three' : {
				'top': 190,
				'height': 150,
				'width': 150
			},
			'four' : {
				'top': 190,
				'left': 190,
				'height': 150,
				'width': 150
			}
		}
	}
};
