function Segmenter3(){}

Segmenter3.processCigar = function(image, canvas){

	// 1. Load Cigar Ttextures
	Segmenter3.loadTextures();

	var scaledImage = new MarvinImage();

	// Scale Image
	var width = image.getWidth();
	var height = image.getHeight();

	if(width > height){
		var factor = 300 / width;
	} else{
		var factor = 300 / height;
	}

	var newWidth = Math.ceil(factor*width);
	var newHeight = Math.ceil(factor*height);

	Marvin.scale(image, scaledImage, newWidth, newHeight);


	var imageOut = new MarvinImage(scaledImage.getWidth(), scaledImage.getHeight());

	Marvin.prewitt(scaledImage, imageOut);
	Marvin.thresholding(imageOut, imageOut, 25);

	var rects = [];

	var time = new Date().getTime();

	rects[0] = Segmenter3.findRect(scaledImage.clone(), imageOut, Segmenter3.textureMediumBrown, true, true, canvas);
	rects[1] = Segmenter3.findRect(scaledImage.clone(), imageOut, Segmenter3.textureLightBrown, true, true, canvas);
	rects[2] = Segmenter3.findRect(scaledImage.clone(), imageOut, Segmenter3.textureDark, false, true, canvas);

	console.log("Segmenter3 - findRects: "+(new Date().getTime()-time));

	var rect = Segmenter3.getBestRect(rects, imageOut);

	rect = SegmenterUtils.multiplyBoundingBox(rect, factor);

	return rect;
};

Segmenter3.getBestRect = function(rects, image){
	var bestIndex=-1;
	var bestDistance=-1;
	for(var i in rects){
		var d = Segmenter3.evalRect(rects[i], image);
		if(!isNaN(d) && (bestIndex == -1 || d < bestDistance)){
			bestDistance = d;
			bestIndex = i;
		}
	}
	return rects[bestIndex];
};

Segmenter3.evalRect = function(rect, image){
	var ratios = [(100/500), (120/450)];

	var rwidth = rect[2]-rect[0];
	var rheight = rect[3]-rect[1];
	var r = rwidth / rheight;

	var c_distance = Math.abs(image.getWidth()/2 - ((rect[0]+rect[2])/2))

	if(
		(r < 40/800) ||
		(rheight < image.getHeight() / 2.5)
	){
		return 9999;
	}

	var score_ratio =  Math.min(Math.abs(ratios[0]-r), Math.abs(ratios[1]-r));
	var score_center = (c_distance / image.getWidth()/2);
	var score = score_ratio + score_center;
	return score;
};

Segmenter3.findRect = function(scaledImage, thresholdImage, cigarTexture, countWhite, debug, canvas){

	var SIDE = 10

	var squareMap = new Array(Math.ceil(scaledImage.getWidth()/SIDE)+1);
	for(var i=0; i<squareMap.length; i++){
		squareMap[i] = new Array(Math.ceil(scaledImage.getHeight()/SIDE)+1);
	}


	for(var y=0; y<scaledImage.getHeight(); y+=SIDE){
		for(var x=0; x<scaledImage.getWidth(); x+=SIDE){

			if
			(
				(!countWhite || (Segmenter3.countWhite(thresholdImage, x, y, SIDE) > (100*0.3))) &&
				(Segmenter3.countCigar(scaledImage, x, y, SIDE, cigarTexture) > (100*0.28))
			)
			{
				squareMap[Math.ceil(x/SIDE)][Math.ceil(y/SIDE)] = true;
			} else{
				squareMap[Math.ceil(x/SIDE)][Math.ceil(y/SIDE)] = false;
			}
		}
	}

	// find consecutive
	var totalPerColumn=new Array(squareMap.length);
	var globalMaxLength=0;
	var highestX=0;
	for(var i=0; i<squareMap.length; i++){

		var total=0;
		var curLength=0;
		var maxLength=-1;
		var refTexelColor;
		var texelColor;
		var totalTexels=0;
		for(var j=0; j<squareMap[0].length; j++){

			if(squareMap[i][j]){
				curLength++;
				totalTexels++;
			} else{
				curLength=0;
			}

			if(curLength > maxLength){
				maxLength = curLength;
			}
		}
		totalPerColumn[i] = totalTexels;
		if(maxLength > globalMaxLength){
			globalMaxLength = maxLength;
			highestX = i;
		}
	}


	for(var i=0; i<squareMap.length; i++){

		if(i >= highestX-2 && i <= highestX+2){
			if(totalPerColumn[i] < 8){
				for(var j=0; j<squareMap[0].length; j++){
					squareMap[i][j] = false;
				}
			}
		} else{
			for(var j=0; j<squareMap[0].length; j++){
				squareMap[i][j] = false;
			}
		}
	}



	for(var i=0; i<squareMap.length; i++){
		for(var j=0; j<squareMap[0].length; j++){

			var nx,ny;
			if(!squareMap[i][j]){
				nx = Math.min(i*SIDE, scaledImage.getWidth()-1);
				ny = Math.min(j*SIDE, scaledImage.getHeight()-1);
				scaledImage.fillRect(nx, ny, SIDE, SIDE, 0xFFFFFFFF);
			}

		}
	}


	// Debug
	if(canvas != null){
		scaledImage.draw(canvas);
	}

	scaledImage = MarvinColorModelConverter.rgbToBinary(scaledImage.clone(), 250);
	var bbox = SegmenterUtils.boundingBox(scaledImage);
	return bbox;
};

