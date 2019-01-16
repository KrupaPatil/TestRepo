function SegmenterUtils(){}

SegmenterUtils.getScaleFactor = function(image, scaleResolution){
	var factor=0;
	if(image.getWidth() > image.getHeight()){
		factor = image.getWidth() / scaleResolution;
	} else{
		factor = image.getHeight() / scaleResolution;
	}
	return factor;
};

SegmenterUtils.scaleRect = function(rect, factor){
	for(var i in rect){
		rect[i] = Math.floor(rect[i]*factor);
	}
};

SegmenterUtils.mergeRects = function(rect1, rect2){
	var x1=-1,x2=-1,y1=-1,y2=-1;

	// x
	if(x1 == -1 || rect1[0] < x1){	x1 = rect1[0];}
	if(x1 == -1 || rect2[0] < x1){	x1 = rect2[0];}
	if(x2 == -1 || rect1[2] > x2){	x2 = rect1[2];}
	if(x2 == -1 || rect2[2] > x2){	x2 = rect2[2];}
	//y
	if(y1 == -1 || rect1[1] < y1){	y1 = rect1[1];}
	if(y1 == -1 || rect2[1] < y1){	y1 = rect2[1];}
	if(y2 == -1 || rect1[3] > y2){	y2 = rect1[3];}
	if(y2 == -1 || rect2[3] > y2){	y2 = rect2[3];}

	return [x1,y1,x2,y2];
};

SegmenterUtils.intersection = function(rect1, rect2){

	var x1=-1,x2=-1,y1=-1,y2=-1;

	// RECT1_X1
	if(rect1[0] >= rect2[0] && rect1[0] <= rect2[2]){
		if(x1 == -1 || rect1[0] < x1){	x1 = rect1[0];	}
		if(x2 == -1 || rect1[0] > x2){	x2 = rect1[0];	}
	}
	// RECT1_X2
	if(rect1[2] >= rect2[0] && rect1[2] <= rect2[2]){
		if(x1 == -1 || rect1[2] < x1){	x1 = rect1[2];	}
		if(x2 == -1 || rect1[2] > x2){	x2 = rect1[2];	}
	}
	// RECT1_Y1
	if(rect1[1] >= rect2[1] && rect1[1] <= rect2[3]){
		if(y1 == -1 || rect1[1] < y1){	y1 = rect1[1];	}
		if(y2 == -1 || rect1[1] > y2){	y2 = rect1[1];	}
	}
	// RECT1_Y2
	if(rect1[3] >= rect2[1] && rect1[3] <= rect2[3]){
		if(y1 == -1 || rect1[3] < y1){	y1 = rect1[3];	}
		if(y2 == -1 || rect1[3] > y2){	y2 = rect1[3];	}
	}

	// rect2_X1
	if(rect2[0] >= rect1[0] && rect2[0] <= rect1[2]){
		if(x1 == -1 || rect2[0] < x1){	x1 = rect2[0];	}
		if(x2 == -1 || rect2[0] > x2){	x2 = rect2[0];	}
	}
	// rect2_X2
	if(rect2[2] >= rect1[0] && rect2[2] <= rect1[2]){
		if(x1 == -1 || rect2[2] < x1){	x1 = rect2[2];	}
		if(x2 == -1 || rect2[2] > x2){	x2 = rect2[2];	}
	}
	// rect2_Y1
	if(rect2[1] >= rect1[1] && rect2[1] <= rect1[3]){
		if(y1 == -1 || rect2[1] < y1){	y1 = rect2[1];	}
		if(y2 == -1 || rect2[1] > y2){	y2 = rect2[1];	}
	}
	// rect2_Y2
	if(rect2[3] >= rect1[1] && rect2[3] <= rect1[3]){
		if(y1 == -1 || rect2[3] < y1){	y1 = rect2[3];	}
		if(y2 == -1 || rect2[3] > y2){	y2 = rect2[3];	}
	}

	var maxArea = Math.max( (rect1[2]-rect1[0]) * (rect1[3]-rect1[1]), (rect2[2]-rect2[0]) * (rect2[3]-rect2[1]));
	var inter = ((x2-x1)*(y2-y1)) / maxArea;
	return inter;
};

SegmenterUtils.scaleImage = function(image, biggestDimension){
	var imageOut = new MarvinImage();
	var width = image.getWidth();
	var height = image.getHeight();

	if(width > height){
		var factor = biggestDimension / width;
	} else{
		var factor = biggestDimension / height;
	}

	var newWidth = Math.ceil(factor*width);
	var newHeight = Math.ceil(factor*height);

	Marvin.scale(image, imageOut, newWidth, newHeight);
	return imageOut;
};

SegmenterUtils.boundingBox = function(image){

	var minX=-1;
	var minY=-1;
	var maxX=-1;
	var maxY=-1;

	for(var y=0; y<image.getHeight(); y++){
		for(var x=0; x<image.getWidth(); x++){

			if(image.getBinaryColor(x, y)){

				if(minX == -1 || x < minX){		minX = x;	}
				if(minY == -1 || y < minY){		minY = y;	}
				if(maxX == -1 || x > maxX){		maxX = x;	}
				if(maxY == -1 || y > maxY){		maxY = y;	}
			}

		}
	}

	return [minX, minY, maxX, maxY];

};

SegmenterUtils.multiplyBoundingBox = function(bbox, factor){
	bbox[0] = Math.ceil(bbox[0] * (1/factor));
	bbox[1] = Math.ceil(bbox[1] * (1/factor));
	bbox[2] = Math.ceil(bbox[2] * (1/factor));
	bbox[3] = Math.ceil(bbox[3] * (1/factor));
	return bbox;
};
