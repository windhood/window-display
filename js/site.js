var current_region;
var saved_images = {};

$(function() {
	$('#background,#phototab,#configs').height($(window).height()).fadeIn();
	$('#photos').jcarousel({ vertical: true, wrap: 'circular' });
	$('.jcarousel-vertical, .jcarousel-container-vertical, .jcarousel-clip-vertical').height($(window).height() - 60);

	var welcome = $('<img>').attr('src', 'images/welcome.jpg').hide();
	$(welcome).load(function() {
		var left_shift = ($(document).width() - 623) / 2;
		var top_shift = ($(document).height() - 507) / 2;
		$('#display').append($('<div>').append(welcome)).css({ left: left_shift, top: top_shift });
		$(welcome).fadeIn();
	});

	$('#bg_color')
		.data('value', '#bfd0c8')
		.ColorPicker({
			color: '#bfd0c8',
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
		if($('#phototab').css('right') == '-200px') {
			$('#phototab').animate({ right: 0 });
			$(this).addClass('close').removeClass('plus');
		} else {
			$('#phototab').animate({ right: -200 });
			$(this).addClass('plus').removeClass('close');
		}
	});

	$.ui.draggable.prototype.destroy = function (ul, item) { }; 
});

var load_images = function() {
	//console.log(JSON.stringify(saved_images));
	//console.log($.parseJSON(JSON.stringify(saved_images)));
	$.each(saved_images, function(i, e) {
		var new_div = $('#' + i);
		var img = $('<img>')
			.attr('src', e.src)
			.css('display', 'none');
		new_div.append(img);
		if(new_div.width() + 'x' + new_div.height() == e.dimensions) {
			img.css({ height: e.height, width: e.width, top: e.top, left: e.left }).fadeIn();
		} else {
			$(img).load(function() {
				set_image_size(new_div, img);
			});
		}
	});
};

var save_images = function() {
	$('#display').children().each(function(i, e) {
		var img = $(e).find('img');
		if(img.length && $(img).attr('src') != 'images/welcome.jpg') {
			var name = $(e).data('name');
			saved_images[name] = {
				'src': img.attr('src'),
				'height': img.height(),
				'width': img.width(),
				'top': img.css('top'),
				'left': img.css('left'),
				'dimensions': $(e).width() + 'x' + $(e).height()
			};
		}
	});
};

var update_layout = function(layout) {
	save_images();	
	$('#bg_floor').html('<div><b>' + layouts[layout].name + '</b>: $' + layouts[layout].price.toFixed(2) + '</div>');
	$('#image_functions').fadeOut();
	$('#display div').remove();
	$.each(layouts[layout].photos, function(e, i) {
		var element = $('<div>');
		element.data('name', e)
			.attr('id', e)
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
	load_images();
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
var layouts = {
	'triptych': {
		'name' : 'Triptych Canvas',
		'price': 207.00,
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
		'name' : 'Double Canvas',
		'price': 208.00,
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
		'name' : '2x2 Square Canvas',
		'price': 201.00,
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
		'name' : '3x2 Square Canvas',
		'price': 202.00,
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
		'name' : '4x1 Square Canvas',
		'price': 203.00,
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
		'name' : '5 Split Canvas',
		'price': 204.00,
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
		'name' : '3 Left Canvas',
		'price': 205.00,
		'width': 425,
		'height': 440,
		'thumbnail': 'images/layout_3splitleft.jpg',
		'photos' : {
			'one' : {
				'height': 350,
				'width': 225
			},
			'two' : {
				'left': 255,
				'height': 160,
				'width': 160
			},
			'three' : {
				'top': 190,
				'left' : 255,
				'height': 160,
				'width': 160
			}
		}
	},
	'3splitright':{
		'name' : '3 Right Canvas',
		'price': 206.00,
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
			'three' : {
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
			current_region.css('width', 'auto');
			current_region.animate({ height: '+=20' });
		} else {
			current_region.css('height', 'auto');
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
			current_region.css('width', 'auto');
			current_region.animate({ height: '-=20' });
		} else {
			current_region.css('height', 'auto');
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
