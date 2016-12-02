/**
 * 示例：
 * 浮点数   	$("#elem").numeral(true);
 * 整 数   	$("#elem").numeral(false);
 * 
 * plus:正数且不为0
 */
$(function() {
	$.fn.numeral=function(bl,plus){//限制金额输入、兼容浏览器、屏蔽粘贴拖拽等
		$(this).keypress(function(e){
	    	var keyCode=e.keyCode?e.keyCode:e.which;
	        if(bl){//浮点数
	        	if((this.value.length==0 || this.value.indexOf(".")!=-1) && keyCode==46){
	        		return false;
	        	}
	        	return keyCode>=48&&keyCode<=57||keyCode==46||keyCode==8;
	        }else{//整数
	          return  keyCode>=48&&keyCode<=57||keyCode==8;
	        }
	    });
	    $(this).bind("paste", function (e) { // 通过空格连续添加粘贴事件 
	    	var s = clipboardData.getData('text');
            if (!/\D/.test(s));
            value = s.replace(/^0*/, '');
            return false;
	    }); 
	    $(this).bind("dragenter",function(){return false;});
	    $(this).css("ime-mode","disabled");
	    $(this).bind("blur", function() {
	    	if (this.value.lastIndexOf(".") == (this.value.length - 1)) {   
		    	this.value = this.value.substr(0, this.value.length - 1);
		    } else if (isNaN(this.value)) {   
		        this.value = "";   
		    }
	    	
	    	if("plus"==plus){
	    		var currVal = parseFloat(this.value);
	    		if(currVal<=0){
	    			if(currVal==0){
	    				this.value = "";
	    			}else{
	    				this.value = this.value.substr(1, this.value.length);
	    			}
	    		}
	    	}
	    });   
	}
});