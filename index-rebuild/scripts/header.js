var searchBtn = $('.search-btn');
var username=$('.user-name');
var chatIcon=$('.chat-icon');
var moneyNums=$('.money-nums');
var chatNums=$('.chat-nums');
var logout=$('.logout');
var userId = localStorage['userId'];
var token = localStorage['token'];
$(function () {
    $(".user-name").click(function () {
        $(".dropdown-menu").toggle(500);//点击用户名实现下拉上滑切换
    });
});
(function() {
        $('.chat').click(function() {
            //alert('a')
            window.localStorage.indexToUser = 0 ;
        });
        $('.user-detail').click(function() {
            //alert('a')
            window.localStorage.indexToUser = 1 ;
        });
    })();
$(document).ready(function(){
$.ajax({
        type: "POST", 
        dataType: "json",
        url: "http://192.168.20.25:3000/user/getMsg", 
        cache: false,
        data:{userId:localStorage['userId']},
        beforeSend:function(xhr) {
            xhr.setRequestHeader('xkey', userId);
            xhr.setRequestHeader('xtoken', token);
        },
        success: function(data) {
            if (data.statusCode == 100) { 
                //未读消息

                var unReadNum=data.result.unReadNum;
                chatNums.text(unReadNum);

            } else {
                alert("获取失败！");
                return false;
            }
        },
        error: function(data) {
            alert('获取失败：请检查网络连接！');
        }
    });

    $.ajax({
        type: "POST", 
        dataType: "json",
        url: "http://192.168.20.25:3000/user/getMyInfo", 
        cache: false,
        data:{userId:localStorage['userId']},
        beforeSend:function(xhr) {
            xhr.setRequestHeader('xkey', userId);
            xhr.setRequestHeader('xtoken', token);
        },
        success: function(data) {
            if (data.statusCode == 100) { 
                console.log(data)
                //金币
                var coin=data.result.userInfo.coin;
                //用户名
                var stuName=data.result.userInfo.stuName;
                var checkdate = data.result.userInfo.check.lastDate;
                // var today = new Date();
                // myDate.setFullYear(2008,8,9);
                // if (myDate>today)
                // {
                //     alert("Today is before 9th August 2008");
                // }
                // else
                // {
                //     alert("Today is after 9th August 2008");
                // }

               moneyNums.text(coin);
               username.text(stuName);
            } else {
                alert("获取失败！");
                return false;
            }
        },
        error: function(data) {
            alert('获取失败：请检查网络连接！');
        }
    });


    searchBtn.click(function() {
        $.ajax({
            type: "POST", 
            dataType: "json",
            url: "http://192.168.20.25:3000/user/checkin", 
            cache: false,
            data:{userId:localStorage['userId']},
            beforeSend:function(xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            success: function(data) {
                if (data.statusCode == 100) { //与后端沟通好什么符号表示成功

                   searchBtn.find('a').html("已签到");
                   searchBtn.find('a').css('text-decoration','none');
                   searchBtn.unbind('click');
                   $.ajax({
                        type: "POST", 
                        dataType: "json",
                        url: "http://192.168.20.25:3000/user/getMyInfo", 
                        cache: false,
                        data:{userId:localStorage['userId']},
                        beforeSend:function(xhr) {
                            xhr.setRequestHeader('xkey', userId);
                            xhr.setRequestHeader('xtoken', token);
                        },
                        success: function(data) {
                            if (data.statusCode == 100) { 
                                //金币
                               var coin=data.result.userInfo.coin;
                               //签到获取金币
                               moneyNums.text(coin);
                            } else {
                                alert("获取失败！");
                                return false;
                            }
                        },
                        error: function(data) {
                            alert('获取失败：请检查网络连接！');
                        }
                    });
                } else {
                    alert("今天已签到！");
                    searchBtn.find('a').html("已签到");
                    return false;
                }
            },
            error: function(data) {
                alert('签到失败：请检查网络连接！');
            }
        });

        
    });

    logout.click(function(){
        $.ajax({
            type: "POST", 
            dataType: "json",
            url: "http://192.168.20.25:3000/user/logout", 
            cache: false,
            data:{userId:localStorage['userId']},
            beforeSend:function(xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            success: function(data) {
                if (data.statusCode == 100) { 
                   window.location="indexNotLogin.html";
                } else {
                    alert("退出失败！");
                    return false;
                }
            },
            error: function(data) {
                alert('退出登录失败：请检查网络连接！');
            }
        });
    });
    $(function () {
        $(".user-name").click(function () {
            $(".dropdown-menu").slideToggle();//点击用户名实现下拉上滑切换

        });
    });

})
    
