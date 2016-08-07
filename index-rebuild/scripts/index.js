$(document).ready(function() {
    //对我要求助我要帮忙的处理
    $("#side-list").lavaLamp({
	    });
    $("#main-card").lavaLamp({
    });
    (function() {
        $('.finish-card').click(function() {
        	//alert('a')
            window.localStorage.indexToUser = 2 ;
        });
        $('.star-card').click(function() {
        	//alert('a')
            window.localStorage.indexToUser = 4 ;
        });
        $('.consisting-card').click(function() {
        	//alert('a')
            window.localStorage.indexToUser = 3 ;
        });
    })();
    var imgOrigin = "http://192.168.20.25:3000";
    (function () {
		var postType = 1;
		var nopostType = 0;
		$('.main-wrap .nav>li>a').each(function(index) {
			$(this).click(function() {
				$('.main-wrap .nav>li>a').removeClass('active');
				$('.main-wrap .nav>li>a').eq(index).addClass('active');
				nopostType = index;
				if (nopostType == 0) {
					$("input[name='missionCoin']").attr('placeholder','悬赏时间币');
					postType = 1;
				} else {
					$("input[name='missionCoin']").attr('placeholder','支付时间币');
					postType = 0;
				}
			});
		});
		//图片的处理
		var upfiles = [];
		$(function(){
			var picture = $('#picture');
			picture.click(function(){
				$("#demo").toggle(500);
			});
			$("#demo").zyUpload({
				width            :   "415px",                 // 宽度
				height           :   "400px",                 // 宽度
				itemWidth        :   "120px",                 // 文件项的宽度
				itemHeight       :   "100px",                 // 文件项的高度
				// 外部获得的回调接口
				onSelect: function(files, allFiles){             // 选择文件的回调方法
					upfiles = allFiles;
				},
				onDelete: function(file, surplusFiles){         // 删除一个文件的回调方法
				}
			});
		});
		//控制层插件 
		(function($,undefined){
			$.fn.zyUpload = function(options,param){
				return this.each(function(){
					var para = {};    
					var self = this; 			
					var defaults = {
						width            : "700px",  					
						height           : "400px",  					
						itemWidth        : "100px",                     
						itemHeight       : "120px",                
						onSelect         : function(selectFiles, files){},//
						onDelete		 : function(file, files){},     
					};				
					para = $.extend(defaults,options);				
					this.init = function(){
						this.createHtml();  
						this.createCorePlug();  

					};
					var addHtml = '<div class="add_upload"><a style="height:'+para.itemHeight+';width:'+para.itemWidth+';" title="点击添加文件" id="rapidAddImg" class="add_imgBox" href="javascript:void(0)"><div class="uploadImg"><img class="upload_image" src="assets/img/add_img.png"/></div></a></div>';
					//功能：创建上传所使用的html
					this.createHtml = function(){
						var html = '';					
						html += '<div class="upload_box">';
						html += '	<div class="upload_main single_main">';
			            html += '		<div class="status_bar">';
			            html += '			<div id="status_info" class="info">选中0个文件。</div>';
			            html += '				<div class="btns">';
			            html += '					<input id="fileImage" type="file" size="30" name="postPics">';
			            html += '				</div>';
			            html += '			</div>';
			            html += '			<div id="preview" class="upload_preview">';
			            html += '				<div class="upload_middle">';
						html += '				</div>';
			            html += addHtml;
						html += '			</div>';
						html += '		</div>';
						html += '	</div>';
						html += '</div>';
						
			            $(self).append(html).css({"width":para.width,"height":para.height});
			            this.addEvent();
					};				
					this.funSetStatusInfo = function(files){
						var size = 0;
						var num = files.length;
						$.each(files, function(k,v){
							size += v.size;
						});									
						$("#status_info").html("选中" + num + "个文件，还剩" + (9-num) + "个可选。");
						console.log(files)
					};				
					//功能：过滤上传的文件格式等
					this.funFilterEligibleFile = function(files){
						var arrFiles = [];  // 替换的文件数组
						for (var i = 0, file; file = files[i]; i++) {
							if (file.size >= 1024 * 1024 * 2) {
								alert('您这个"'+ file.name +'"文件大小过大');	
							} else {
								arrFiles.push(file);	
							}
						}
						return arrFiles;
					};				
					//功能： 处理参数和格式上的预览html
					this.funDisposePreviewHtml = function(file, e){
						var html = "";			
						var delHtml = "";
						delHtml = '<span class="file_del" data-index="'+file.index+'" title="删除"></span>';
						if (file.type.indexOf("image") == 0) {
							html += '<div id="uploadList_'+ file.index +'" class="upload_append_list fl">';
							html += '	<div class="file_bar">';
							html += '		<div style="padding:5px;">';
							html += delHtml;  
							html += '		</div>';
							html += '	</div>';
							html += '	<a style="height:'+para.itemHeight+';width:'+para.itemWidth+';" href="#" class="imgBox">';
							html += '		<div class="uploadImg">';				
							html += '			<img id="uploadImage_'+file.index+'" class="upload_image" src="' + e.target.result + '"/>';                                                                 
							html += '		</div>';
							html += '	</a>';
							html += '	<p id="uploadProgress_'+file.index+'" class="file_progress"></p>';
							html += '	<p id="uploadFailure_'+file.index+'" class="file_failure">上传失败，请重试</p>';
							html += '	<p id="uploadSuccess_'+file.index+'" class="file_success"></p>';
							html += '</div>';                	
						}else{
							alert('请上传PNG，JPG或GIF格式的图片');
						}					
						return html;
					};				
					this.createCorePlug = function(){
						var params = {
							fileInput: $("#fileImage").get(0),
							filterFile: function(files) {
								return self.funFilterEligibleFile(files);
							},
							onSelect: function(selectFiles, allFiles) {
								para.onSelect(selectFiles, allFiles);
								self.funSetStatusInfo(ZYFILE.funReturnNeedFiles());  
								var html = '', i = 0;
								var flag = 0
								// 组织预览html
								var funDealtPreviewHtml = function() {
									file = selectFiles[i];
									if (file) {
										var reader = new FileReader();
										reader.onload = function(e) {
											html += self.funDisposePreviewHtml(file, e);								
											i++;
											var num = allFiles.length;
											if (num > 8) {
												flag = 1;
												funDealtPreviewHtml();
												$(".add_upload").remove();	
											} else {
												funDealtPreviewHtml();
											}
										}
										reader.readAsDataURL(file);
									} else {
										funAppendPreviewHtml(html);
									}
								};							
								var funAppendPreviewHtml = function(html){
									$(".upload_middle").before(html);
									funBindDelEvent();
									funBindHoverEvent();
								};
								var funBindDelEvent = function(){
									if($(".file_del").length>0){
										$(".file_del").click(function() {
											if (flag == 1) {
												$(".upload_middle").after(addHtml);
												flag = 0;
												$("#rapidAddImg").bind("click", function(e){
													$("#fileImage").click();
									            });
											}
											ZYFILE.funDeleteFile(parseInt($(this).attr("data-index")), true);
											return false;	
										});
									}		
								};						
								// 绑定显示操作栏事件
								var funBindHoverEvent = function(){
									$(".upload_append_list").hover(
										function (e) {
											$(this).find(".file_bar").addClass("file_hover");
										},function (e) {
											$(this).find(".file_bar").removeClass("file_hover");
										}
									);
								};							
								funDealtPreviewHtml();		
							},
							onDelete: function(file, files) {
								$("#uploadList_" + file.index).fadeOut();
								self.funSetStatusInfo(files);
							},
						};					
						ZYFILE = $.extend(ZYFILE, params);
						ZYFILE.init();					
					};			
					this.addEvent = function(){			
						if($("#rapidAddImg").length > 0){
							$("#rapidAddImg").bind("click", function(e){
								$("#fileImage").click();
				            });
						}
					};		
					this.init();

				});
			};
		})(jQuery);
		//核心层插件
		var ZYFILE = {
			fileInput : null,    
			uploadFile : [],  			 
			lastUploadFile : [],          
			perUploadFile : [],          
			fileNum : 0,                 
			filterFile : function(files){ 
				return files;
			},
			onSelect : function(selectFile, files){      
			},
			onDelete : function(file, files){       
			},
			// 获取文件
			funGetFiles : function(e){  
				var self = this;
				var files = e.target.files || e.dataTransfer.files;
				self.lastUploadFile = this.uploadFile;
				this.uploadFile = this.uploadFile.concat(this.filterFile(files));
				var tmpFiles = [];			
				var lArr = [];  
				var uArr = []; 
				$.each(self.lastUploadFile, function(k, v){
					lArr.push(v.name);
				});
				$.each(self.uploadFile, function(k, v){
					uArr.push(v.name);
				});			
				$.each(uArr, function(k, v){
					if($.inArray(v, lArr) < 0){  
						tmpFiles.push(self.uploadFile[k]);
					}
				});		
				this.uploadFile = tmpFiles;		
				this.funDealtFiles();			
				return true;
			},
			funDealtFiles : function(){
				var self = this;
				$.each(this.uploadFile, function(k, v){
					v.index = self.fileNum;
					self.fileNum++;
				});
				var selectFile = this.uploadFile;  
				this.perUploadFile = this.perUploadFile.concat(this.uploadFile);
				this.uploadFile = this.lastUploadFile.concat(this.uploadFile);	
				this.onSelect(selectFile, this.uploadFile);
				return this;
			},
			funDeleteFile : function(delFileIndex, isCb){
				var self = this;  
				var tmpFile = [];  
				var delFile = this.perUploadFile[delFileIndex];
				$.each(this.uploadFile, function(k, v){
					if(delFile != v){
						tmpFile.push(v);
					}else{
						
					}
				});
				this.uploadFile = tmpFile;
				if(isCb){ 
					self.onDelete(delFile, this.uploadFile);
				}	
				return true;
			},
			funReturnNeedFiles : function(){
				return upfiles;
			},
			init : function(){  
				var self = this;
				if(self.fileInput){
					this.fileInput.addEventListener("change", function(e) {
						self.funGetFiles(e); 
					}, false);	
				}
			}
		};
	    $('#publish').click(function(e) {
	    	var userId = localStorage['userId'];
   			var token = localStorage['token'];
			var title = $("input[name='title']").val();
			var content = $("textarea[name='content']").val();
			var pubsel = $("#expTime").find("option:selected").val(); 
			var contact = $("input[name='contact']").val();
			var missionCoin = $("input[name='missionCoin']").val();
			//处理日期
			if(!title || !content || !contact || !missionCoin || pubsel == 0) {
				alert("请将帖子填写完整！");
		    	return;
			}
			//$('#publish').prop('disabled',true);
			var expTime = pubsel * 24 * 60 * 60 *1000;
			//alert (expTime);
			//帖子内容的上传
			var formdata = new FormData(); 
			formdata.append("userId", userId);	
			formdata.append("postType", postType);
			formdata.append("title", title);
			formdata.append("content", content);
			formdata.append("expTime", expTime);
			formdata.append("contact", contact);
			formdata.append("missionCoin", missionCoin);
			console.log(formdata)
			if (upfiles.length != 0) { 
			 	for (var i = 0; i <  upfiles.length; i++) {
			 		formdata.append('postPics',  upfiles[i]);
			 	}
			}
			 console.info("方法");
			 	console.info(upfiles);	

			var url = 'post/publish';
			//alert('a');
			sendformdataRequest(url, formdata, function beforeSend(xhr) {
				xhr.setRequestHeader('xkey', userId);
				xhr.setRequestHeader('xtoken', token);
			}, function success(data){
				$('#register').prop('disabled',false);
				if(data.statusCode == 100){
					alert("发布成功");
					$("input[name='title']").val('');
					$("textarea[name='content']").val('');
					$("#expTime").val('0'); 
					$("input[name='contact']").val('');
					$("input[name='missionCoin']").val('');
					// if (upfiles.length != 0) { 
					//  	for (var i = 0; i <  upfiles.length; i++) {
					//  		$("#uploadList_" + i).fadeOut();
					//  	}
					// }
					upfiles = [];
					$(".file_del").click();
					// (function() {
					// 	var num = upfiles.length;							
					// 	$("#status_info").html("选中" + num + "个文件，还剩" + (9-num) + "个可选。");
					// })();		
				}
				else if(data.statusCode == -5001) {
						alert('你的时间币余额不足');
				}
				else {
					alert("登录已过期，请重新登录");
				}
				return false;
			}, function error(){
				alert('error');
			});
			console.info("方法");
			console.info(upfiles);	

			return false;
		});
	})();

    //表情的处理
    $(function() {
        $('.emotion').qqFace({
            id: 'facebox',
            //表情盒子的ID
            assign: 'content',
            //给那个控件赋值
            path: 'assets/img/face/' //表情存放的路径
        });
    });
    // 自动播放的焦点图
    (function() {
        var oDiv = $('#fade');
        var aUlLi = oDiv.find('ul li');
        var aOlLi = oDiv.find('ol li');
        var iNow = 0;
        var timer = null;
        fnFade();
        aOlLi.hover(function() {
            iNow = $(this).index();
            fnFade();
        });
        oDiv.hover(function() {
            clearInterval(timer);
        },
        autoPlay);
        function autoPlay() {
            timer = setInterval(function() {
                iNow++;
                iNow %= 3;
                fnFade();
            },
            2000);
        }
        autoPlay();

        function fnFade() {
            aUlLi.each(function(i) {
                if (i != iNow) {
                    aUlLi.eq(i).fadeOut().css('zIndex', 1);
                    aOlLi.eq(i).removeClass('active');
                    aOlLi.eq(i).addClass('unactive');
                } else {
                    aUlLi.eq(i).fadeIn().css('zIndex', 2);
                    aOlLi.eq(i).removeClass('unactive');
                    aOlLi.eq(i).addClass('active');
                }
            });
        }
    })();
    
    //切换红人榜，富豪榜的操作
    (function() {
        var sidList = $('#side-list');
        var sidListLi = $('#side-list li');
        var sidListD = $('#side-list div');
        var redPerson = $('#red-person');
        var richPerson = $('#rich-person');
        var persons = $('.persons');
        var redPersons = $('#red-persons');
        var richPersons = $('#rich-persons');
        list('scores', redPersons );  
        list('coin', richPersons );  
	    function list(rankBy, person) {
            var personData = {
                start_num: 0,
                page_size: 5,
                rankBy: rankBy
            }
            sendRequest('user/rank', personData,
            function beforeSend(xhr) {},
            function success(data) {
                if (data.statusCode == 100) {
                    var redPersonHtml = '';
                    var result = data.result;
                    $.each(result,function(index, result) {
                        console.log(result);
                        redPersonHtml += '<li>';
                        redPersonHtml += '	<a class="s-avatar" href="checkHisInfo.html?id='+this._id+'">';
                        redPersonHtml += '		<img src="' + imgOrigin + this.avatar + '">';
                        redPersonHtml += '		<div  class="message">';
                        redPersonHtml += '			<div class="name">' + this.stuName + '</div>';
                        redPersonHtml += '			<div class="money">' + this.coin + '时间币</div>';
                        redPersonHtml += '		</div>';
                        redPersonHtml += '	</a>';
                        redPersonHtml += '</li>';
                    }),
                    person.prepend(redPersonHtml);
                }
            },
            function error() {
                alert('error');
            });
			//改变样式
			// persons.hide().eq(0).show();
			// sidListLi.each(function(index) {
			// 	$(this).click(function() {
			// 		$(this).addClass('lactive').siblings().removeClass('lactive');
			// 		persons.hide().eq(index).show();
			// 	});
			// 	$(this).hover(function() {
			// 		$(this).addClass('chover').siblings().removeClass('chover');
			// 	});
			// });*/
		}
	})();
    //点击刷新的操作
    (function() {
        var renovate = $('#renovate');
        renovate.click(function() {
            //alert('a');
            //changeS1(0);
        });
    })();
    //个人信息的获取
    (function() {
    	var userId = localStorage['userId'];
   		var token = localStorage['token'];
        var userData = {
            userId: userId
        }
        var url = 'user/getMyInfo';
        sendRequest(url, userData,
        function beforeSend(xhr) {
				xhr.setRequestHeader('xkey', userId);
				xhr.setRequestHeader('xtoken', localStorage['token']);
		},
        function success(data) {
            if (data.statusCode == 100) {
                console.log(data);
                var userInfo = data.result.userInfo;
                $("#p-avatar").attr("src",imgOrigin + userInfo.avatar);
                $('#joinCount').html(userInfo.joinCount);
                $('#favorCount').html(userInfo.favorCount);
                $('#pubCount').html(userInfo.pubCount);
            }
        },
        function error() {
            alert('error');
        });
    })();
    //分页的效果和获取
    //回到顶部
    $(function() {
        $("#updown").css("top", window.screen.availHeight / 2 - 100 + "px");
        $(window).scroll(function() {
            if ($(window).scrollTop() >= 100) {
                $('#updown').fadeIn(300);
            } else {
                $('#updown').fadeOut(300);
            }
        });
        $('#updown .up').click(function() {
            $('html,body').animate({
                scrollTop: '0px'
            },
            800);
        });
    });
    // $('#side-list').find('a').each(function(i) {
    //     this.click((function() {
            
    // 	});

});