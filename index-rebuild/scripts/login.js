$(function() {
    $("#login").click(function() { //按钮点击事件
        var phone = $("#loginPhone").val(); //手机号
        var password = $("#loginPassword").val(); //密码
        var param = {
            phone: $("#loginPhone").val(),
            password: $("#loginPassword").val()
        }
        if (!phone) {
            alert('手机号不能为空！');
            return;
        }
        if (!password) {
            alert('密码不能为空！');
            return;
        }
        $('#login').val("登录中...");
        $('#login').prop('disabled', true);
        sendRequest('user/login', param, function beforeSend(xhr) {
        },
        function success(data) {
			$('#login').val("登录");				
			$('#login').prop('disabled',false);
			if(data.statusCode == 102){
				var userId=data.result.userId;
				var token=data.result.token; 
               	window.localStorage.userId=userId;
               	window.localStorage.token=token;
				window.location = "indexAfterLogin.html";
			}
			else{
				alert("用户名或密码错误！");
				return false;
			}
		},
        function error() {
        	$('#login').val('重新登录');
			$('#login').prop('disabled',false);
			alert('登录失败，请检查网络连接！');
        });
    });
})