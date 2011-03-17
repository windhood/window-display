var current_region;

$(function() {
	$.ui.draggable.prototype.destroy = function (ul, item) { }; 
	$('#background').height($(window).height())
	$('#photos').jcarousel({ vertical: true });
	$('#bg_color')
		.data('value', '#91ada0')
		.ColorPicker({
			color: '#91ada0',
			onSubmit: function (hsb, hex, rgb, el) {
				$('body').css('backgroundColor', '#' + hex);
				$('#bg_color').css('backgroundColor', '#' + hex);
				$('#bg_color').data('value', '#' + hex);
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
	$('#floor_color').ColorPicker({
		color: '#999',
		onSubmit: function (hsb, hex, rgb, el) {
			$('#bg_floor').css('backgroundColor', '#' + hex);
			$(el).ColorPickerHide();
		},
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		}
	});
	update_layout('triptych');

	$.each(patterns, function(e, i) {
		var img = $('<img>')
			.attr('src', i);
		var link = $('<a>')
			.attr('href', '#')
			.append(img)
			.click(function() {
				$('body').css('background', $('#bg_color').data('value') + ' url(' + i + ')');
				return false;
			});
		$('#patterns').append(link);
	});

	/*	
	$.each(furniture, function(e, i) {
		var img = $(document.createElement('img'))
			.attr('src', i.small);
		var link = $(document.createElement('a'))
			.attr('href', '#')
			.append(img)
			.click(function() {
				$('#bg_furniture').css('background-image', "url(" + i.large + ")");
				return false;
			});
		$('#furniture').append(link);
	});
	*/
	$.each(layouts, function(e, i) {
		var img = $('<img>')
			.attr('src', i.thumbnail);
		var link = $('<a>')
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
		var element = $('<div>');
		element.data('name', e)
			.css(i)
			.css('display', 'none')
			.droppable({
				hoverClass: 'hovering',
				drop: function(event, ui) { drag_drop(this, ui.draggable); }
			}).mouseover(function() {
				if($(this).find('img').length) {
					$(this).find('.image_functions').show();
					current_region = $(this).find('img');
				}
			}).mouseout(function() {
				$(this).find('.image_functions').hide();
			});
		var image_functions = $('<div>').addClass('image_functions')
			.append($('<a>').addClass('zoomin').attr('href', '#'))
			.append($('<a>').addClass('zoomout').attr('href', '#'))
			.append($('<a>').addClass('shiftleft').attr('href', '#'))
			.append($('<a>').addClass('shiftdown').attr('href', '#'))
			.append($('<a>').addClass('shiftup').attr('href', '#'))
			.append($('<a>').addClass('shiftright').attr('href', '#'))
			.append($('<a>').addClass('reset').attr('href', '#'))
			
		$(element).append(image_functions);
		$('#display').append(element);
	});
	var left_shift = ($(document).width() - layouts[layout].width) / 2;
	var top_shift = (($(document).height() - 200) - layouts[layout].height) / 2;
	if(top_shift < 0) {
		top_shift = 20;
	}
	$('#display').css({ left: left_shift, top: top_shift });
	$('#display div').not($('.image_functions')).fadeIn();
	initialize_image_manip();
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
	var img = $('<img>')
		.attr('src', dropped.find('img').attr('src').replace(/-[0-9][0-9][0-9]x[0-9][0-9][0-9]\.jpg/, '.jpg'))
		.css('display', 'none');
	$(element).append(img);
	if($(img).height() > 0) {
		set_image_size(element, img);
	} else {
		var loader = $('<img>')
			.attr('src', 'images/ajax_loader.gif')
			.css('top', $(element).height()/2-24);
		$(element).append(loader);	
		$(img).load(function() {
			set_image_size(element, img);
			loader.remove();
		});
	}

	return;
};

var patterns = {
	'plain' : 'images/pattern0.png',
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
		'width': 670,
		'height': 300,
		'thumbnail': 'images/layout_triptych.jpg',
		'photos' : {
			'one' : {
				'height': 300,
				'width': 200
			},
			'two' : {
				'left': 230,
				'height': 300,
				'width': 200
			},
			'three' : {
				'left': 460,
				'height': 300,
				'width': 200
			}
		}
	},
	'double': {
		'width': 440,
		'height': 300,
		'thumbnail': 'images/layout_double.jpg',
		'photos' : {
			'one' : {
				'height': 300,
				'width': 200
			},
			'two' : {
				'left': 230,
				'height': 300,
				'width': 200
			}
		}
	},
	'2x2':{
		'width': 360,
		'height': 440,
		'thumbnail': 'images/layout_2x2.jpg',
		'photos' : {
			'one' : {
				'height': 160,
				'width': 160
			},
			'two' : {
				'left': 190,
				'height': 160,
				'width': 160
			},
			'three' : {
				'top': 190,
				'height': 160,
				'width': 160
			},
			'four' : {
				'top': 190,
				'left': 190,
				'height': 160,
				'width': 160
			}
		}
	},
	'3x2':{
		'width': 550,
		'height': 440,
		'thumbnail': 'images/layout_3x2.jpg',
		'photos' : {
			'one' : {
				'height': 160,
				'width': 160
			},
			'two' : {
				'left': 190,
				'height': 160,
				'width': 160
			},
			'three' : {
				'left': 380,
				'height': 160,
				'width': 160
			},
			'four' : {
				'top': 190,
				'height': 160,
				'width': 160
			},
			'five' : {
				'top': 190,
				'left': 190,
				'height': 160,
				'width': 160
			},
			'six' : {
				'top': 190,
				'left': 380,
				'height': 160,
				'width': 160
			}
		}
	},
	'4x1':{
		'width': 740,
		'height': 170,
		'thumbnail': 'images/layout_4x1.jpg',
		'photos' : {
			'one' : {
				'height': 160,
				'width': 160
			},
			'two' : {
				'left': 190,
				'height': 160,
				'width': 160
			},
			'three' : {
				'left' : 380,
				'height': 160,
				'width': 160
			},
			'four' : {
				'left': 570,
				'height': 160,
				'width': 160
			}
		}
	},
	'5split':{
		'width': 615,
		'height': 440,
		'thumbnail': 'images/layout_5split.jpg',
		'photos' : {
			'one' : {
				'height': 160,
				'width': 160
			},
			'two' : {
				'left': 190,
				'height': 350,
				'width': 225
			},
			'three' : {
				'left': 445,
				'height': 160,
				'width': 160
			},
			'four' : {
				'top': 190,
				'height': 160,
				'width': 160
			},
			'five' : {
				'top': 190,
				'left': 445,
				'height': 160,
				'width': 160
			}
		}
	},
	'3splitleft':{
		'width': 425,
		'height': 440,
		'thumbnail': 'images/layout_3splitleft.jpg',
		'photos' : {
			'two' : {
				'height': 350,
				'width': 225
			},
			'three' : {
				'left': 255,
				'height': 160,
				'width': 160
			},
			'five' : {
				'top': 190,
				'left' : 255,
				'height': 160,
				'width': 160
			}
		}
	},
	'3splitright':{
		'width': 425,
		'height': 440,
		'thumbnail': 'images/layout_3splitright.jpg',
		'photos' : {
			'one' : {
				'height': 160,
				'width': 160
			},
			'two' : {
				'left': 190,
				'height': 350,
				'width': 225
			},
			'four' : {
				'top': 190,
				'height': 160,
				'width': 160
			}
		}
	}
};

var initialize_image_manip = function() {
	$('.zoomin').click(function() {
		if(current_region.data('typeshift') == 'height') {
			current_region.animate({ height: '+=20' });
		} else {
			current_region.animate({ width: '+=20' });
		}	
		return false;
	});
	$('.reset').click(function() {
		current_region.fadeOut('fast', function() {
			set_image_size(current_region.parent(), current_region);
		});
		return false;
	});
	$('.zoomout').click(function() {
		if(current_region.data('typeshift') == 'height') {
			current_region.animate({ height: '-=20' });
		} else {
			current_region.animate({ width: '-=20' });
		}	
		return false;
	});
	$('.shiftleft').click(function() {
		current_region.animate({ left: '-=10' });
		return false;
	});
	$('.shiftright').click(function() {
		current_region.animate({ left: '+=10' });
		return false;
	});
	$('.shiftdown').click(function() {
		current_region.animate({ top: '+=10' });
		return false;
	});
	$('.shiftup').click(function() {
		current_region.animate({ top: '-=10' });
		return false;
	});
};
