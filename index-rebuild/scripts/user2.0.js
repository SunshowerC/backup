/**
 * Created by ChenWeiYu
 * Date : 2016/8/6
 * Time : 21:22
 */


(function ($) {
    
    var userId = localStorage.getItem('userId'),
        token = localStorage.getItem('token');

    var postModule = {

        init: function () {
            //初始设定
            this.setAjaxSetting();
            this.bindEvent();

            //获取基本信息
            $(document).trigger("getMyInfo");
            //获取帖子
            $('#user-post-all').trigger('click');
            //新建导航条
            $(document).trigger("postPagination");


        },

        setAjaxSetting: function () {
            var setting = {
                type: "POST",
                dataType: "json",
                cache: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('xkey', userId);
                    xhr.setRequestHeader('xtoken', token);
                }
            };

            $.ajaxSetup(setting);
        },


        //发送ajax请求
        getData: function (opt) {
            return $.ajax({
                url: $.originUrl + opt.url,
                data: opt.data
            });
        },

        //渲染帖子
        createPostDom: function (tplId, resData, variable) {
            return $.template($(tplId).html(), resData, {variable: variable});
        },


        render: {
             
            myInfo: function (data) {
                $('.user-info').html(postModule.createPostDom("#user-info-tpl", data.result.userInfo, "user"));
                $('#user-detail').prepend(postModule.createPostDom('#user-detail-tpl', data.result.userInfo, "user"));
            },
            checkMyPost: function (data) {

                $('.post-container').html(postModule.createPostDom("#post-tpl", data.result, "posts"));
            },
            getParticipant: function (data) {
                // console.log(data);
                if (data.statusCode == 100) {
                    $('#ensure-mission').find('.panel-body').html(
                        postModule.createPostDom("#ensure-mission-tpl", data.result.participant, "participants")
                    )
                }
            }

        },


        // 交互事件
        bindEvent: function () {
            var that = this;
            var postId;

            var $nav = $('.user-post-nav,.user-panel-nav');

            var $tabWrap = $('#tab-wrap');
            var $ensurePanel = $('#ensure-mission');
            var $missionAvatar = $ensurePanel.find('figure');

            var postGroup = ["/user/myPubPosts", "/user/myJoinPosts", "/user/myFavoPosts"];
            var postGroupIndex = 0, postStatus = 0, totalPostsNum = 1, postsPerPage = 3;


            /********基本交互事件*********/

            //不可修改个人信息
            $(document).on("disableModify", function () {
                var $usrInfo = $('#user-detail').find('.form-group :input');
                $usrInfo.prop('disabled', 'true');

            })


            //清除不同导航栏的active样式
            $nav.on('click', 'a', function () {
                if (!$(this).hasClass('active')) {
                    $nav.children('li').removeClass('active');
                }
            });

            //点击修改使个人信息可修改
            $('#btn-modify').on('click', function () {
                var $userInfo = $('#user-detail').find('.form-group :input');
                $userInfo.removeAttr('disabled');
            });

            //点击《确定任务人》，弹出确定任务人面板
            $tabWrap.on('click', 'a', function () {
                if ($(this).is('.btn-sure')) {
                    $ensurePanel.slideDown();
                }
            });

            // 确定任务人面板上，点击确定/取消
            $ensurePanel.on('click', 'figure,a,button', function () {
                if ($(this).is('figure')) {
                    $missionAvatar.removeClass('active');
                    $(this).toggleClass('active');
                }

                if ($(this).data('triggle') === 'dismiss') {
                    $ensurePanel.slideUp();

                }
            });


            /*********ajax请求事件**********/
            //获取个人信息
            $(document).on("getMyInfo", function () {
                var getMyInfo = that.getData({
                    url: "/user/getMyInfo",
                    data: {userId: userId}
                });
                getMyInfo.done(that.render.myInfo);
                getMyInfo.always(function (data) {
                    console.log("获取个人信息",data)
                    $(document).trigger("disableModify");
                });
            });

            //修改个人信息 
            $('#info-submit').on('click', function () {
                var changeInfo = that.getData({
                    url: "/user/update",
                    data: $('#user-detail').serialize() + "&userId=" + userId
                });

                changeInfo.done(function (data) {
                    console.log("修改个人信息",data);
                    $(document).trigger("disableModify");
                    alert("修改个人信息成功")
                });
            });

            //    查看我的帖子
            $('#user-post-menu,#user-post-nav').on('click', 'a', function () {
                //左侧组别
                if ($(this).data("post-group") >= 0) {
                    postGroupIndex = $(this).data("post-group");
                }

                //头部组别
                if ($(this).data("post-status") >= 0) {
                    postStatus = $(this).data("post-status");
                    $('#user-post').find('li').not('#post-page>li').removeClass('active');
                    $(this).parent('li').addClass('active');
                }




                var checkMyPost = that.getData({
                    url: postGroup[postGroupIndex],
                    data: {
                        userId: userId,
                        type: 2,  //所有帖子
                        status: postStatus,  //进行中的帖子
                        start_num: 0,
                        page_size: postsPerPage
                    }
                });

                //成功获取数据
                checkMyPost.done(function (data) {
                    if (data.statusCode == 100) {
                        totalPostsNum = data.result_count;

                        data.result.map(function (item) {   //为获取到的帖子列表添加上postGroup属性
                            return item.postGroup = postGroupIndex;
                        });

                        that.render.checkMyPost(data);
                    } else {
                        // console.log(data.message);
                        $('.post-container').html("您在该版块下暂时没有帖子");
                    }
                }).always(function (data) {
                    console.log("帖子主体",data)
                    //设置分页默认值为第一页,重新计算页数
                    $('#post-page').bootstrapPaginator("showFirst");
                    $('#post-page').bootstrapPaginator("setOptions", {
                        totalPages: Math.ceil(totalPostsNum / postsPerPage)
                    });
                });


            });


            //    分页系统
            $(document).on("postPagination", function () {
        
                $('#post-page').bootstrapPaginator({
                    alignment: "center",
                    currentPage: 1,
                    totalPages: totalPostsNum / postsPerPage + 1, //总页数
                    numberOfPages: 5,  // 可视页数
                    bootstrapMajorVersion: 3,
                    onPageChanged: function (event, oldpage, newpage) {
                        // console.log(event,oldpage,newpage);
                        //查看我的帖子

                        var checkMyPost = that.getData({
                            url:postGroup[postGroupIndex],
                            data: {
                                userId: userId,
                                type: 2,  //所有帖子
                                status: postStatus,  //进行中的帖子
                                start_num: (newpage - 1) * postsPerPage,
                                page_size: postsPerPage  //每页帖子个数
                            }
                        });

                        checkMyPost.done(function (data) {
                            console.log("帖子主体",data);
                            if (data.statusCode == 100) {
                                data.result.map(function (item) {
                                    return item.postGroup = postGroupIndex;
                                });

                                that.render.checkMyPost(data);
                            } else {
                                console.log(data.message);
                                $('.post-container').empty();
                            }
                        })

                    }
                });
            });


            //帖子状态操作
            $('.post-container').on('click', 'a', function () {
                postId = $(this).closest('.post-item').data('post-id');
                var $This = $(this);


                //取消任务
                if ($(this).hasClass('btn-cancel') || $(this).hasClass('cancel')) {
                    var cancelMission = $.ajax({
                        url: $.originUrl + "/post/cancel",
                        data: {
                            userId: userId,
                            postId: postId
                        },
                        beforeSend: function (xhr) {
                             if (!confirm("确定取消任务？")) {
                                 return false;
                             }
                            xhr.setRequestHeader('xkey', userId);
                            xhr.setRequestHeader('xtoken', token);
                        }
                    });

                    cancelMission.done(function (data) {
                        if (data.statusCode == 100) {
                            alert("取消任务成功");

                            $This.closest('.post-item').slideUp();
                        }
                        console.log("取消任务",data)
                    });
                }


                //完成任务
                if ($(this).hasClass('btn-complete')) {
                    var completeMission = $.ajax({
                        url: $.originUrl + "/post/confirm",
                        data: {
                            userId: userId,
                            postId: postId
                        },
                        beforeSend: function (xhr) {
                            if ( !confirm("确定任务已完成？") ) {
                                return false;
                            }
                            xhr.setRequestHeader('xkey', userId);
                            xhr.setRequestHeader('xtoken', token);

                        }
                    });

                    completeMission.done(function (data) {
                        console.log("完成任务",data)

                        alert("已确定完成任务")
                    });
                }


                //评分
                if ($(this).hasClass('btn-judge')) {
                    $('#access-submit').on('click', function () {
                        var access = that.getData({
                            url: '/user/grade',
                            data: {
                                userId: userId,
                                target: $This.data('parti-id'),
                                postId: $This.parents('.post-item').data('post-id'),
                                score: $('#judge-him').text()
                            }
                        });

                        access.done(function (data) {
                            console.log("评价",data)
                            alert('评价成功');
                        })
                    });
                }


                //    弹出确定任务人后，获取任务候选人数据
                if ($(this).hasClass('btn-sure')) {
                    var getParticipant = that.getData({
                        url: "/post/getPost",
                        data: {
                            userId: userId,
                            postId: postId
                        }
                    });

                    getParticipant.done(that.render.getParticipant).always(function (data) {
                        console.log("任务候选人",data)
                    });
                }
            });

            //点击确定任务人后,进一步确定具体人选
            $('#btn-ensure-participant').on('click', function () {
                //$('#ensure-mission').find('figure.active').data('user-id');
                console.log(postId)
                console.log($('#ensure-mission').find('figure.active').data('user-id'))
                var ensureParticipant = that.getData({
                    url: "/post/assign",
                    data: {
                        userId: userId,
                        postId: postId,
                        participantId: $('#ensure-mission').find('figure.active').data('user-id')
                    }

                });

                ensureParticipant.done(function (data) {
                    console.log("确定任务人",data)

                    alert("已确定任务人");
                    $ensurePanel.slideUp();
                })
            });


        }

    };
    
    
    
    

    postModule.init();



})(jQuery);




