
//新版jquery不支持$.browser.version ; 兼容性处理
(function(jQuery){
    if(jQuery.browser) return;
    jQuery.browser = {};
    jQuery.browser.mozilla = false;
    jQuery.browser.webkit = false;
    jQuery.browser.opera = false;
    jQuery.browser.msie = false;
    var nAgt = navigator.userAgent;
    jQuery.browser.name = navigator.appName;
    jQuery.browser.fullVersion = ''+parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;
// In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        jQuery.browser.opera = true;
        jQuery.browser.name = "Opera";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            jQuery.browser.fullVersion = nAgt.substring(verOffset+8);
    }
// In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        jQuery.browser.msie = true;
        jQuery.browser.name = "Microsoft Internet Explorer";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+5);
    }
// In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Chrome";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+7);
    }
// In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Safari";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1)
            jQuery.browser.fullVersion = nAgt.substring(verOffset+8);
    }
// In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        jQuery.browser.mozilla = true;
        jQuery.browser.name = "Firefox";
        jQuery.browser.fullVersion = nAgt.substring(verOffset+8);
    }
// In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
        (verOffset=nAgt.lastIndexOf('/')) )
    {
        jQuery.browser.name = nAgt.substring(nameOffset,verOffset);
        jQuery.browser.fullVersion = nAgt.substring(verOffset+1);
        if (jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()) {
            jQuery.browser.name = navigator.appName;
        }
    }
// trim the fullVersion string at semicolon/space if present
    if ((ix=jQuery.browser.fullVersion.indexOf(";"))!=-1)
        jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);
    if ((ix=jQuery.browser.fullVersion.indexOf(" "))!=-1)
        jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix);
    jQuery.browser.majorVersion = parseInt(''+jQuery.browser.fullVersion,10);
    if (isNaN(jQuery.browser.majorVersion)) {
        jQuery.browser.fullVersion = ''+parseFloat(navigator.appVersion);
        jQuery.browser.majorVersion = parseInt(navigator.appVersion,10);
    }
    jQuery.browser.version = jQuery.browser.majorVersion;
})(jQuery);


