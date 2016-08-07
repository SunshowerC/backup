$(function(){
	var userId = localStorage['userId'];
    var token = localStorage['token'];
    
    $('.search-icon').click(function(){
    	var searchText=$('.search-box').val();
    	// 搜索
		$.ajax({
			    url : 'http://192.168.20.25:3000/search',
			    data: {keyword:searchText},
			    type: 'post',
			    dataType: "json",
			    crossDomain: true,
			    beforeSend: function (xhr) {
			    	xhr.setRequestHeader("xtoken", token);
			    	xhr.setRequestHeader("xkey", userId);
			    },
			    success: function (data) {
			    	if(data.statusCode==100){
			    		$('.searchPost').html("");
			    		$('.searchUser').html("");
			    		// data.result[1]代表搜索到的帖子
			    		for(var j=0;j<data.result[1].length;j++){
			    			// 最后注意整理好文件位置detail.html
			    			var postHtml='<div><p class="title"><a href="detail.html?id='+data.result[1][j]._id+'">'+data.result[1][j].title+'</a></p></div>';
							$('.searchPost').append(postHtml);
			    		}
			    		for (var i=0;i<data.result[0].length;i++){

			    			var userHtml='<div class="users">'+
											'<a href="#"><img src="http://192.168.20.25:3000/'+data.result[0][i].avatar+'" alt="头像" class="img"></a>'+
											'<div class="information">'+
												'<span class="name"><a href="checkHisInfo.html?id='+data.result[0][i]._id+'">'+data.result[0][i].stuName+'</a></span>'+
												'<div class="star_score">'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 10px;z-index: 10;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 20px;z-index: 9;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 30px;z-index: 8;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 40px;z-index: 7;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 50px;z-index: 6;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 60px;z-index: 5;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 70px;z-index: 4;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 80px;z-index: 3;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 90px;z-index: 2;" ></a>'+
										        	'<a href="javascript:void(0)" style="left:0px;width: 100px;z-index: 1;" ></a>'+
										        '</div>'+
											'</div>'+
										'</div>';
							$('.searchUser').append(userHtml);
							var num=parseFloat(data.result[0][i].finalScore)*2;
							//console.log(num);
						    var newnum=Math.floor(num)-1;
						   // console.log(newnum);
						    if(newnum!=-1){
						    	$('.searchUser').find('.users').eq(i).find('.star_score').find("a").eq(newnum).addClass('clibg');
						    }
			    		}
			    		


			 	    }else alert(data.message);
			    },
			    error:function(data) {
			    	alert("error!");
			    	console.log("errorCode:"+data.statusCode);
					console.log("errorMessage:"+data.message);
			    }
		});

	})
	
});
	