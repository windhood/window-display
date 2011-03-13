var current_region;

$(function() {
	$('#background').height($(window).height());
	$.ui.draggable.prototype.destroy = function (ul, item) { }; 
	$('#photos').jcarousel({ vertical: true });
	$('#bg_color').ColorPicker({
		color: '#91ada0',
		onSubmit: function (hsb, hex, rgb, el) {
			$('body').css('backgroundColor', '#' + hex);
			$('#bg_color').css('backgroundColor', '#' + hex);
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
	update_layout('4x4');
	$.each(furniture, function(e, i) {
		var img = $(document.createElement('img'))
			.attr('src', i.small);
		var link = $(document.createElement('a'))
			.attr('href', '#')
			.append(img)
			.click(function() {
				update_furniture(i);
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
	
	$('#photos li img').draggable({
		opacity: 0.5,
		helper: 'clone',
		appendTo: 'body'
	});
	$('#zoomin').click(function() {
		if(current_region.data('typeshift') == 'height') {
			var left_shift = -1*20*current_region.width() / current_region.height();
			current_region.animate({ height: '+=20', top: '-=10',  left: left_shift });
		} else {
			var top_shift = -1*20*current_region.height() / current_region.width();
			current_region.animate({ width: '+=20', left: '-=10', top: top_shift });
		}	
		return false;
	});
	$('#zoomout').click(function() {
		if(current_region.data('typeshift') == 'height') {
			var left_shift = 20*current_region.width() / current_region.height();
			current_region.animate({ height: '-=20', top: '+=10', left: left_shift });
		} else {
			var top_shift = 20*current_region.height() / current_region.width();
			current_region.animate({ width: '-=20', left: '+=10', top: top_shift });
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
		} else {
			$('#configs').animate({ left: -200 });
		}
	});
	$('#phototab_left a').click(function() {
		if($('#phototab').css('right') == '-100px') {
			$('#phototab').animate({ right: 0 });
		} else {
			$('#phototab').animate({ right: -100 });
		}
	});
});

var update_furniture = function(e) {
	$('#background').css('background-image', "url(" + e.large + ")");
};

var update_layout = function(layout) {
	$('#image_functions').hide();

	var left_shift = ($(document).width() - layouts[layout].width) / 2;
	$('#display').css('left', left_shift);
	$('#display div').remove();
	$.each(layouts[layout].photos, function(e, i) {
		var element = $(document.createElement('div'));
		element.data('name', e)
			.css(i)
			.css('display', 'none')
			.droppable({
				hoverClass: 'hovering',
				drop: function(event, ui) { drag_drop(this, ui.draggable); }
			});
		element.append(append_thingy);
		$('#display').append(element);
	});
	$('#display div').fadeIn();

};

var append_thingy = function() {
	var thingy = $(document.createElement('a'))
		.attr('href', '#')
		.html('here!');
	thingy.hover(function(e) {
		current_region = $(this).siblings('img');
		var image_functions = $('#image_functions');
		var p = $(this).offset();
		image_functions.css({ left: p.left, top: p.top + 20 });
		image_functions.show(); 
		return false;
	});
	return thingy;
};

var drag_drop = function(element, image) {
	$(element).find('img').remove();
	var img = $(document.createElement('img'))
		.attr('src', image.attr('src').replace(/-[0-9][0-9][0-9]x[0-9][0-9][0-9]\.jpg/, '.jpg'))
		.hide();
	$(element).append(img);

	var img_aspect_ratio = img.width() / img.height();
	var div_aspect_ratio = $(element).width() / $(element).height();
	if(img_aspect_ratio >= div_aspect_ratio) {
		var new_width = img.width()*$(element).height()/$(img).height();
		img.data('typeshift', 'height');
		img.height($(element).height());
		var left_shift = ($(element).width() - new_width) / 2;
		img.css('left', left_shift);
	} else {
		var new_height = img.height()*$(element).width()/$(img).width(); 
		img.data('typeshift', 'width');
		img.width($(element).width());
		var top_shift = ($(element).height() - new_height) / 2;
		img.css('top', top_shift); 
	}
	img.fadeIn();
/*
	image.draggable({
		opacity: 0.5,
		helper: 'clone'
	});
*/
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
		'thumbnail': 'images/layout_triptych.jpg',
		'photos' : {
			'one' : {
				'top': 10,
				'left': 10,
				'height': 300,
				'width': 200
			},
			'two' : {
				'top': 10,
				'left': 240,
				'height': 300,
				'width': 200
			},
			'three' : {
				'top': 10,
				'left': 470,
				'height': 300,
				'width': 200
			}
		}
	},
	'double': {
		'width': 450,
		'thumbnail': 'images/layout_double.jpg',
		'photos' : {
			'one' : {
				'top': 10,
				'left': 10,
				'height': 300,
				'width': 200
			},
			'two' : {
				'top': 10,
				'left': 240,
				'height': 300,
				'width': 200
			}
		}
	},
	'4x4':{
		'width': 450,
		'thumbnail': 'images/layout_double.jpg',
		'photos' : {
			'one' : {
				'top': 10,
				'left': 10,
				'height': 200,
				'width': 200
			},
			'two' : {
				'top': 10,
				'left': 240,
				'height': 200,
				'width': 200
			},
			'three' : {
				'top': 240,
				'left': 10,
				'height': 200,
				'width': 200
			},
			'four' : {
				'top': 240,
				'left': 240,
				'height': 200,
				'width': 200
			}
		}
	}
};