//通知-我的消息
(function ($) {

    $('#user-collect').click(function() {
        var userData = {
            userId: localStorage['userId']
        }
        var newMessageHtml = '';
        var oldMessageHtml = '';
        sendRequest('user/getMsg', userData,
            function beforeSend(xhr) {
                xhr.setRequestHeader('xkey', localStorage['userId']);
                xhr.setRequestHeader('xtoken', localStorage['token']);
            },
            function success(data) {
                console.log(data)
                if (data.statusCode == 100) {
                    var rankHtml = '';
                    var msglist = data.result.msgList;
                    $.each(msglist,function(index, msglist) {
                        if (this.read == 0) {
                            newMessageHtml += messageHtml(this.content.postTitle, this._id, this.content.postId, this.content.userId, this.content.userStuName, this.messageType);
                        } else {
                            oldMessageHtml += messageHtml(this.content.postTitle, this._id, this.content.postId, this.content.userId, this.content.userStuName, this.messageType);
                        }
                    });
                    $('.new-message').prepend(newMessageHtml);
                    $('.old-message').prepend(oldMessageHtml);
                    function messageHtml(title, id, postId, userId, userStuName, type) {
                        var messageHtml='';
                        switch (type) {
                            case '0':
                                messageHtml = '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"><div class="system-message"><a href="href="checkHisInfo.html?id='+userId+'>' + userStuName + '</a>评论了你的帖子<a href="detail.html?id=' + postId + '">' + title + '</a></div></div>';
                                return(messageHtml);
                                break;
                            case '1':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你在帖子<a href="detail.html?id=' + postId + '">' + title + '</a>里报名成功。</div></div>';
                                return(messageHtml);
                                break;
                            case '2':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你已报名帖子<a href="detail.html?id=' + postId + '">' + title + '</a>。</div></div>';
                                return(messageHtml);
                                break;
                            case '3':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的帖子<a href="detail.html?id=' + postId + '">' + title + '</a>被报名。</div></div>';
                                return(messageHtml);
                                break;
                            case '4':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">帖子<a href="detail.html?id=' + postId + '">' + title + '</a>对方已转时间币。</div></div>';
                                return(messageHtml);
                                break;
                            case '5':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的帖子<a href="detail.html?id=' + postId + '">' + title + '</a>对方已评分，请尽快完成交易。</div></div>';
                                return(messageHtml);
                                break;
                            case '6':
                                return(messageHtml);
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的帖子<a href="detail.html?id=' + postId + '">' + title + '</a>被举报了</div></div>';
                                break;
                            case '7':
                                return(messageHtml);
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的帖子<a href="detail.html?id=' + postId + '">' + title + '</a>被锁定了。</div></div>';
                                break;
                            case '8':
                                return(messageHtml);
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的帖子<a href="detail.html?id=' + postId + '">' + title + '</a>被解锁了。</div></div>';
                                break;
                            case '9':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你在帖子<a href="detail.html?id=' + postId + '">' + title + '</a>的时间币被锁定了。/div></div>';
                                return(messageHtml);
                                break;
                            case '10':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你在帖子<a href="detail.html?id=' + postId + '">' + title + '</a>的时间币被解锁了。</div></div>';
                                return(messageHtml);
                                break;
                            case '11':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你在帖子<a href="detail.html?id=' + postId + '">' + title + '</a>的交易评分被锁定了。</div></div>';
                                return(messageHtml);
                                break;
                            case '12':
                                messageHtml += '<div data-post-id="' + id + '" data-user-id="" class="no-report-item">  <div class="system-message">你在帖子<a href="detail.html?id=' + postId + '">' + title + '</a>的交易评分被解锁了。</div></div>';
                                return(messageHtml);
                                break;
                            case '13':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的账号被锁定了。</div></div>';
                                return(messageHtml);
                                break;
                            case '14':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message">你的账号被解锁了。</div></div>';
                                return(messageHtml);
                                break;
                            case '15':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message"><a href="checkHisInfo.html?id='+ userId + '">' +userStuName +  '</a>在帖子<a href="detail.html?id=' + postId + '">' + title + '</a>中@了你。</div></div>';
                                return(messageHtml);
                                break;
                            case '16':
                                messageHtml += '<div data-post-id="' +  id + '" data-user-id="" class="no-report-item"> <div class="system-message"><a>你在帖子<a href="#">' + title + '</a>没被选为任务人</div></div>';
                                return(messageHtml);
                                break;
                        }
                    }
                } else {
                    //判断token的状态，如果已失效则转到登录页面，每次发送请求都要
                    alert("你的登录已过期，请重新登录！");
                    window.location = "login.html";
                }
            },
            function error() {
                alert('error');
            });

        //alert('a');
    });
    //点击已读
    $('.new-message').on('click', '.system-message', function (e) {
        //收藏帖子
        var $This = $(this);
        var userData = {
            userId: localStorage['userId'],
            msgId: $(this).parents('.no-report-item').data('post-id')
        }
        sendRequest('user/markRead', userData,
            function beforeSend(xhr) {
                xhr.setRequestHeader('xkey', localStorage['userId']);
                xhr.setRequestHeader('xtoken', localStorage['token']);
            },
            function success(data) {
                console.log(data)
            },
            function error() {
                //alert('error');
            });
    });
})(jQuery);

