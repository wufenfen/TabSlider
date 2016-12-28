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
 * $(".tabSlider")({
 		 
});
 */


; (function($,window,document,undefined){ //最后一个undefined, 防止undefined被重写
	var tabSlider = function(ele, options){
		var $tabs = $(options.tabs).children();
		var $contents = $(options.content).children();
		var $line = $(options.line);

		var tabSliderNum = $contents.length; 
		//初始化tab，设置当前激活的tab
		function activeTab(activeTabIndex, activeItem){
			activeTabIndex = activeTabIndex;

			$tabs.each(function(index, item){
				if((index ==  activeTabIndex) || (activeItem && (item == activeItem || activeItem.parentNode == item))){
					$(item).addClass(options.tabActiveClass);
					$line.css('left', 100/tabSliderNum*(index) + '%');
					activeTabIndex = index;
					activeContent(activeTabIndex); //初始化内容排版
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
		var startY, endY, startX, endX;
		var activeTabIndex; //被激活的tab索引
		var isValid; //判断此次的滑动是否为水平滑动

		activeTab(0);//默认第一个是激活的tab

		$contents.on("touchstart",  startTouchScroll, false);
		$contents.on("touchmove", moveTouchScroll, false);
		$contents.on("touchend",  endTouchScroll, false);
		$tabs.on("click", function(event){ 
			activeTab(-1, event.target);
		})
		function startTouchScroll(event){

		}

		function moveTouchScroll(event){
			
		}

		function endTouchScroll(event){
			
		}
	}


	$.fn.tabSlider = function(options){
		var defaults = {
			tabs: '.tab', //tab元素
	    	content: '.content', //内容元素
		    line: ".line",  //tab下划线元素
	    	tabActiveClass: 'active', //当前激活tab样式
	    	transClass:"trans" //过渡效果设置
		};
		options = $.extend({}, options, defaults);
		return new tabSlider(this, options);  
	}

})(jQuery,window,document,undefined)
