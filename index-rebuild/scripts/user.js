/**
 * Created by Administrator on 2016/7/10.
 */

/*

 //模板数据填充
 function tpl(id,data){
 var html=document.getElementById(id).innerHTML;
 var result="var p=[];with(obj){p.push('"
 +html.replace(/[\r\n\t]/g," ")
 .replace(/<%=(.*?)%>/g,"');p.push($1);p.push('")
 .replace(/<%/g,"');")
 .replace(/%>/g,"p.push('")
 +"');}return p.join('');";
 var fn=new Function("obj",result);
 return fn(data);
 }

 var user = {
 'name': '没锁定',
 'avatar': 'assets/img/640.png',
 'coin': 10
 }

 $(".user-info").html( tpl("user-info", user) );

 */
/*
测试一号 : "579b62871997c78c292b0f2e"
 "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVfdGltZSI6MTQ3MDU4MTc0NjU3OX0.rPuRzvXwlzeqia-ERzJdDEGVR0whxaP0c3s0_sPHR2k"


 */


(function ($) {



    var userId = localStorage.getItem('userId'),
        token = localStorage.getItem('token');

    $.originUrl = "http://192.168.20.25:3000";

    //登录
/*
    sendRequest(
        "user/login",
        {
            phone:"13511111111",
            password: "123456"
        },
        null,
        function (data) {
            console.log(data);
        },
        function (xhr) {
            console.log(xhr)
        }
    )
*/

    var $usrInfo = $('#user-detail').find('.form-group :input'),
        $nav = $('.user-post-nav,.user-panel-nav');

    // $('a').addClass('transition');

    //默认不可编辑   //todo
    $usrInfo.prop('disabled', 'true');
    $('#btn-modify').on('click', function () {
        $usrInfo.removeAttr('disabled');
    });


    //清除不同导航栏的active样式   //todo
    $nav.on('click', 'a', function (e) {
        var target = e.target;
        if (target.tagName.toLocaleLowerCase() == 'a' &&
            target.className != 'active') {
            $nav.children('li').removeClass('active');
        }
    });


//    右下帖子面板事件交互 //todo

    var $tabWrap = $('#tab-wrap');
    $tabWrap.on('click', 'a', function () {
        if ($(this).is('.btn-sure')) {
            $ensurePanel.slideDown();
        }
    });


//   确定任务人面板交互事件

    var $ensurePanel = $('#ensure-mission');
    var $missionAvatar = $ensurePanel.find('figure');


    //弹出确定任务人面板
    $ensurePanel.on('click', 'figure,a,button', function (e) {
        if ($(this).is('figure')) {
            $missionAvatar.removeClass('active');
            $(this).toggleClass('active');
        }

        if ($(this).data('triggle') === 'dismiss') {
            $ensurePanel.slideUp();
            $('#btn-ensure-participant').off('click');
        }
    });


//    分页系统事件
 /*   $('#post-page').bootstrapPaginator({
        alignment: "center",
        currentPage: 1,
        totalPages: 10,
        numberOfPages: 5,
        bootstrapMajorVersion: 3,
        onPageChanged: function (event, oldpage, newpage) {
            // console.log(event,oldpage,newpage);
        }
    });

*/


    //实测-个人信息  //todo

    sendRequest("user/getMyInfo",
        {
            userId: userId
        },
        function (xhr) {
            xhr.setRequestHeader('xkey', userId);
            xhr.setRequestHeader('xtoken', token);
        },
        function (data) {
            if (data.statusCode != -1000) {
                $('.user-info').html(tpl("#user-info-tpl", data.result.userInfo, "user"));
                $('#user-detail').prepend(tpl('#user-detail-tpl', data.result.userInfo, "user"))
            }

        },
        function (xhr) {
            console.log(xhr)
        });


    //实测-修改个人信息 //todo
    $('#info-submit').on('click', function () {

        sendRequest(
            "user/update",
            $('#user-detail').serialize() + "&userId=" + userId,
            function (xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            function (data) {
                console.log(data);
            },
            function (xhr) {
                console.log(xhr)
            });

    });


    //修改头像

    $("#jcrop-submit").on('click', function () {
        var fdata = new FormData();
        if ($('#btn-avatar').children('a.active').data('avatar-type') == 0 ) {
            fdata.append('avatar',$('#upload-img')[0].files[0]);
            fdata.append('x',$('#x').val() );
            fdata.append('y',$('#y').val() );
            fdata.append('height',$('#w').val() );
        } else {
            fdata.append('defaultAvatar',
                $('#default-avatar-panel')
                    .children('.active').data('avatar-src') );
        }

        fdata.append('userId',userId );

        sendformdataRequest(
            "user/avatar",
            fdata,
            function (xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            function (data) {
                console.log(data);
            },
            function (xhr) {
                console.log(xhr)
            });


    });

    //帖子



    
    function sendformdataRequest(url, params, beforeSend, success, error) {
        $.ajax({
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            type: "POST",
            dataType: "json",
            url: "http://192.168.20.25:3000/" + url,
            data: params,
            success: success,
            error: error,
            beforeSend: beforeSend
        });
    }

    function sendRequest(url, params, beforeSend, success, error) {
        $.ajax({
            type: "POST",
            dataType: "json",
            cache: false,
            url: "http://192.168.20.25:3000/" + url,
            data: params,
            success: success,
            error: error,
            beforeSend: beforeSend
        });
    }

    function tpl(tplId, data, variable) {
        return $.template($(tplId).html(), data, {variable: variable});
    }


    var pdata = new FormData();
    pdata.append('userId','579b62871997c78c292b0f2e');
    pdata.append('postType','1');
    pdata.append('title','请求帮助3号');
    pdata.append('content','内容');
    pdata.append('contact','123456');
    pdata.append('expTime',new Date("2017-03-01"));
    pdata.append('missionCoin','5');



    //发布帖子
    /*
     sendformdataRequest(
     "post/publish",
     pdata,
     function (xhr) {
     xhr.setRequestHeader('xkey', userId);
     xhr.setRequestHeader('xtoken', token);
     },
     function (data) {
     console.log(data)
     },
     function (xhr) {
     console.log(xhr)
     });

     */






    //查看我的帖子
    var postGroup = ["user/myPubPosts","user/myJoinPosts","user/myFavoPosts"];
    var postGroupIndex = 0, postStatus = 0,totalPostsNum =1,postsPerPage = 3;
    
    $('#user-post-menu,#user-post-nav').on('click','a',function () {
        
        //左侧组别
        if ( $(this).data("post-group") >=0 ) {
            postGroupIndex = $(this).data("post-group");
        }

        //头部组别
        if ( $(this).data("post-status") >=0 ) {
            postStatus = $(this).data("post-status");
            $('#user-post').find('li').not('#post-page>li').removeClass('active');
            $(this).parent('li').addClass('active');
        }
        // console.log(postGroupIndex,postStatus);

        //查看我的帖子
        sendRequest(
            postGroup[postGroupIndex],
            {
                userId: userId,
                type:2,  //所有帖子
                status:postStatus,  //进行中的帖子
                start_num:0,
                page_size:postsPerPage
            },
            function (xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            function (data) {
                console.log(data);

                if (data.statusCode == 100) {
                    totalPostsNum = data.result_count;

                    data.result.map(function (item) {   //为获取到的帖子列表添加上postGroup属性
                        return item.postGroup = postGroupIndex;
                    });

                    $('.post-container').html( tpl("#post-tpl",data.result,"posts") ) ;

                } else {
                    console.log(data.message);
                    $('.post-container').html("");
                }

                //设置分页默认值为第一页,重新计算页数
                $('#post-page').bootstrapPaginator("showFirst");
                $('#post-page').bootstrapPaginator("setOptions",{
                        totalPages:Math.ceil(totalPostsNum/postsPerPage)
                    });

            },
            function (xhr) {
                console.log(xhr)
            });
    });


    //    分页系统事件
    $('#post-page').bootstrapPaginator({
        alignment: "center",
        currentPage: 1,
        totalPages: totalPostsNum/postsPerPage + 1, //总页数
        numberOfPages: 5,  // 可视页数
        bootstrapMajorVersion: 3,
        onPageChanged: function (event, oldpage, newpage) {
            // console.log(event,oldpage,newpage);
            //查看我的帖子
            sendRequest(
                postGroup[postGroupIndex],
                {
                    userId: userId,
                    type:2,  //所有帖子
                    status:postStatus,  //进行中的帖子
                    start_num:(newpage - 1) * postsPerPage,
                    page_size:postsPerPage  //每页帖子个数
                },
                function (xhr) {
                    xhr.setRequestHeader('xkey', userId);
                    xhr.setRequestHeader('xtoken', token);
                },
                function (data) {
                    if (data.statusCode == 100) {
                        data.result.map(function (item) {
                            return item.postGroup = postGroupIndex;
                        });
                        console.log(data);
                        $('.post-container').html( tpl("#post-tpl",data.result,"posts") ) ;
                    } else {
                        console.log(data.message);
                        $('.post-container').html("");
                    }

                },
                function (xhr) {
                    console.log(xhr)
                });
        }
    });


//    确定任务人
    /*    sendRequest(
     "post/assign",
     {
     userId: userId,
     postId: "579b7dc50f3f3a7c4d476ef2",
     participantId: "579b6ccb1997c78c292b0f2f"
     },
     function (xhr) {
     xhr.setRequestHeader('xkey', userId);
     xhr.setRequestHeader('xtoken', token);
     },
     function (data) {
     console.log(data)
     },
     function (xhr) {
     console.log(xhr)
     })
     */



//    取消任务
    /*    sendRequest(
     "post/cancel",
     {
     userId: userId,
     postId: "579b7dab0f3f3a7c4d476eef"
     },
     function (xhr) {
     xhr.setRequestHeader('xkey', userId);
     xhr.setRequestHeader('xtoken', token);
     },
     function (data) {
     console.log(data)
     },
     function (xhr) {
     console.log(xhr)
     }
     )*/



    //帖子状态操作
    $('.post-container').on('click','a',function(){
        // console.log( $(this).parents('.post-item'))
        if ($(this).hasClass('btn-complete') ) {
            //    确定完成任务  ???
            sendRequest(
                "post/confirm",
                {
                    userId: userId,
                    postId: $(this).parents('.post-item').data('post-id')
                },
                function (xhr) {
                    xhr.setRequestHeader('xkey', userId);
                    xhr.setRequestHeader('xtoken', token);
                },
                function (data) {
                    console.log(data)
                },
                function (xhr) {
                    console.log(xhr)
                }
            )
        }

        //取消任务
        if ($(this).hasClass('btn-cancel') || $(this).hasClass('cancel') ) {
            sendRequest(
                "post/cancel",
                {
                    userId: userId,
                    postId: $(this).parents('.post-item').data('post-id')
                },
                function (xhr) {
                    xhr.setRequestHeader('xkey', userId);
                    xhr.setRequestHeader('xtoken', token);
                },
                function (data) {
                    console.log(data)
                },
                function (xhr) {
                    console.log(xhr)
                }
            )
        }

        //评价
        if($(this).hasClass('btn-judge') ) {
            var $This = $(this);

            $('#access-submit').on('click',function () {
                sendRequest(
                    'user/grade',
                    {
                        userId: userId,
                        target: $This.data('parti-id'),
                        postId:  $This.parents('.post-item').data('post-id'),
                        score: $('#judge-him').text()
                    },
                    function (xhr) {
                        xhr.setRequestHeader('xkey', userId);
                        xhr.setRequestHeader('xtoken', token);
                    },
                    function (data) {
                        console.log(data)
                    },
                    function (xhr) {
                        console.log(xhr)
                    }

                )
            });

        }


        //    确定任务人
        if($(this).hasClass('btn-sure') ) {
            var postId = $(this).parents('.post-item').data('post-id');
            sendRequest(
                "post/getPost",
                {
                    userId: userId,
                    postId: postId
                },
                function (xhr) {
                    xhr.setRequestHeader('xkey', userId);
                    xhr.setRequestHeader('xtoken', token);
                },
                function (data) {
                    console.log(data);
                    if (data.statusCode == 100){
                        $('#ensure-mission').find('.panel-body').html(
                            tpl("#ensure-mission-tpl",data.result.participant,"participants")
                        )
                    }

                },
                function (xhr) {
                    console.log(xhr)
                });

            //点击确定任务人后,进一步确定具体人选
            $('#btn-ensure-participant').on('click',function () {
                //$('#ensure-mission').find('figure.active').data('user-id');

                //确定任务人
                sendRequest(
                    "post/assign",
                    {
                        userId: userId,
                        postId: postId,
                        participantId: $('#ensure-mission').find('figure.active').data('user-id')
                    },
                    function (xhr) {
                        xhr.setRequestHeader('xkey', userId);
                        xhr.setRequestHeader('xtoken', token);
                    },
                    function (data) {
                        console.log(data)
                    },
                    function (xhr) {
                        console.log(xhr)
                    })
            });

        }

    });






  /*   // 报名
     sendRequest(
     "post/register",
     {
     registerId: userId,
     postId: "579dcc2bfb2d3f088c952851"
     },
     function (xhr) {
     xhr.setRequestHeader('xkey', userId);
     xhr.setRequestHeader('xtoken', token);
     },
     function (data) {
     console.log(data)
     if (data.statusCode == 100){

     }



     },
     function (xhr) {
     console.log(xhr)
     });*/

    // console.log($.getDate("2016-03-15"))


})(jQuery);
