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
	
		//初始化tab，设置当前激活的tab
		function activeTab(myIndex, activeItem){
			activeTabIndex = myIndex;

			$tabs.each(function(index, item){
				if((index ==  activeTabIndex) || (activeItem && (item == activeItem || activeItem.parentNode == item))){
					$(item).addClass(options.tabActiveClass);
					$line.addClass('trans');
					$line.css('left', 100/tabSliderNum*(index) + '%');
					activeTabIndex = index;
					activeContent(activeTabIndex);  
				}
				else{
					$(item).removeClass(options.tabActiveClass); 
				}
			})
		}

		//设置当前激活tab的内容
		function activeContent(activeTabIndex){
			if(activeTabIndex==undefined || activeTabIndex<0){
				return;
			}
			$contents.each(function(index, item){ 
				$(item).css('position', 'absolute');
				$(item).addClass('trans');
				$(item).css('left', 100*(index-activeTabIndex) + '%'); 
			})
		}

		function moveContent(distance){
			//向右滑，滑出左侧的tab,如果已经处于最左侧的tab，不会滑动;反之亦然
			if( (distance>0 && distance<maxMoveDistance && activeTabIndex!=0) ||
			(distance<0 && distance>-1*maxMoveDistance && activeTabIndex!=tabSliderNum-1)){		 			 
				$line.removeClass('trans'); 
				$line.css('left',  activeTabIndex/tabSliderNum*tabWidth-distance + 'px'); 
				$contents.each(function(index, item){  
					$(item).removeClass('trans');
					$(item).css('left', (index-activeTabIndex)*tabWidth + distance + 'px'); 
				})
			} 
		}  

		function startTouchScroll(event){
			var touch;
			if(event.type == "mousedown"){
				if(options.mousetouch){ 
					touch = event;
					isMouseDown = true;
				}
				else{
					return;
				}
			}
			else{ 
				touch = event.originalEvent.targetTouches[0];
			} 
	        startX = touch.pageX;
	        startY = touch.pageY;
		}

		function moveTouchScroll(event){ 
	        if(isValid == undefined){
		        //滑动过程中只判断一次
		        if( Math.abs((endY - startY)/(endX - startX)) > 1){
		        	isValid = false;
		        }else{
		        	isValid = true;
		        }
	        }

	        var touch;
			if(event.type == "mousemove"){
				if(options.mousetouch && isMouseDown){ 
					touch = event;
				}
				else{
					return;
				}
			}
			else{ 
				touch = event.originalEvent.targetTouches[0];
			}  
	        endX = touch.pageX;
	        endY = touch.pageY;


	        if( isValid ){
	        	event.preventDefault();

		        var distance = endX - startX; 
		        //滑动内容
		        moveContent(distance);
		    }
		}

		function endTouchScroll(event){
			isMouseDown = false;
			if( !isValid ){
	        	isValid = undefined;
	        	return;
	        } 

			if(event.type == "mouseup" && !options.mousetouch){
				return;
			} 

	        var distance = endX - startX; 
	        if( distance > threshold && activeTabIndex!=0){ //向右滑
 				activeTab(activeTabIndex-1);
	        }
	        else if( distance < -1*threshold && activeTabIndex != tabSliderNum-1){ //向左滑
 				activeTab(activeTabIndex+1); 
	        } 
	        else{
 				activeTab(activeTabIndex); 
	        }
	        isValid = undefined;
		}

		var $tabs = $(options.tabs).children();
		var $contents = $(options.content).children();
		var $line = $(options.line);

		var startY, endY, startX, endX;
		var activeTabIndex; //被激活的tab索引
		var isValid; //判断此次的滑动是否为水平滑动
		var isMouseDown; //鼠标是否处于按下状态

		var tabSliderNum = $contents.length; //tab的个数
		var tabWidth = ele.width(); //整个tab组件的宽度
		var maxMoveDistance = tabWidth/tabSliderNum; //滑动过程中内容能移动的最大距离
		var threshold = maxMoveDistance/2; //滑动距离超过threshold即可认为成功切换tab

		activeTab(0);//默认第一个是激活的tab

		$(options.content).on("touchstart mousedown",  startTouchScroll);
		$(options.content).on("touchmove mousemove", moveTouchScroll);
		$(options.content).on("touchend mouseup",  endTouchScroll);
		//点击也能成功切换tab
		$tabs.on("click", function(event){ 
			activeTab(-1, event.target);
		}) 
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
