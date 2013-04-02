var openedId = 0;
var curTime;
var time1;
var time2;
jQuery.fn.youtubePopup = function(options) {

  var defaults = {
		 openId : '.utube',
    	 closeId : '.closebtn',
		 youtubeUrl: '',
		 conDiv: '.orCon'
	};

	var settings = jQuery.extend( {}, defaults, options);
	if (jQuery("#overlay").length == 0)
		jQuery('body').append('<div id="overlay" class="overlay"></div>');
//	jQuery.getScript('/theme/js/flash_detect_min.js');
  	return this.each(function(){

		var iframeCont = '<iframe type="text/html" frameborder="0" id="frameId" width="880" height="460" src="' + settings.youtubeUrl  + '"></iframe>';
		
		var $contentDiv = settings.conDiv;
		var $current = this;
		
		jQuery(settings.openId).bind( 'click', openPopup );
		jQuery(settings.closeId).bind( 'click', closePopup );

		jQuery(window).bind('scroll', scrollPopup);
		jQuery("body").append(jQuery($current));
		

		function openPopup( event ){
			if (openedId == 0) {
				openedId = '#' + jQuery(this).attr('id');
				curTime = new Date();
				time1 = curTime.getTime();
			}
			/*
			if(!FlashDetect.installed){
				var flashHtml = "<div id='frameId' style='width:100%;height:460px;background-color:#000;'><div style='padding:5px 0;text-align:center;width:100%;height:50px;color:#fff;background-color:RED;'>You need to upgrade your Adobe Flash Player to watch this video." +
				"<br/><a target='_blank' style='color:#fff;' href='http://get.adobe.com/flashplayer/'>Download it from Adobe</a></div><div>";
				jQuery($contentDiv).html(flashHtml);
			}
			else*/
			{
				jQuery($contentDiv).html(iframeCont);
			}
			
			jQuery("#overlay").height(jQuery(document).height());
			jQuery("#overlay").fadeIn(1000,function(){
				jQuery(this).css("filter", "alpha(opacity=80)");
				jQuery(this).css('z-index', "200000");
			});
			jQuery($current).fadeIn(2000);
			jQuery($current).css('z-index', "300000");
			scrollPopup(event);
			var thisShareId = jQuery(this).attr("id") + "if";
			if (jQuery("#" + thisShareId).length > 0) {
				jQuery("#" + thisShareId).show();
			}
		
			return false;
		};
		function closePopup(event) {
			if (openedId == settings.openId) {
				curTime = new Date();
				time2 = curTime.getTime();
				var duration = time2-time1;
				openedId = 0;
				jQuery.ajax({
					url: '/wp-content/downloads/saveVideoPlayDuration.php',
					cache: false,
					type: "POST",
					data:({dur:duration, vid:settings.youtubeUrl}),
					success: function(response) {
					 //alert(response);
					}
				});
			}
			jQuery("#overlay").fadeOut();
			jQuery("#frameId").remove();
			jQuery($current).fadeOut();
			jQuery(".ifrmFT").hide();
			return false;
		};
		function scrollPopup(event) {
			var marginTp = jQuery(this).scrollTop() + 30 + 'px';
			jQuery($current).css("margin-top", marginTp);
		};
	});
};