Segmenter3.getTexelAvgColor = function(column,row,side,image){
	var r=0,g=0,b=0;
	var pixels = side*side;
	var factor = 1/pixels;
	for(var y=row*side; y<(row*side)+side; y++){
		for(var x=column*side; x<(column*side)+side; x++){
			r += factor * image.getIntComponent0(x,y);
			g += factor * image.getIntComponent1(x,y);
			b += factor * image.getIntComponent2(x,y);
		}
	}
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);

	return [r,g,b];
};

Segmenter3.countWhite = function(image, x, y, side){
	var total=0;
	for(var nx=x;nx<x+side; nx++){
		for(var ny=y;ny<y+side; ny++){

			if(nx < image.getWidth() && ny < image.getHeight()){

				if(image.getIntColor(nx, ny) == 0xFFFFFFFF){
					total++;
				}

			}
		}
	}

	return total;
};

Segmenter3.countCigar = function(image, x, y, side, cigarTexture){
	var total=0;
	var red,green,blue;
	var matched;
	for(var nx=x;nx<x+side; nx++){
		for(var ny=y;ny<y+side; ny++){

			if(nx < image.getWidth() && ny < image.getHeight()){

				red = image.getIntComponent0(nx, ny);
				green = image.getIntComponent1(nx, ny);
				blue = image.getIntComponent2(nx, ny);

				// Cigar Texture Matching
				for(var i in cigarTexture){
					var c = cigarTexture[i];

					if(MarvinMath.euclideanDistance(red, green, blue, c.red, c.green, c.blue) < 20){
						total++;
						break;
					}
				}
			}
		}
	}

	return total;
};

Segmenter3.adjustBoundingBox = function(bbox, image){
	var width = 	bbox[2]-bbox[0];
	var height = 	bbox[3]-bbox[1];

	if(height/width > 5){

		var f = width/height;
		var incf = (15/50) / f;
		var half = Math.floor(((incf * width) - width)/2);
		bbox[0] = Math.max(bbox[0] - half, 0);
		bbox[2] = Math.min(bbox[2] + half, image.getWidth());
	}
	bbox[1] = Math.max(0, bbox[1] - Math.ceil(height * 0.1));
	bbox[3] = Math.min(image.getHeight()-10, bbox[3] + Math.ceil(height * 0.1));
	return bbox;
};

Segmenter3.loadTextures = function(){

	// LIGHT BROWN
	Segmenter3.textureLightBrown = [];
	Segmenter3.textureLightBrown.push(	new MarvinColor(	218, 	177, 	120));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	208, 	179, 	145));

	Segmenter3.textureLightBrown.push(	new MarvinColor(	199, 	150, 	93));

	Segmenter3.textureLightBrown.push(	new MarvinColor(	181, 	128, 	97));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	172, 	120, 	107));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	167, 	139, 	99));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	150, 	116, 	70));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	140, 	114, 	77));

	Segmenter3.textureLightBrown.push(	new MarvinColor(	132, 	106, 	69));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	124, 	90, 	82));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	111, 	75, 	35));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	111, 	66, 	61));
	Segmenter3.textureLightBrown.push(	new MarvinColor(	111, 	66, 	61));


	// MEDIUM BROWN

	Segmenter3.textureMediumBrown = [];
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	139, 	127, 	111));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	111, 	107, 	72));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	103, 	76, 	46));


	Segmenter3.textureMediumBrown.push(	new MarvinColor(	98, 	68, 	58));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	92, 	62, 	62));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	92, 	59, 	50));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	89, 	65, 	65));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	85, 	55, 	44));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	85, 	54, 	51));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	75, 	58, 	68));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	60, 	0, 		12));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	58, 	39, 	32));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	58, 	48, 	26));


	Segmenter3.textureMediumBrown.push(	new MarvinColor(	96, 	61, 	56));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	93, 	59, 	50));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	90, 	57, 	50));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	87, 	54, 	47));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	81, 	52, 	51));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	72, 	52, 	51));

	Segmenter3.textureMediumBrown.push(	new MarvinColor(	104, 	69, 	56));
	Segmenter3.textureMediumBrown.push(	new MarvinColor(	71, 	44, 	32));


	// DARK CIGAR
	Segmenter3.textureDark = [];
	Segmenter3.textureDark.push(	new MarvinColor(	54, 	30, 	10));
	Segmenter3.textureDark.push(	new MarvinColor(	36, 	23, 	13));
	Segmenter3.textureDark.push(	new MarvinColor(	31, 	19, 	9));
	Segmenter3.textureDark.push(	new MarvinColor(	29, 	23, 	18));
};
