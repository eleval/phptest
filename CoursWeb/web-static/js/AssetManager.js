var AssetManager = function(){
	this.images = {};
	this.imagesError = {};
	this.imagesToLoad = {};
	this.loadingStarted = false;
};
AssetManager.prototype.loadImage = function(url, id){
	var _this = this;
	if(!id){
		id = url;
	}
	var img = this.images[id];
	if(!img){
		this.imagesToLoad[id] = url;
		img = new Image();
		img.onload = function(){
			delete _this.imagesToLoad[id];
			_this.assetLoaded();
		};
		img.onerror = function(){
			delete _this.imagesToLoad[id];
			_this.imagesError[id] = id;
			_this.assetLoaded();
		};
		img.src = url;
		this.images[id] = img;
	}else{
		this.assetLoaded();
	}
	return img;
};

AssetManager.prototype.assetLoaded = function(){
	this.totalAssetLoaded++;
	this.loadingTime = Date.now() - this.loadingStartTime;
	this.loadingEndTime = Date.now();
};
AssetManager.prototype.renderLoadingProgress = function(g){
	var loadingProgress = this.getLoadingProgress();
	
	g.setTransform(1, 0, 0, 1, 0, 0);
	
	if(this.isDoneLoading())
	{
		g.save();
		g.drawImage(this.getImage("background"), 0, 0);
		
		g.restore();
	}
	
	var fadeDuration = 5000;
	
	if(!this.isDoneLoading() || g.now - this.loadingEndTime < fadeDuration)
	{
		if(this.isDoneLoading())
		{
			g.globalAlpha = Math.pow(1 - (g.now - this.loadingEndTime) / fadeDuration, 3);
		}
	
		var gradient = g.createLinearGradient(0, 0, 200, 0);
		
		gradient.addColorStop(0, "red");
		gradient.addColorStop(1, "yellow");
		
		g.translate(100, 50);
		g.fillStyle = gradient;
		g.fillRect(0, 0, 200 * loadingProgress, 100);
		
		g.lineWidth = 3;
		g.strokeStyle = "blue";
		g.strokeRect(0, 0, 200, 100);
		
		g.fillStyle = "white";
		g.font = "22px gunship";
		g.fillText("Loading... " + loadingProgress * 100 + "%", 0, 50);
		g.globalAlpha = 1;
	}
};

AssetManager.prototype.isDoneLoading = function(){
	return this.totalAssetCount == this.totalAssetLoaded;
};

AssetManager.prototype.startLoading = function(loadingList){
	this.loadingStartTime = Date.now();
	
	this.totalAssetLoaded = 0;
	this.totalAssetCount = 0;
	for(var i in loadingList){
		this.totalAssetCount++;
	}
	this.loadingStarted = true;
	this.isFightLoading = false;
	for(var i in loadingList){
		this.loadImage(loadingList[i], i);
	}
};
AssetManager.prototype.getLoadingProgress = function(){
	if(this.totalAssetCount == 0){
		return 0;
	}else{
		return this.totalAssetLoaded / this.totalAssetCount;
	}
};

AssetManager.prototype.getImage = function(id){
	return this.images[id];
};
