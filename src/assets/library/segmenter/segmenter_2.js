function Segmenter2(){}

Segmenter2.processCigar = function(image, canvas){

	// Use the highest dimension to scale
	var factor = Math.max(image.getWidth(), image.getHeight()) /200;
	var image = SegmenterUtils.scaleImage(image, 200);

	var imageOut = new MarvinImage(image.getWidth(), image.getHeight());

	Marvin.prewitt(image.clone(), imageOut);
	Marvin.invertColors(imageOut, imageOut);
	Marvin.thresholding(imageOut, imageOut, 200);
	Segmenter2.wide(imageOut.clone(), imageOut);


	var rect = Segmenter2.findCigar(imageOut, canvas);

	for(var i in rect){
		rect[i] = Math.floor(rect[i]*factor);
	}
	return rect;
};

Segmenter2.adjustBoundingBox = function(bbox, image){
	var width = 	bbox[2]-bbox[0];
	var height = 	bbox[3]-bbox[1];

	if(height/width > 5){

		var f = width/height;
		var incf = (10/50) / f;
		var half = Math.floor(((incf * width) - width)/2);
		bbox[0] = Math.max(bbox[0] - half, 0);
		bbox[2] = Math.min(bbox[2] + half, image.getWidth());
	}
	bbox[1] = Math.max(0, bbox[1] - Math.ceil(height * 0.1));
	bbox[3] = Math.min(image.getHeight()-10, bbox[3] + Math.ceil(height * 0.1));
	return bbox;
};

Segmenter2.wide = function(imageIn, imageOut){
	for(var y=0; y<imageIn.getHeight(); y++){
		for(var x=0; x<imageIn.getWidth(); x++){

			var color = imageIn.getIntColor(x,y);
			if( (color & 0x00FFFFFF) == 0){
				if(x > 0){						imageOut.setIntColor(x-1, y, 0xFF000000);	}

				imageOut.setIntColor(x, y, 0xFF000000);

				if(x < imageIn.getWidth()-1){	imageOut.setIntColor(x+1, y, 0xFF000000);	}
			}
		}
	}
}

Segmenter2.findCigar = function(image, canvas){
	var linePixels= new Array(image.getWidth());
	for(var i=0; i<linePixels.length; i++){
		linePixels[i] = new Array(image.getHeight());
		linePixels[i].fill(false);
	}

	for(var x=0; x<image.getWidth(); x++){
		Segmenter2.findLine(image, x, -0.00, linePixels, canvas);
	}

	if(canvas != null){
		image.draw(canvas);
	}

	return Segmenter2.linePixelsToRect(linePixels);
};

Segmenter2.linePixelsToRect = function(linePixels){
	var x1=-1,x2=-1,y1=-1,y2=-1;

	for(var x=0; x<linePixels.length; x++){
		for(var y=0; y<linePixels[x].length; y++){

			if(linePixels[x][y]){
				if(x1 == -1 || x < x1){		x1 = x;	}
				if(x2 == -1 || x > x2){		x2 = x;	}
				if(y1 == -1 || y < y1){		y1 = y;	}
				if(y2 == -1 || y > y2){		y2 = y;	}
			}
		}
	}

	var height = (y2-y1);
	var width = (x2-x1);

	var y_margin = Math.floor(height*0.1);
	var x_margin = Math.floor(width*0.25);

	x1 = Math.max(x1-x_margin, 0);
	x2 = Math.min(x2+x_margin, linePixels.length);
	y1 = Math.max(y1-y_margin, 0);
	y2 = Math.min(y2+y_margin, linePixels[0].length);

	return [x1, y1, x2, y2];
};

Segmenter2.findLine = function(image, px, xinc, linePixels){

	var black=0;
	var whiteSeq=0;
	var steps=0;
	var positions = []
	var validSegment=false;

	var x=px;
	for(var y=0; y<image.getHeight(); y++){

		var fx = Math.round(x);
		var fy = Math.round(y);

		if(fy >= image.getHeight()){
			break;
		}
		if(fx >= 0 && fx < image.getWidth()){
			var color = image.getIntColor(fx, fy);

			if((color & 0x00FFFFFF) == 0){
				black++;
				whiteSeq=0;
				positions.push([fx,fy])
			} else{
				whiteSeq++;
			}

			if(whiteSeq > 10){


				if(validSegment){
					Segmenter2.drawPositions(image, positions);
					Segmenter2.setLinePixels(positions, linePixels);
				}

				steps=0;
				black=0;
				positions = [];
			}


			if(steps > 80 && black / steps >= 0.95 ){
				validSegment = true;
			} else{
				if(validSegment){
					Segmenter2.drawPositions(image, positions);
					Segmenter2.setLinePixels(positions, linePixels);
					positions = [];
					steps=0;
					black=0;
				}
				validSegment = false;
			}

			if(y == image.getHeight()-1){
				if(validSegment){
					Segmenter2.drawPositions(image, positions);
					Segmenter2.setLinePixels(positions, linePixels);
					positions = [];
				}
			}

			steps++;
		}

		x+=xinc;
	}
};

Segmenter2.setLinePixels = function(positions, linePixels){
	for(var i in positions){
		linePixels[positions[i][0]][positions[i][1]] = true;
	}
};

Segmenter2.drawPositions = function(image, positions){
	for(var i in positions){
		image.fillRect(positions[i][0], positions[i][1]-5, 5, 5, 0xFFFF0000);
	}
};
