//显示头部
$(function() {
    $('#user-detail').find('.form-group :input').prop('disabled', 'true'); //他人信息默认不可修改
});

//    个人信息
(function($) {
    var userInfoData = {
        phone: "13588888888",
        phone_short: "662311",
        weChat: "cwy211234",
        qq: "130054690",
        self_intro: "我只是个程序员"
    };
    var $userDetailTpl = $('#user-detail-tpl'),
    $userDetailContainer = $('#user-detail');
    $userDetailContainer.prepend($.template($userDetailTpl.html(), userInfoData, {
        variable: "user"
    }));
})(jQuery); 
if(location.search){
	var personId= location.search.split("=")[1];

}else{
	var personId="5796e869672c855428590e0a";//到时传参数进来
}
(function($) {
	
    //总页面的各种接口
    var userId = localStorage['userId'];
    var token = localStorage['token'];
    $("#userDetailLink").click();
    //查看已发布帖子
    $("#user-post-all").click(function() {
        var myPubPosts = {
            userId: personId,
            type: 1,
            status: 0,
            start_num: 0,
            page_size: 100000 //第一页显示100000个帖子，近似等价于显示全部帖子
        };
        $.ajax({
            type: "POST",
            //与后端沟通好用get还是post
            dataType: "json",
            url: "http://192.168.20.25:3000/user/myPubPosts",
            //与后端沟通好发送的地址
            cache: false,
            //忽略缓存
            data: myPubPosts,
            //与后端沟通好名称，那个newDate（）是为了读取最新的数据
            beforeSend: function(request) {
                request.setRequestHeader('xkey', userId);
                request.setRequestHeader('xtoken', token);
            },
            success: function(data) {
                if (data.statusCode == 100) { //与后端沟通好什么符号表示成功
                    var result = data.result;
                    var html = "";

                    $.each(result,
                    function(entryIndex, entry) {
                        //reviewTitle.find($(".media-body a:eq("+entryIndex+")")).html(this.title);//给第entryIndex个<a>里面的内容改标题
                        html += '<article class="post-item media" data-post-type="ensured"><div class="media-left"><a href="#"><img class="media-object" src="assets/img/640.png" alt="..."></a></div><div class="media-body"><h4 class="media-heading"><a href="detail.html?id='+this._id+'"id="reviewTitle">' + this.title + '</a></h4><time>' + this.pubTime.split("T", 1) + '</time></div></article>';
                    });
                    $(".post-container").html(html);
                    //控制分页，每页最多10个标题
                    //获得总共标题数，将其分页,向下取整后（2.2=3）得到总页数
                    var totalPages = Math.ceil(result.length / 10);
                    //设置显示的页数，比如有10个标题，显示5页，有3个标题，显示3页，和总页数是不同的
                    function showPages() {
                        if (totalPages > 5) {
                            return 5
                        } else {
                            return totalPages
                        }
                    };
                    //分页系统事件
                    $(".post-container article").hide();
                    $(".post-container article:lt(10)").show(); //初始状态，等价于先点击第一页
                    $('#post-page').bootstrapPaginator({
                        alignment: "center",
                        currentPage: 1,
                        totalPages: totalPages,
                        numberOfPages: showPages(),
                        bootstrapMajorVersion: 3,
                        onPageChanged: function(event, oldpage, newpage) {
                            var gt = newpage * 10 - 1;
                            var lt = newpage * 10 - 10;
                            $(".post-container article").show();
                            $(".post-container article:gt(" + gt + ")").hide();
                            $(".post-container article:lt(" + lt + ")").hide(); //限定此页数10个标题以外的所有标题隐藏
                        }
                    });
                } else {
                    
                    return false;
                }
            },
            error: function() {
                alert('获取标题失败，请检查网络连接！');
            }
        });
    });
    //	});
    //查看已参与帖子
    $("#user-post-underway").click(function() {
        var myJoinPosts = {
            userId: "578f2a20fad0bf741e71c17d",
            type: 2,
            status: 1,
            start_num: 0,
            page_size: 50
        };
        $.ajax({
            type: "POST",
            //与后端沟通好用get还是post
            dataType: "json",
            url: "http://192.168.20.25:3000/user/myJoinPosts",
            //与后端沟通好发送的地址
            cache: false,
            //忽略缓存
            data: myJoinPosts,
            //与后端沟通好名称，那个newDate（）是为了读取最新的数据
            beforeSend: function(request) {
                request.setRequestHeader('xkey', userId);
                request.setRequestHeader('xtoken', token);
            },
            success: function(data) {
                if (data.statusCode == 100) { //与后端沟通好什么符号表示成功
                    var result = data.result;
                    var html = "";
                    $.each(result,
                    function(entryIndex, entry) {
                        //reviewTitle.find($(".media-body a:eq("+entryIndex+")")).html(this.title);//给第entryIndex个<a>里面的内容改标题
                        html += '<article class="post-item media" data-post-type="ensured"><div class="media-left"><a href="#"><img class="media-object" src="assets/img/640.png" alt="..."></a></div><div class="media-body"><h4 class="media-heading"><a href="detail.html?id='+this._id+'"id="reviewTitle">' + this.title + '</a></h4><time>' + this.pubTime.split("T", 1) + '</time></div></article>';
                    });
                    $(".join-container").html(html);
                    //控制分页，每页最多10个标题
                    //获得总共标题数，将其分页,向下取整后（2.2=3）得到总页数
                    var totalPages = Math.ceil(result.length / 10);
                    //设置显示的页数，比如有10个标题，显示5页，有3个标题，显示3页，和总页数是不同的
                    function showPages() {
                        if (totalPages > 5) {
                            return 5
                        } else {
                            return totalPages
                        }
                    };
                    //分页系统事件
                    $(".join-container article").hide();
                    $(".join-container article:lt(10)").show();
                    $('#join-page').bootstrapPaginator({
                        alignment: "center",
                        currentPage: 1,
                        totalPages: totalPages,
                        numberOfPages: showPages(),
                        bootstrapMajorVersion: 3,
                        onPageChanged: function(event, oldpage, newpage) {
                            var gt = newpage * 10 - 1;
                            var lt = newpage * 10 - 10;
                            $(".join-container article").show();
                            $(".join-container article:gt(" + gt + ")").hide();
                            $(".join-container article:lt(" + lt + ")").hide();
                        }
                    });
                } else {
                   
                    return false;
                }
            },
            error: function() {
                alert('获取标题失败，请检查网络连接！');
            }
        });
    });
    $("#user-post-finished").click(function() {
        //查看已收藏的帖子
        var myFavoPosts = {
            userId: "578f2a20fad0bf741e71c17d",
            type: 2,
            status: 1,
            start_num: 0,
            page_size: 7
        };
        $.ajax({
            type: "POST",
            //与后端沟通好用get还是post
            dataType: "json",
            url: "http://192.168.20.25:3000/user/myFavoPosts",
            //与后端沟通好发送的地址
            cache: false,
            //忽略缓存
            data: myFavoPosts,
            //与后端沟通好名称，那个newDate（）是为了读取最新的数据
            beforeSend: function(request) {
                request.setRequestHeader('xkey', userId);
                request.setRequestHeader('xtoken', token);
            },
            success: function(data) {
                if (data.statusCode == 100) { //与后端沟通好什么符号表示成功
                    var result = data.result;
                    var html = "";
                    $.each(result,
                    function(entryIndex, entry) {
                        //reviewTitle.find($(".media-body a:eq("+entryIndex+")")).html(this.title);//给第entryIndex个<a>里面的内容改标题
                        html += '<article class="post-item media" data-post-type="ensured"><div class="media-left"><a href="#"><img class="media-object" src="assets/img/640.png" alt="..."></a></div><div class="media-body"><h4 class="media-heading"><a href="detail.html?id='+this._id+'id="reviewTitle">' + this.title + '</a></h4><time>' + this.pubTime.split("T", 1) + '</time></div></article>';
                    });
                    $(".collect-container").html(html);
                    //控制分页，每页最多10个标题
                    //获得总共标题数，将其分页,向下取整后（2.2=3）得到总页数
                    var totalPages = Math.ceil(result.length / 10);
                    //设置显示的页数，比如有10个标题，显示5页，有3个标题，显示3页，和总页数是不同的
                    function showPages() {
                        if (totalPages > 5) {
                            return 5
                        } else {
                            return totalPages
                        }
                    };
                    //分页系统事件
                    $(".collect-container article").hide();
                    $(".collect-container article:lt(10)").show();
                    $('#collect-page').bootstrapPaginator({
                        alignment: "center",
                        currentPage: 1,
                        totalPages: totalPages,
                        numberOfPages: showPages(),
                        bootstrapMajorVersion: 3,
                        onPageChanged: function(event, oldpage, newpage) {
                            var gt = newpage * 10 - 1;
                            var lt = newpage * 10 - 10;
                            $(".collect-container article").show();
                            $(".collect-container article:gt(" + gt + ")").hide();
                            $(".collect-container article:lt(" + lt + ")").hide();
                        }
                    });
                } else {
                    
                    return false;
                }
            },
            error: function() {
                alert('获取标题失败，请检查网络连接！');
            }
        });
    });
    //接口：查看他人信息
    var param = {
        userId: personId,
    };
    $.ajax({
        type: "POST",
        //与后端沟通好用get还是post
        dataType: "json",
        url: "http://192.168.20.25:3000/user/getInfo",
        //与后端沟通好发送的地址
        cache: false,
        //忽略缓存	
        data: param,
        //与后端沟通好名称，那个newDate（）是为了读取最新的数据
        beforeSend: function(request) {
            request.setRequestHeader('xkey', userId);
            request.setRequestHeader('xtoken', token);
        },
        success: function(data) {
            if (data.statusCode == 100) { //与后端沟通好什么符号表示成功
                //显示头部信息
                /*动态插入img的方法
					var	html = "<img src = 'http://192.168.20.25:3000"+data.result.userInfo.avatar+"' / >";	
					$("#user-avatar").html(html);
					*/
                $("#user-avatar img").attr("src", "http://192.168.20.25:3000" + data.result.userInfo.avatar);
                $("#stuName").html(data.result.userInfo.stuName);
                $(".user-time-num").html(data.result.userInfo.coin);
                //$("#star").css("width","50%");
                var aveScore = data.result.userInfo.aveScore;
                var starNum = aveScore / 5 * 100; //得到星星长度的百分比
                $("#star").css("width", starNum + '%'); //设置星星的width来显示星星的数量
                //reviewTitle.find($(".media-body a:eq("+entryIndex+")")).html(this.title);//给第entryIndex个<a>里面的内容改标题

                //显示他人资料
                var wechat = $("#user-detail").find(".form-group :input:eq(0)");
                var qq = $("#user-detail").find(".form-group :input:eq(1)");
                var skills = $("#user-detail").find(".form-group :input:eq(2)");
                wechat.val(data.result.userInfo.weChat);
                qq.val(data.result.userInfo.qq);
                skills.val(data.result.userInfo.skills);

            } else {
                
                return false;
            }
        },
        error: function() {
            alert('查看失败，请检查网络连接！');
        }
    });
    //右侧导航栏的显示
    $("li#build").show();
    $("li#join").hide();
    $("li#collect").hide();
    $("#user-post-all").click(function() {
        $("li#build").show();
        $("li#join").hide();
        $("li#collect").hide();

    });
    $("#user-post-underway").click(function() {
        $("li#join").show();
        $("li#build").hide();
        $("li#collect").hide();

    });
    $("#user-post-finished").click(function() {
        $("li#collect").show();
        $("li#build").hide();
        $("li#join").hide();

    });

})(jQuery);