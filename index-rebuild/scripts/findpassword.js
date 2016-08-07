$(document).ready(function(){
	var wait=60;
	function time(o) {
		if (wait == 0) {
			o.removeAttribute("disabled");			
			o.value="获取验证码";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.value="重新发送("+wait+")";
			wait--;
			setTimeout(function() {
			time(o)
			},
			1000)
		}
	}
	
	$("#getVerifyCode").on("click", function(){ time(this)});
	
	$("#yesButton").click(function(){	//按钮点击事件
		var phone = $("#findPasswordPhone").val();
		var password = $("#password").val();
		var confirmPassword = $("#confirmPassword").val();
		var verifyCode = $("#verifyCode").val();
		var param = {
			phone: $("#findPasswordPhone").val() ,
			verifycode: $("#verifyCode").val(),
			password: $("#password").val()
			};
		if (!phone && !verifyCode && !password && !confirmPassword){
			alert('请将表填完整！');
			return;
		};
		if(/^1[3|4|5|7|8]\d{9}$/.test(phone) == false){
			alert("手机号码格式错误！");
			return;
		};
		if(/\w{6,16}$/.test(password) == false){
			alert("密码格式错误！");
			return;
		};
		if(password != confirmPassword){
			alert("两次输入的密码不一致！");
			return;
		};
		//还差检验验证码是否正确,后期加上加上
		$('#yesButton').val("设置中...");
		$('#yesButton').prop('disabled',true);
		$.ajax({
			type: "POST", //与后端沟通好用get还是post
			dataType:"json",
			url: "http://192.168.20.21:3000/user/updatePass",//与后端沟通好发送的地址
			cache: false,//忽略缓存
			data: param,//与后端沟通好名称，那个newDate（）是为了读取最新的数据
			success: function(data){
				$('#yesButton').val("确定");
				$('#yesButton').prop('disabled',false);
				if(data.statusCode == 100){//与后端沟通好什么符号表示成功
					alert("设置新密码成功，请重新登录！");
					window.location = "indexNotLogin.html";//加载登录后的页面
					$(".login a:eq(0)").click();
					}
				else{
					alert(data.message);
					return false;
					}
				},
			error : function() {
					  $('#yesButton').val('重新设置');
					  $('#yesButton').prop('disabled',false);
					  alert('设置失败，请检查网络连接！');
					}			
		});	
	});
	
})