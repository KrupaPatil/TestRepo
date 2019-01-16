function Segmenter(){}

Segmenter.processCigar = function(image){

	console.log("Segmenter.processCigar()");

	var globalTime = new Date().getTime();

	// 2. Resize the image to a lower resolution
	var scaleFactor = SegmenterUtils.getScaleFactor(image, 500);

	var time = new Date().getTime();
	image = SegmenterUtils.scaleImage(image, 500);

	console.log("Segmenter.processCigar() - Scale: "+(new Date().getTime()-time)+"ms");
	time = new Date().getTime();

	var rect = Segmenter3.processCigar(image);
	console.log("Segmenter2 delay: "+(new Date().getTime()-time)+"ms");
	time = new Date().getTime();

	var rect2 = Segmenter2.processCigar(image);

	console.log("Segmenter3 delay: "+(new Date().getTime()-time)+"ms");
	time = new Date().getTime();

	var intersect = SegmenterUtils.intersection(rect, rect2);

	// Merge
	var bestRect;
	if(intersect > 0.65){
		bestRect = SegmenterUtils.mergeRects(rect, rect2);
	}
	// return best option
	else{
		bestRect = Segmenter.bestRect(rect, rect2, image);
		if(bestRect == rect){
			bestRect = Segmenter3.adjustBoundingBox(bestRect, image);
		} else{
			bestRect = Segmenter2.adjustBoundingBox(bestRect, image);
		}
	}

	SegmenterUtils.scaleRect(bestRect, scaleFactor);

	console.log("Segmenter.processCigar() delay: "+(new Date().getTime()-globalTime)+"ms");

	return bestRect;
};

Segmenter.bestRect = function(rect1, rect2, image){
	var s1 = Segmenter.evalRect(rect1, image);
	var s2 = Segmenter.evalRect(rect2, image);

	if(s1 < s2){
		return rect1;
	} else{
		return rect2;
	}
};

Segmenter.evalRect = function(rect, image){
	var ratios = [(80/500), (100/500), (120/450)];

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

	var score_ratio =  Math.min(Math.min(Math.abs(ratios[0]-r), Math.abs(ratios[1]-r), Math.abs(ratios[2]-r)));
	var score_center = (c_distance / image.getWidth()/2);
	var score = score_ratio + score_center;
	return score;
};
