/**
 * Created by Administrator on 2050/7/31.
 */
function replace_em(str){
    str = str.replace(/\</g,'&lt;');
    str = str.replace(/\>/g,'&gt;');
    str = str.replace(/\n/g,'<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g,'<img src="assets/img/face/$1.gif" border="0" />');
    return str;
}
(function ($) {
    //模板函数
    function tpl(tplId, data, variable) {
        return $.template($(tplId).html(), data, {variable: variable});
    }

    var userId = localStorage['userId'];
    var token = localStorage['token'];
    var imgOrigin = "http://192.168.20.25:3000";

    var postType = 2;


    //每页参数
    var totalPostsNum = 1, postsPerPage = 10;
    //获取首页帖子
    $('#lastest-card, #help-ground, #ask-help-ground, #renovate').on('click', function () {
        if ($(this).attr("id") == 'lastest-card') {
            postType = 2;
        } else if ($(this).attr("id") == 'help-ground') {
            postType = 0;
        } else if ($(this).attr("id") == 'ask-help-ground') {
            postType = 1;
        }

        console.log(postType)

        sendRequest(
            "post/getAll",
            {
                type: postType,  //帖子类型 0 帮助、1求助 ， 2 全部
                status: 0,
                start_num: 0,
                page_size: postsPerPage,
                sort_by: ''
            },
            function (xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            function (data) {
                console.log(data);

                if (data.statusCode == 100) {
                    totalPostsNum = data.result_count;  //获取总帖子个数
                    data.result.map(function(item){
                        item.publisherAvatar =imgOrigin + item.publisherAvatar  ;
                        item.content = replace_em(item.content);
                    });
                    console.log(data)
                    $('#posts-container').html(tpl('#post-tpl', data.result, "posts"))
                } else {
                    console.log(data.message)
                }


                //设置分页默认值为第一页,重新计算页数
                $('#post-page').bootstrapPaginator("showFirst")
                $('#post-page').bootstrapPaginator("setOptions", {
                    totalPages: Math.ceil(totalPostsNum / postsPerPage)
                });
            },
            function (xhr) {
                console.log(xhr)
            });

    });
    $('#renovate').click();
    //    分页系统事件
    $('#post-page').bootstrapPaginator({
        alignment: "center",
        currentPage: 1,
        totalPages: totalPostsNum / postsPerPage + 1, //总页数
        numberOfPages: 5,  // 可视页数
        bootstrapMajorVersion: 3,
        onPageChanged: function (event, oldpage, newpage) {
            // console.log(event,oldpage,newpage);
            //查看我的帖子
            sendRequest(
                "post/getAll",
                {
                    type: postType,  //帖子类型 0 帮助、1求助 ， 2 全部
                    status: 0,  // TODO 帖子状态012345， 理论上需要0，1状态的
                    start_num: (newpage - 1) * postsPerPage,  // 开始帖子index
                    page_size: postsPerPage,  //每页帖子个数
                    sort_by: ''
                },
                function (xhr) {
                    xhr.setRequestHeader('xkey', userId);
                    xhr.setRequestHeader('xtoken', token);
                },
                function (data) {
                    if (data.statusCode == 100) {
                        console.log(data);
                        $('#posts-container').html(tpl("#post-tpl", data.result, "posts"));
                    } else {
                        console.log(data.message);
                        $('#posts-container').html("");
                    }

                },
                function (xhr) {
                    console.log(xhr)
                });
        }
    });
    $('#posts-container').on('click', '.collect-post', function (e) {
        //收藏帖子
        var $This = $(this);
        sendRequest(
            'post/favo',
            {
                userId: userId,
                postId: $(this).parents('.post-item').data('post-id')
            },
            function (xhr) {
                xhr.setRequestHeader('xkey', userId);
                xhr.setRequestHeader('xtoken', token);
            },
            function (data) {
                console.log(data);
                if (data.statusCode == 100) {

                    $This.html("<i class='glyphicon glyphicon-heart'></i>")
                } else {
                    console.log(data.message)
                }
            },
            function (xhr) {
                console.log(xhr)
            });
    });
})(jQuery);