(function ($) {

    var userId = localStorage.getItem('userId'),
        token = localStorage.getItem('token');

    function sendformdataRequest(url, params, beforeSend, success, error) {
        $.ajax({
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            type: "POST",
            dataType: "json",
            url: 'http://192.168.20.21:3000/' + url,
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
            url: 'http://192.168.20.21:3000/' + url,
            data: params,
            success: success,
            error: error,
            beforeSend: beforeSend
        });
    }

    function tpl(tplId, data, variable) {
        return $.template($(tplId).html(), data, {variable: variable});
    }


//放大缩小图片
    function imgToSize(size) {
        var iw = $('.jcrop_w>img').width(),
            ih = $('.jcrop_w>img').height(),
            _data = $(".jc-demo-box").attr("data"),
            _w = Math.round(iw + size),
            _h = Math.round(((iw + size) * ih) / iw);

        if(($.browser.version == 8.0 || $.browser.version == 7.0 || $.browser.version == 6.0) && (_data == 90 || _data == 270)){
            $('.jcrop_w>img').width(_h).height(_w);
        }else{
            $('.jcrop_w>img').width(_w).height(_h);
        }

        var     fiw = $('.jcrop_w>img').width(),
            fih = $('.jcrop_w>img').height(),
            ow = (395 - fiw) / 2,
            oh = (340 - fih) / 2,
            cx = $("#small").position().left,
            cy = $("#small").position().top,
            rx = 110 / $("#small").width(),
            ry = 135 / $("#small").height(),
            rx1 = 73 / $("#small").width(),
            ry1 = 90 / $("#small").height(),
            rx2 = 40 / $("#small").width(),
            ry2 = 48 / $("#small").height();

        if(($.browser.version == 8.0 || $.browser.version == 7.0 || $.browser.version == 6.0) && (_data == 90 || _data == 270)){
            pre_img2($('.pre-1 img'), rx, fih, ry, fiw, cx, cy, ow, oh);
            pre_img2($('.pre-2 img'), rx1, fih, ry1, fiw, cx, cy, ow, oh);
            pre_img2($('.pre-3 img'), rx2, fih, ry2, fiw, cx, cy, ow, oh);
        }else{
            pre_img2($('.pre-1 img'), rx, fiw, ry, fih, cx, cy, ow, oh);
            pre_img2($('.pre-2 img'), rx1, fiw, ry1, fih, cx, cy, ow, oh);
            pre_img2($('.pre-3 img'), rx2,  fiw, ry2, fih, cx, cy, ow, oh);
        }
        $(".jcrop_w img").css({
            left: ow,
            top: oh
        });

    };

    function pre_img2(obj, rx, iw, ry, ih, cx, cy, ow, oh) {
        obj.css({
            width: Math.round(rx * iw) + 'px',
            height: Math.round(ry * ih) + 'px'
        });
        if (cy >= oh && cx >= ow) {
            obj.css({
                marginLeft: '-' + Math.round(rx * (cx - ow)) + 'px',
                marginTop: '-' + Math.round(ry * (cy - oh)) + 'px'
            });
        } else if (cy <= oh && cx >= ow) {
            obj.css({
                marginLeft: "-" + Math.round(rx * (cx - ow)) + 'px',
                marginTop: Math.round(ry * (oh - cy)) + 'px'
            });
        } else if (cy >= oh && cx <= ow) {
            obj.css({
                marginLeft: Math.round(rx * (ow - cx)) + 'px',
                marginTop: '-' + Math.round(ry * (cy - oh)) + 'px'
            });
        } else if (cy <= oh && cx <= ow) {
            obj.css({
                marginLeft: Math.round(rx * (ow - cx)) + 'px',
                marginTop: Math.round(ry * (oh - cy)) + 'px'
            });
        }

    }


//默认图像位置，约束图像位置居中
    function cutImage(obj) {
        //画布大小
        var w = 400,
            h = 400,
            //图像原始大小
            iw = $(obj).width(),
            ih = $(obj).height();

        //如果图像大于画布
        if (iw > w || ih > h) {
            //图像宽高比大于 画布比例，设置宽度100%
            if (iw / ih > w / h) {
                obj.css({
                    width: w,
                    height: w * ih / iw,
                    top: (h - (w * ih / iw)) / 2,
                    left: 0
                });
                return iw / w ;
            } else {
                obj.css({
                    height: h,
                    width: h * iw / ih,
                    top: 0,
                    left: (w - (h * iw / ih)) / 2
                });
                return ih / h ;
            }
        } else {
            //图像小于画布
            obj.css({
                left: (w - iw) / 2,
                top: (h - ih ) / 2
            });

        }
    }

    function showPreview(c) {
        //c 为裁剪窗口大小
        var $jcropImg = $('.jcrop_w>img');
            iw = $jcropImg.width(), //约束后的图像大小
            ih = $jcropImg.height(),
            ow = (400 - iw) / 2,
            oh = (400 - ih) / 2,
            rx = 100 / c.w,
            ry = 100 / c.h,
            rx1 = 70 / c.w,
            ry1 = 70 / c.h,
            rx2 = 30 / c.w,
            ry2 = 30 / c.h,
            _data = $(".jc-demo-box").attr("data");


        //设置裁剪后头像预览图像效果
        if (($.browser.version == 8.0 || $.browser.version == 7.0 || $.browser.version == 6.0) && (_data == 90 || _data == 270)) {
            pre_img2($('.pre-1 img'), rx, ih, ry, iw, c.x, c.y, ow, oh);
            pre_img2($('.pre-2 img'), rx1, ih, ry1, iw, c.x, c.y, ow, oh);
            pre_img2($('.pre-3 img'), rx2, ih, ry2, iw, c.x, c.y, ow, oh);
        } else {
            pre_img2($('.pre-1 img'), rx, iw, ry, ih, c.x, c.y, ow, oh);
            pre_img2($('.pre-2 img'), rx1, iw, ry1, ih, c.x, c.y, ow, oh);
            pre_img2($('.pre-3 img'), rx2, iw, ry2, ih, c.x, c.y, ow, oh);
        }
        //最终设置好的参数：x,y,width,height
        var calcuX = Math.round( (c.x - parseFloat( $jcropImg.css('left') ) )*$target.scale ),
            calcuY = Math.round( (c.y - parseFloat( $jcropImg.css('top') ) )*$target.scale ),
            calcuW = Math.round( c.w * $target.scale);
            // console.log(calcuX,calcuY,calcuW);
            
        $('#x').val(calcuX);
        $('#y').val(calcuY);
        $('#w').val(calcuW);
        //原始数据
        // console.log(c.x,c.y,c.w,c.h,$target.scale,$(".jcrop_w>img").css('top'),parseFloat($(".jcrop_w>img").css('left')) );
    //    计算后的数据
    //     console.log( (c.x - parseFloat( $(".jcrop_w>img").css('left') ) )*$target.scale, (c.y - parseFloat( $(".jcrop_w>img").css('top') ) )*$target.scale,c.w * $target.scale    )
    }

    function startJcrop() {
        //默认图像居中显示
        $target.scale = cutImage($(".jcrop_w>img"));

        var _Jw = ($target.width() - 100) / 2,
            _Jh = ($target.height() - 100) / 2,
            _Jw2 = _Jw + 100,
            _Jh2 = _Jh + 100;

        $target.Jcrop({
            setSelect: [_Jw, _Jh, _Jw2, _Jh2],
            onChange: showPreview,
            onSelect: showPreview,
            bgFade: true,
            bgColor: "white",
            aspectRatio: 1,
            bgOpacity: .5
        });

        // $("#idBig").click(function(e){
        //     imgToSize(20);
        //     return false;
        // });
        // $("#idSmall").click(function(e){
        //     imgToSize(-20);
        //     return false;
        // });

    }




    //调用绑定, 预览上传的图片文件
    function preview(file, container) {
        var prevDiv = document.querySelector(container);
        if (file.files && file.files[0]) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                prevDiv.innerHTML = '<img src="' + evt.target.result + '" />';
                $('.preview-container>div')
                    .empty()
                    .append('<img src="' + evt.target.result + '" class="jcrop-preview' +
                    ' jcrop_preview_s" />');
            }
            reader.readAsDataURL(file.files[0]);
        }
        else {
            prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
            $('.preview-container>div')
                .empty()
                .append('<img src="' + evt.target.result + '" class="jcrop-preview' +
                ' jcrop_preview_s" />');
        }
    }


    var $uploadContainer = $('.choose-photo'),
        $target = $('#target'),
        $choseImg = $('#preview-pane').find('.preview-container>div'),
        $uploadImg = $('#upload-img'),
        $defaultAvatar = $('#default-avatar'),
        $btnAvatar = $('#local-avatar,#default-avatar');
        // $btnDefaultAvatar = $('#default-avatar');
    
    // var $choosePhoto = $('.choose-photo'),
   

    //取消上传图片时，移除已加载图片
    function removePhoto() {
        $uploadContainer.css('display','block');
        $('.jcrop-holder').add($target).css('display','none');
        $target.add($choseImg).empty();
    }

    
    
    
    
    
    //头像面板相关事件绑定
    function avatarPanelEvent() {
        var $avatarUpload = $('.avatar-upload-panel');

        //点击头像弹出上传头像面板
        $('section.user-info').on('click','#user-avatar',function () {
            $avatarUpload.slideDown();
        });

        //按钮事件 切换默认头像/本地头像选项卡
        $('#btn-avatar').find('a').on('click',function(e){
            e.preventDefault();
            if (this.id == "default-avatar"){
                // $('.jcrop-holder').css('display','none');
                //获取默认头像资源路径
                sendRequest(
                    "user/getDefaultAvatar",
                    null,
                    function (xhr) {
                        xhr.setRequestHeader('xkey', userId);
                        xhr.setRequestHeader('xtoken', token);
                    },
                    function (data) {
                        console.log(data);
                        $('#default-avatar-panel').html(tpl("#default-avatar-tpl", data.result, "avatar"));

                    },
                    function (xhr) {
                        console.log(xhr);
                    }
                )
            } else {
                // $('.jcrop-holder').css('display','block');
            }
            $(this).tab("show");
        });



        //取消上传头像
        $('#avatar-upload-dismiss,#jcrop-submit').add('.avatar-panel .dismiss').on('click',function () {
            $avatarUpload.slideUp(function () {
                removePhoto();
            });
            $defaultAvatar.css('pointerEvents','auto')
        });

        //默认头像按钮，本地头像按钮事件
        $btnAvatar.on('click',function () {
             if ( !$(this).hasClass('active') ){
                 $btnAvatar.toggleClass('active');
             }
        });

        //点击默认头像面板的默认头像事件
        $('#default-avatar-panel').on('click','img',function (e) {
            $('#default-avatar-panel').children('figure').removeClass("active");
            $(this).parent('figure').addClass("active");
            var $selected = $(this).clone().css('width','100%');
            $choseImg.empty().append($selected);
            e.stopPropagation();
        });

        //从本地上传到浏览器时，预览
        $uploadImg.on('change', function () {
            preview(this, '#target');
            $uploadContainer.fadeOut(1000, function () {
                $('.jcrop-holder').css('display','block');
                $target.fadeIn(1000);
                startJcrop();
            });
            $defaultAvatar.css('pointerEvents','none');
        });
    }

    
    avatarPanelEvent();
    

})(jQuery);

