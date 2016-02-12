var imageHelper = {

	clear_rect: function image_helper_clear_rect(canvas, rect) {

		var newCanvas  = create_canvas (canvas.width, canvas.height)  ;
		var newContext = newCanvas.getContext ('2d') ;

		newContext.drawImage (canvas, 0, 0) ;
		newContext.clearRect (rect.x, rect.y, rect.width, rect.height) ;

		return newCanvas ;

	},

	keep_rect: function image_helper_keep_rect(canvas, rect) {

		var newCanvas  = create_canvas (canvas.width, canvas.height)  ;
		var newContext = newCanvas.getContext ('2d') ;

		newContext.drawImage (canvas, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height) ;

		return newCanvas; 

	},

	image2canvas: function image_helper_image2canvas(imgUrl) {

	  var image     = imageLoader.cache[imgUrl] ; // temporary variable
	  var canvas    = create_canvas() ;
	  var context   = create_context(canvas) ;
	  canvas.width  = image.width ;
	  canvas.height = image.height ;
	  context.drawImage(image, 0, 0) ;
	  return canvas ;
	  
	},

} ;