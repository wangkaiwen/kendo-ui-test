/**
 * 调用示例:
 * 
 	$(".pager").pager({
		totalRecord:'600',
		pageSize:'15',
		currentPage:'1',
		pageUrl:jsCtxPath+"/page/#",
		paramArray:['PagerNumber']
	});
	
	PagerNumber 代表当前请求的分页数，本变量为插件变量，不可替换
	#为占位符，与paramArray数组对应
	
	
ajax调用

	function ajaxPager(currPage){
		pagerIng(currPage);
		$.ajax({
            url: jsCtxPath+"/ajax/htmlmodel/pager?pageNo="+currPage,
            type:'post',
            dataType: "json",
            success: function(data) {
            	alert(data);
            }
        });
	}
	
	function pagerIng(currentPage){
		$(".pager").pager({
			totalRecord : '200',
			pageSize : '10',
			currentPage : currentPage,
			pagerType:"ajax",
			onClickFunction:"ajaxPager"
		});
	}	
	
	
 */
var _jquery_pager_currPage = 0;
(function($) {
	$.fn.pager = function(options){
        var defaults = {
            totalRecord:60,
            pageSize:10,
            currentPage:1,
            totalPage:1,
            pagerType:"",//ajax 或 ""  点击分页的效果
            operateElem:null,//分页操作所属的父元素
            onClickFunction:"",
            pageUrl:"",//请求分页数据的url #为占位符
            paramArray:[] //与url中的#占位符对应，其中Reqpage为关键字
        };
        var params = $.extend({}, defaults, options || {});
        
        if(params.operateElem==null){
    		params.operateElem = this;
    	}
        
        var numberReg = /^\d+$/;
        if(!numberReg.test(params.totalRecord)){
        	params.totalRecord = 60;
        }
        if(!numberReg.test(params.pageSize)){
        	params.pageSize = 10;
        }
        if(!numberReg.test(params.currentPage)){
        	params.currentPage = 1;
        }
        if(!numberReg.test(params.totalPage)){
        	params.totalPage = 1;
        }
        
        if(params.totalPage==1){
        	if(params.totalRecord%params.pageSize==0){
        		params.totalPage = parseInt(params.totalRecord/params.pageSize);
        	}else{
        		params.totalPage = parseInt(params.totalRecord/params.pageSize)+1;
        	}
        }
        
        if(params.totalRecord==0){
        	//$(this).html("<span class='pager_nodata'>暂无数据</span>");
        	$(this).html("");
        	return;
    	}
        
        if(params.totalPage<2){
        	$(this).hide();
        	return
        }
        
        var clickFunName = params.onClickFunction;
        var newPageUrl = "";
        var requestUrlArr = (params.pageUrl).split("#");
    	for(var i=0;i<requestUrlArr.length;i++){
    		if(requestUrlArr[i]!=""){
    			newPageUrl += requestUrlArr[i]+(params.paramArray)[i];
    		}
    	}
       
    	var innerElemStart = "<div class='inner'>";
        var innerElemEnd = "</div>";
        var firstPage = "";
        var pagesHtml = "";
        var morepage = "";
        var lastPage = "";
        _jquery_pager_currPage = params.currentPage;
        var prev = parseInt(params.currentPage)-1;
        var next = parseInt(params.currentPage)+1;
        var prevpage = "";
        var nextpage = "";
        if(prev<1){
        	prev = 1;
        }
        if(next>params.totalPage){
        	next = params.totalPage;
        }
        
    	if(params.pagerType=='ajax'){
    		firstPage = "";
            pagesHtml = "";
            prevpage = "";
            nextpage = "";
            morepage = "<span class='pagnMore hidden-xs'>……</span>";
            lastPage = "<span class='hidden-xs' onclick='"+params.onClickFunction+"("+params.totalPage+")'><a href='javascript:void(0)'>"+params.totalPage+"</a></span>";
            
            if(params.totalPage<=6){
            	prevpage = "<span class='hidden-xs' onclick='"+params.onClickFunction+"("+prev+")'><a href='javascript:void(0)'>«</a></span>";
                nextpage = "<span class='hidden-xs' onclick='"+params.onClickFunction+"("+next+")'><a href='javascript:void(0)'>»</a></span>";
            }else{
            	prevpage = "<span onclick='"+params.onClickFunction+"("+prev+")'><a href='javascript:void(0)'>«</a></span>";
                nextpage = "<span onclick='"+params.onClickFunction+"("+next+")'><a href='javascript:void(0)'>»</a></span>";
            }
        }else{
            //firstPage = "<span><a href='"+mergeUrl(newPageUrl,1)+"'>首页</a></span>";
        	firstPage = "";
            pagesHtml = "";
            prevpage = "";
            nextpage = "";
            morepage = "<span class='pagnMore hidden-xs'>……</span>";
            lastPage = "<span class='hidden-xs'><a href='"+mergeUrl(newPageUrl,params.totalPage)+"'>"+params.totalPage+"</a></span>";
            
            if(params.totalPage<=6){
            	prevpage = "<span class='hidden-xs'><a href='"+mergeUrl(newPageUrl,prev)+"'>«</a></span>";
                nextpage = "<span class='hidden-xs'><a href='"+mergeUrl(newPageUrl,next)+"'>»</a></span>";
            }else{
            	prevpage = "<span><a href='"+mergeUrl(newPageUrl,prev)+"'>«</a></span>";
                nextpage = "<span><a href='"+mergeUrl(newPageUrl,next)+"'>»</a></span>";
            }
        }
    	
        
        this.each(function(){
        	if(params.pagerType=='ajax'){
        		//总页数<=6页
            	if(params.totalPage<=6){
            		for(var i=1;i<=params.totalPage;i++){
                		if(i==params.currentPage){
                			pagesHtml += "<span class='currPage' onclick='"+params.onClickFunction+"("+i+")'><a href='javascript:void(0)'>"+i+"</a></span>";
                		}else{
                			pagesHtml += "<span onclick='"+params.onClickFunction+"("+i+")'><a href='javascript:void(0)'>"+i+"</a></span>";
                		}
                	}
            		pagesHtml = innerElemStart+firstPage+prevpage+pagesHtml+nextpage+innerElemEnd;
            	}else{
            		if(params.currentPage<=4){
            			var loopCount = 1;
            			do{
            				if(loopCount==params.currentPage){
                    			pagesHtml += "<span class='currPage' onclick='"+params.onClickFunction+"("+loopCount+")'><a href='javascript:void(0)'>"+loopCount+"</a></span>";
                    		}else{
                    			pagesHtml += "<span onclick='"+params.onClickFunction+"("+loopCount+")'><a href='javascript:void(0)'>"+loopCount+"</a></span>";
                    		}
            				loopCount++;
            			}while(loopCount<=4);
            			
            			if(loopCount==5){
            				pagesHtml +="<span class='hidden-xs' onclick='"+params.onClickFunction+"("+loopCount+")'><a href='javascript:void(0)'>"+loopCount+"</a></span>";
            			}
            			pagesHtml = innerElemStart+firstPage+prevpage+pagesHtml+morepage+lastPage+nextpage+innerElemEnd;
            			
            		}else if((parseInt(params.currentPage)+2)>=parseInt(params.totalPage)){
            			pagesHtml = innerElemStart+firstPage+prevpage+"<span class='hidden-xs' onclick='"+params.onClickFunction+"(1)'><a href='javascript:void(0)'>"+1+"</a></span>"+morepage;
            			pagesHtml += "<span onclick='"+params.onClickFunction+"("+prev+")'><a href='javascript:void(0)'>"+prev+"</a></span>";
            			pagesHtml += "<span class='currPage' onclick='"+params.onClickFunction+"("+params.currentPage+")'><a href='javascript:void(0)'>"+params.currentPage+"</a></span>";
            			if(params.currentPage==parseInt(params.totalPage)-2){
            				pagesHtml += "<span onclick='"+params.onClickFunction+"("+next+")'><a href='javascript:void(0)'>"+next+"</a></span>";
            				pagesHtml += lastPage;
            			}else if(params.currentPage==parseInt(params.totalPage)-1){
            				pagesHtml += "<span onclick='"+params.onClickFunction+"("+next+")'><a href='javascript:void(0)'>"+next+"</a></span>";
            			}
            			pagesHtml += nextpage+innerElemEnd;
            		}else{
            			pagesHtml = innerElemStart+firstPage+prevpage+"<span class='hidden-xs' onclick='"+params.onClickFunction+"(1)'><a href='javascript:void(0)'>"+1+"</a></span>"+morepage;
            			pagesHtml += "<span onclick='"+params.onClickFunction+"("+prev+")'><a href='javascript:void(0)'>"+prev+"</a></span>";
            			pagesHtml += "<span class='currPage' onclick='"+params.onClickFunction+"("+params.currentPage+")'><a href='javascript:void(0)'>"+params.currentPage+"</a></span>";
            			pagesHtml += "<span onclick='"+params.onClickFunction+"("+next+")'><a href='javascript:void(0)'>"+next+"</a></span>";
            			pagesHtml += morepage+lastPage+nextpage+innerElemEnd;
            		}
            	}
            	
        	}else{
        		//总页数<=6页
            	if(params.totalPage<=6){
            		for(var i=1;i<=params.totalPage;i++){
                		if(i==params.currentPage){
                			pagesHtml += "<span class='currPage'><a href='"+mergeUrl(newPageUrl,i)+"'>"+i+"</a></span>";
                		}else{
                			pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,i)+"'>"+i+"</a></span>";
                		}
                	}
            		pagesHtml = innerElemStart+firstPage+prevpage+pagesHtml+nextpage+innerElemEnd;
            	}else{
            		if(params.currentPage<=4){
            			var loopCount = 1;
            			do{
            				if(loopCount==params.currentPage){
                    			pagesHtml += "<span class='currPage'><a href='"+mergeUrl(newPageUrl,loopCount)+"'>"+loopCount+"</a></span>";
                    		}else{
                    			pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,loopCount)+"'>"+loopCount+"</a></span>";
                    		}
            				loopCount++;
            			}while(loopCount<=4);
            			
            			if(loopCount==5){
            				pagesHtml +="<span class='hidden-xs'><a href='"+mergeUrl(newPageUrl,loopCount)+"'>"+loopCount+"</a></span>";
            			}
            			pagesHtml = innerElemStart+firstPage+prevpage+pagesHtml+morepage+lastPage+nextpage+innerElemEnd;
            			
            		}else if((parseInt(params.currentPage)+2)>=parseInt(params.totalPage)){
            			pagesHtml = innerElemStart+firstPage+prevpage+"<span class='hidden-xs'><a href='"+mergeUrl(newPageUrl,1)+"'>"+1+"</a></span>"+morepage;
            			pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,prev)+"'>"+prev+"</a></span>";
            			pagesHtml += "<span class='currPage'><a href='"+mergeUrl(newPageUrl,params.currentPage)+"'>"+params.currentPage+"</a></span>";
            			if(params.currentPage==parseInt(params.totalPage)-2){
            				pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,next)+"'>"+next+"</a></span>";
            				pagesHtml += lastPage;
            			}else if(params.currentPage==parseInt(params.totalPage)-1){
            				pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,next)+"'>"+next+"</a></span>";
            			}
            			pagesHtml += nextpage+innerElemEnd;
            		}else{
            			pagesHtml = innerElemStart+firstPage+prevpage+"<span class='hidden-xs'><a href='"+mergeUrl(newPageUrl,1)+"'>"+1+"</a></span>"+morepage;
            			pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,prev)+"'>"+prev+"</a></span>";
            			pagesHtml += "<span class='currPage'><a href='"+mergeUrl(newPageUrl,params.currentPage)+"'>"+params.currentPage+"</a></span>";
            			pagesHtml += "<span><a href='"+mergeUrl(newPageUrl,next)+"'>"+next+"</a></span>";
            			pagesHtml += morepage+lastPage+nextpage+innerElemEnd;
            		}
            	}
            	
        	}
        	
        	$(params.operateElem).html(pagesHtml);
        });
    };
    
    function mergeUrl(newPageUrl,index){
    	var currPageLength = (_jquery_pager_currPage+"").length;
    	var currLocation = document.location.href;
    	var numberOffset = newPageUrl.indexOf("PagerNumber");
    	var newPageUrlPrev = newPageUrl.substring(0,numberOffset);// /member/
    	if(currLocation.indexOf(newPageUrlPrev)==-1){
    		currLocation = currLocation+"?"+newPageUrlPrev.split("?")[1];
    	}
    	var hostOffset = currLocation.indexOf(newPageUrlPrev);
    	var firstCurrHref = currLocation.substring(0,hostOffset); //http://www.xxx.com
    	var endLocationHref = currLocation.substring(hostOffset,currLocation.length);// /member/1?abc=ded
    	var lastCurrHref = endLocationHref.substring(newPageUrlPrev.length+currPageLength,endLocationHref.length);
    	
    	var currHref = firstCurrHref+newPageUrlPrev+index+lastCurrHref;
    	return currHref;
    };
    
})(jQuery);