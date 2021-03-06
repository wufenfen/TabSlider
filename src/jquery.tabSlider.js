/**
 * Tab Slider is used for tabs that can be toggle via slide
 * Just an exercise for myself
 * author Claire Wu 2016/12/27
 *
 * Usage:
 *
 * html:
 	<div class="tabSlider">
		<div class="tab">
			<ul>
				<li><a href="">tab1</a></li>
				<li><a href="">tab2</a></li>
				<li><a href="">...</a></li>
			</ul>
			<div class="u-line trans"></div>
		</div>
		<ul class="content">
			<li> content for tab1 </li>
			<li> content for tab2 </li>
			<li> ... </li>
		</ul>
	</div>

 * JS:
 * $(".tabSlider").tabSlider({
 	tabs: '.tab', //tab元素
	content: '.content', //内容元素
    line: ".line",  //tab下划线元素
	tabActiveClass: 'active', //当前激活tab样式
	transClass:"trans", //过渡效果设置
	mousetouch: true //是否支持鼠标事件
});
 */


; (function($,window,document,undefined){ //最后一个undefined, 防止undefined被重写
	var tabSlider = function(ele, options){ 
		this.options = options; 
		this.$tabs = $(options.tabs).children();
		this.$contents = $(options.content).children();
		this.$line = $(options.line);

		this.startY, this.endY, this.startX, this.endX;
		this.activeTabIndex; //被激活的tab索引
		this.isValid; //判断此次的滑动是否为水平滑动
		this.isMouseDown; //鼠标是否处于按下状态

		this.tabSliderNum = this.$contents.length; //tab的个数
		this.tabWidth = ele.width(); //整个tab组件的宽度
		this.maxMoveDistance = this.tabWidth/this.tabSliderNum; //滑动过程中内容能移动的最大距离
		this.threshold = this.maxMoveDistance/2; //滑动距离超过threshold即可认为成功切换tab

		this.activeTab(0);//默认第一个是激活的tab

		$(options.content).on("touchstart mousedown",  this.startTouchScroll.bind(this));
		$(options.content).on("touchmove mousemove", this.moveTouchScroll.bind(this));
		$(options.content).on("touchend mouseup",  this.endTouchScroll.bind(this));
		//点击也能成功切换tab
		var that = this;
		this.$tabs.on("click", function(event){ 
			that.activeTab(-1, event.target);
		}) 
	}

	tabSlider.prototype = {
		//初始化tab，设置当前激活的tab
		activeTab: function(myIndex, activeItem){
			this.activeTabIndex = myIndex;
			var that = this;
			this.$tabs.each(function(index, item){
				if((index ==  that.activeTabIndex) || (activeItem && (item == activeItem || activeItem.parentNode == item))){
					$(item).addClass(that.options.tabActiveClass);
					that.$line.addClass('trans');
					that.$line.css('left', 100/that.tabSliderNum*(index) + '%');
					that.activeTabIndex = index;
					that.activeContent(that.activeTabIndex);  
				}
				else{
					$(item).removeClass(that.options.tabActiveClass); 
				}
			})
		},

		//设置当前激活tab的内容
		activeContent: function(activeTabIndex){
			if(this.activeTabIndex==undefined || this.activeTabIndex<0){
				return;
			}
			var that = this;
			this.$contents.each(function(index, item){ 
				$(item).css('position', 'absolute');
				$(item).addClass('trans');
				$(item).css('left', 100*(index-that.activeTabIndex) + '%'); 
			})
		},

		moveContent: function(distance){
			//向右滑，滑出左侧的tab,如果已经处于最左侧的tab，不会滑动;反之亦然
			if( (distance>0 && distance<this.maxMoveDistance && this.activeTabIndex!=0) ||
			(distance<0 && distance>-1*this.maxMoveDistance && this.activeTabIndex!=this.tabSliderNum-1)){		 			 
				this.$line.removeClass('trans'); 
				this.$line.css('left',  this.activeTabIndex/this.tabSliderNum*this.tabWidth-distance + 'px'); 
				console.log(this.activeTabIndex/this.tabSliderNum*this.tabWidth-distance);
				var that = this;
				this.$contents.each(function(index, item){  
					$(item).removeClass('trans');
					$(item).css('left', (index-that.activeTabIndex)*that.tabWidth + distance + 'px'); 
				})
			} 
		},  

		startTouchScroll: function(event){
			var touch;
			if(event.type == "mousedown"){
				if(this.options.mousetouch){ 
					touch = event;
					this.isMouseDown = true;
				}
				else{
					return;
				}
			}
			else{ 
				touch = event.originalEvent.targetTouches[0];
			} 
	        this.startX = touch.pageX;
	        this.startY = touch.pageY;
		},

		moveTouchScroll: function(event){ 
	        if(this.isValid == undefined){
		        //滑动过程中只判断一次
		        if( Math.abs((this.endY - this.startY)/(this.endX - this.startX)) > 1){
		        	this.isValid = false;
		        }else{
		        	this.isValid = true;
		        }
	        }

	        var touch;
			if(event.type == "mousemove"){
				if(this.options.mousetouch && this.isMouseDown){ 
					touch = event;
				}
				else{
					return;
				}
			}
			else{ 
				touch = event.originalEvent.targetTouches[0];
			}  
	        this.endX = touch.pageX;
	        this.endY = touch.pageY;


	        if( this.isValid ){
	        	event.preventDefault();

		        var distance = this.endX - this.startX; 
		        //滑动内容
		        this.moveContent(distance);
		    }
		},

		endTouchScroll: function(event){
			this.isMouseDown = false;
			if( !this.isValid ){
	        	this.isValid = undefined;
	        	return;
	        } 

			if(event.type == "mouseup" && !this.options.mousetouch){
				return;
			} 

	        var distance = this.endX - this.startX; 
	        if( distance > this.threshold && this.activeTabIndex!=0){ //向右滑
 				this.activeTab(this.activeTabIndex-1);
	        }
	        else if( distance < -1*this.threshold && this.activeTabIndex != this.tabSliderNum-1){ //向左滑
 				this.activeTab(this.activeTabIndex+1); 
	        } 
	        else{
 				this.activeTab(this.activeTabIndex); 
	        }
	        this.isValid = undefined;
		}

	}


	$.fn.tabSlider = function(options){
		var defaults = {
			tabs: '.tab', //tab元素
	    	content: '.content', //内容元素
		    line: ".line",  //tab下划线元素
	    	tabActiveClass: 'active', //当前激活tab样式
	    	transClass:"trans", //过渡效果设置
			mousetouch: false //是否支持鼠标事件
		};
		options = $.extend({},defaults, options);
		return new tabSlider(this, options);  
	}

})(jQuery,window,document,undefined)
