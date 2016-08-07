
function addBtn(){
	$('.comment-btn').addClass('comment-btn-display');
}

$(function (){

	//全局变量
	var atIdArr=new Array();
	var userId = localStorage['userId'];
    var token = localStorage['token'];
    if(location.search){
    	var postId= location.search.split("=")[1];

    }else{
    	var postId="579c53b4530a49bc3f3d05ff";//到时传参数进来
    }
    console.log("userID:"+userId);
    console.log("token:"+token);
    //表情的处理
    var facedeal = function(){
    // $(function() {
        $('.emotion').qqFace({
            id: 'qqFace',
            //表情盒子的ID
            assign: 'comment-reply-text',
            //给那个控件赋值
            path: 'assets/img/face/' //表情存放的路径
        });
	 }
    //报名
	$('.signup-btn').click(function(){
		$.ajax({
		    url : 'http://192.168.20.25:3000/post/register',
		    data: {registerId:userId,postId:postId},
		    type: 'post',
		    dataType: "json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		    	xhr.setRequestHeader("xtoken", token);
		    	xhr.setRequestHeader("xkey", userId);
		    },
		    success: function (data) {
		    	if(data.statusCode==100){
		    		alert('已成功报名当前帖子！');
		    		location.reload();//刷新
		 	    }else alert(data.message);
		    },
		    error:function(data) {
		    	alert("error!");
		    	console.log("errorCode:"+data.statusCode);
				console.log("errorMessage:"+data.message);
		    }
		});
	});

	//举报
	$('.report-modal-footer .report-btn-yes').click(function(){
		//获取举报原因
		var report=$.trim($("input[type='radio']:checked").parent().text());
		console.log(report);
		if(report){
			$.ajax({
			    url : 'http://192.168.20.25:3000/post/tipoff',
			    data: {userId:userId,postId:postId,reason:"report"},
			    type: 'post',
			    dataType: "json",
			    crossDomain: true,
			    beforeSend: function (xhr) {
			    	xhr.setRequestHeader("xtoken", token);
			    	//console.log(token);
			    	xhr.setRequestHeader("xkey", userId);
			    },
			    success: function (data) {
			    	if(data.statusCode==100){
			    		alert('已成功举报当前帖子！')
			 	}else alert(data.message);
			    },
			    error:function(data) {
			    	alert("error!");
			    	console.log("errorCode:"+data.statusCode);
					console.log("errorMessage:"+data.message);
			    }
			});
		}else alert("请选择举报原因");

	});

	
	$('#infoTab li:eq(0) a').tab('show');
	// 点击出现回复框和按钮
	$('.all-comment').on('click','.comment-reply-img',function(){
		$reply=$(this).parent().children('.comment-reply');
		$reply.toggleClass('comment-reply-display');
	});

	// 评论
	$('.comment-btn').click(function(){
		var comment=$('.my-comment-input').val();
		if(!comment){
			alert('评论内容不能为空！');
			return;
		}
		else{
			$.ajax({
			    url : 'http://192.168.20.25:3000/post/comment',
			    data: {postId:postId,fromId:userId,atName:"",atId:"",content:comment},
			    type: 'post',
			    dataType: "json",
			    beforeSend: function (xhr) {
			    	xhr.setRequestHeader("xtoken", token);
			    	xhr.setRequestHeader("xkey", userId);
			    },
			    success: function (data) {
			    	if(data.statusCode==100){
			    		//location.reload();//刷新
			    		/*var commentNum=parseInt($(".comNum").last().text())+1;
						var newHtml='<div class="comment">'+
										'<div class="comment-heading pull-left"><img src="'+data.result.comment.fromAvatar+'" alt="用户头像"></div>'+
										'<div class="comment-info pull-left">'+
											'<p class="comment-user"><span class="comment-name">'+data.result.comment.fromName+'</span> <span class="blue"><span class="comNum">'+commentNum+'</span>楼</span><span class="blue">·'+data.result.comment.time+'前</span></p>'+
											'<p class="comment-content">'+comment+'</p>'+
										'</div>'+
										'<div type="button" class="comment-reply-img pull-right btn"><img src="img/reply.png"></div>'+
										'<div style=" clear:both;"></div>'+
										'<div class="comment-reply">'+
											'<textarea class="comment-reply-text" placeholder="@'+data.result.comment.fromName+'"></textarea>'+ 
											'<button type="button" class="btn btn-primary pull-right comment-reply-btn">回复</button>'+
											'<div style=" clear:both;"></div>'+
										'</div>'+
										'<div class="line"></div>'+
									'</div>';
						$('.all-comment').append(newHtml);*/
						$(".my-comment-input").val("");
						alert("评论成功！");
						location.reload();//刷新
					}else {
						alert('评论失败！'); 
						console.log("successCode:"+data.statusCode);
						console.log("successMessage:"+data.message);
					}
				},error:function(data) {
					alert("error!");
					console.log("errorCode:"+data.statusCode);
					console.log("errorMessage:"+data.message);
				}
			});
		}
	});
	// 回复
	$('.all-comment').on('click','.comment-reply-btn',function(){
	// $('.comment-reply-btn').click(function(){
		// 获取被回复用户的名称
		var commentname=$(this).parent().parent().children('.comment-info').children('.comment-user').children('.comment-name').text();		
		var floor=$(this).parent().parent().children('.comment-info').children('.comment-user').children('.blue').children('.comNum').text();
		var atid=atIdArr[floor-1];
		var reply=$(this).parent().children('.comment-reply-text').val();
		//alert(commentname+" "+atid+" "+reply);
		if(!reply){
			alert('评论内容不能为空！');
			return;
		}
		else{
			$.ajax({
			    url : 'http://192.168.20.25:3000/post/comment',
			    data: {postId:postId,fromId:userId,atName:commentname,atId:atid,content:reply},
			    type: 'post',
			    dataType: "json",
			    beforeSend: function (xhr) {
			    	xhr.setRequestHeader("xtoken", token);
			    	xhr.setRequestHeader("xkey", userId);
				},
			    success: function (data) {
			    	console.log(data.statusCode+data.message);
			    	if(data.statusCode==100){
			    		//alert("100");
			    		//location.reload();//刷新
						/*var commentNum=parseInt($(".comNum").last().text())+1;
						var newHtml='<div class="comment">'+
										'<div class="comment-heading pull-left"><img src="'+data.result.comment.fromAvatar+'" alt="用户头像"></div>'+
										'<div class="comment-info pull-left">'+
											'<p class="comment-user"><span class="comment-name">'+data.result.comment.fromName+'</span> <span class="blue"><span class="comNum">'+commentNum+'</span>楼</span><span class="blue">·'+data.result.comment.time+'前</span></p>'+
											'<p class="comment-content">'+'<span class="blue">@'+commentname +' </span>'+reply+'</p>'+
										'</div>'+
										'<div type="button" class="comment-reply-img pull-right btn"><img src="img/reply.png"></div>'+
										'<div style=" clear:both;"></div>'+
										'<div class="comment-reply">'+
											'<textarea class="comment-reply-text" placeholder="@'+commentname+'"></textarea>'+ 
											'<button type="button" class="btn btn-primary pull-right comment-reply-btn">回复</button>'+
											'<div style=" clear:both;"></div>'+
										'</div>'+
										'<div class="line"></div>'+
									'</div>';
						$('.all-comment').append(newHtml);*/
						$(".comment-reply-text").val("");
						alert("回复成功！");
						location.reload();//刷新
					}else{
						alert("回复失败！");
						console.log("successCode:"+data.statusCode);
						console.log("successMessage:"+data.message);
					}
				},
				error:function(data){
					alert("error!");
					console.log("errorCode:"+data.statusCode);
					console.log("errorMessage:"+data.message);
				}
			});
		}
	});

	//获取单个帖子详情
	(function(){
		//时间转换格式
		format = function(time, format){
		    var t = new Date(time);
		    var tf = function(i){return (i < 10 ? '0' : '') + i};
		    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
		        switch(a){
		            case 'yyyy':
		                return tf(t.getFullYear());
		                break;
		            case 'MM':
		                return tf(t.getMonth() + 1);
		                break;
		            case 'mm':
		                return tf(t.getMinutes());
		                break;
		            case 'dd':
		                return tf(t.getDate());
		                break;
		            case 'HH':
		                return tf(t.getHours());
		                break;
		            case 'ss':
		                return tf(t.getSeconds());
		                break;
		        }
		    })
		}
		//显示距离当前多久前的时间
		showTime = function(time){
	        var comment_time = new Date(time);   //将时间字符串转换为时间.
	        var now_time = new Date();
	        var totalSecs=(now_time-comment_time)/1000;   //获得两个时间的总毫秒数. 靠前的就调换再减。
	        var year=Math.floor(totalSecs/3600/24/30/12);
	        var month=Math.floor(totalSecs/3600/24/30);
	        var days=Math.floor(totalSecs/3600/24); 
	        var hours=Math.floor((totalSecs-days*24*3600)/3600); 
	        var mins=Math.floor((totalSecs-days*24*3600-hours*3600)/60); 
	        if(year!=0){
	        	var syear=year+"年前";
	        	return syear;
	        }
	        else if(year==0 && month!=0){
	        	var smonth=month+"月前";
	        	return smonth;
	        }
	        else if (month==0 && days != 0 ) { 
	        	var sday=days+"天前";
	        	return sday;
	        }else if (hours == 0 && mins != 0) { 
	        	var smins=mins+"分钟前";
	        	return smins;
	        }else if (hours != 0) { 
	        	var shours=hours+"小时前";
	        	return shours;
	        }else {
	        	var snow="刚刚";
	        	return snow;
	        }
        }
		$.ajax({
		    url : 'http://192.168.20.25:3000/post/getPost',
		    data: {postId:postId},
		    type: 'post',
		    dataType: "json",
		    beforeSend: function (xhr) {
			    	xhr.setRequestHeader("xtoken", token);
			    	xhr.setRequestHeader("xkey", userId);
			},
		    success: function (data) {
		         console.log("success:"+data.statusCode+data.message);
		         console.log("success:"+data.result);
		         if(data.statusCode==100){
	
		         	$('.title').html(data.result.title);
		         	var facecontent=data.result.content.replace(/\[em_([0-9]*)\]/g,'<img src="assets/img/face/$1.gif" border="0" />');
		         	//console.log(facecontent);
		         	$('.post-content').html(facecontent);

		         	$('.expTime').html(data.result.expTime);
		         	switch(data.result.status)
					{
					case "0":
					  $('.participantNum').html(data.result.participant.length);
					  break;
					case "1":
					  $('.participantNum').html(data.result.participant.length);
					  break;
				    case "2":
				      $('.participantStatus').html("已有参与者");
				      break;	  
					default:
					  $('.participantStatus').html("");
					}
					$('.commentNum').html(data.result.commentNum);
					
					var string=data.result.pubTime;
					var nowDate = new Date(string);
					var pubtime=format(nowDate, 'yyyy-MM-dd HH:mm:ss');
					$('.pubTime').html(pubtime);

					$('.publisherName').html(data.result.publisherName);
					// 任务截止时间

	                var postPubtime= pubtime.replace(new RegExp("-","gm"),"/");
	                var postPubsecs = (new Date(postPubtime)).getTime(); //得到毫秒数  
	                var secs=postPubsecs+ +data.result.expTime;
	                // console.log(secs);
	                var newTime = new Date(secs); //就得到正常格式的时间了
	                // console.log(newTime);

					// var deadline=new Date(data.result.expTime);
					var signdeadline=format(newTime, 'yyyy-MM-dd HH:mm:ss');
					$('#deadline').html(signdeadline);
					//联系方式
					var contact=data.result.contact;
					$('#contactphone').html(contact);

					if(data.result.pictures.length){
						for(var i=0;i<data.result.pictures.length;i++){
							var picHtml='<li>'+
											'<a type="button" class="thumbnail picture" data-toggle="modal" data-target="#Modal-img'+i+'"><img src="http://192.168.20.25:3000/'+data.result.pictures[i]+'"></a>'+
											'<div class="modal fade" id="Modal-img'+i+'" tabindex="1" role="dialog" aria-labelledby="myModalLabel">'+
												'<div class="modal-dialog" role="document">'+
													'<div class="modal-content">'+
														'<div class="modal-body thumbnail"><img src="http://192.168.20.25:3000/'+data.result.pictures[i]+'"></div>'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</li>';
							$('.picture-lists').append(picHtml);
						}
					}
					for(var j=0;j<data.result.comment.length;j++){
						//alert("aa");
						if(data.result.comment[j].atName){
							var atPerson="@"+data.result.comment[j].atName+" ";
						}else var atPerson="";
						var stringtime=data.result.comment[j].time;
						var commenttime=showTime(stringtime);
						var facecomment=data.result.comment[j].content.replace(/\[em_([0-9]*)\]/g,'<img src="assets/img/face/$1.gif" border="0" />');
						var commentHtml='<div class="comment">'+
											'<div class="comment-heading pull-left"><img src="'+data.result.comment[j].fromAvatar+'" alt="用户头像"></div>'+
											'<div class="comment-info pull-left">'+
												'<p class="comment-user"><span class="comment-name">'+data.result.comment[j].fromName+'</span> <span class="blue"><span class="comNum">'+(j+1)+'</span>楼</span><span class="blue">·'+commenttime+'</span></p>'+
												'<p class="comment-content"><span class="blue">'+atPerson+'</span>'+facecomment+'</p>'+
											'</div>'+
											'<i type="button" class="comment-reply-img pull-right btn" title="回复"><img src="assets/img/reply.png"></i>'+
											'<div style=" clear:both;"></div>'+
											'<div class="comment-reply">'+
												'<textarea class="comment-reply-text"  placeholder="@'+data.result.comment[j].fromName+'"></textarea>'+ 
												'<button type="button" class="btn btn-primary pull-right comment-reply-btn">回复</button><span class="pull-right emotion"></span>'+
												'<div style=" clear:both;"></div>'+
											'</div>'+
											'<div class="line"></div>'+	
										'</div>';
						atIdArr[j]=data.result.comment[j].fromId;
						$('.all-comment').append(commentHtml);
						
					}
					if(data.result.comment.length){facedeal();}
		         	
		        }else {
		        	console.log("else:"+data.statusCode+data.message);
		        }
		    },
			error:function(data) {
				console.log("error:"+data.statusCode+data.message);
			}
		});

	})();


	// 热门帖子
	(function(){
		$.ajax({
		    url : 'http://192.168.20.25:3000/post/getAll',
		    data: {type:2,status:0,start_num:1,page_size:6,sortBy:'favorCount'},
		    type: 'post',
		    dataType: "json",
		    crossDomain: true,
		    beforeSend: function (xhr) {
		    	xhr.setRequestHeader("xtoken", token);
		    	xhr.setRequestHeader("xkey", userId);
		    },
		    success: function (data) {
		    	if(data.statusCode==100){
		    		for(var j=0;j<data.result.length;j++){
		    			var hotpostHtml='<li><a href="detail.html?id='+data.result[j]._id+'">'+data.result[j].title+'</a></li>';
						$('.hot-post-content').append(hotpostHtml);
		    		}
		 	    }else alert(data.message);
		    },
		    error:function(data) {
		    	alert("error!");
		    	console.log("errorCode:"+data.statusCode);
				console.log("errorMessage:"+data.message);
		    }
		});
	})();




	
});
