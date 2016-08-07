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
	$("#register").click(function(){	//按钮点击事件
		
		var stuName = $("#stuName").val();
		var phone = $("#registerPhone").val();
		var password = $("#registerPassword").val();
		var confirmPassword = $("#confirm-register-password").val();
		var verifyCode = $("#verifyCode").val();
		var param = {
			stuName: $("#stuName").val(),
			phone: $("#registerPhone").val(),
			password: $("#registerPassword").val()
			}
		if (!stuName && !phone && !verifyCode && !password && !confirmPassword){
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
		//还差检验验证码是否正确,后期加上
		$('#register').val("注册中...");
		$('#register').prop('disabled',true);
		$.ajax({
			type: "POST", //与后端沟通好用get还是post
			dataType:"json",
			url: "http://192.168.20.16:3000/user/signup",//与后端沟通好发送的地址
			cache: false,//忽略缓存
			data: param,//与后端沟通好名称，那个newDate（）是为了读取最新的数据
			success: function(data){
				$('#register').val("注册");
				$('#register').prop('disabled',false);
				if(data.statusCode == 101){//与后端沟通好什么符号表示成功
					alert("注册成功！请登录！");
					$("#register-modal").css("display", "none");
					$("#loginBtn").click();
					}
				else{
					alert(data.message);
					return false;
					}
				},
			error : function() {
					  $('#register').val('重新注册');
					  $('#register').prop('disabled',false);
					  alert('注册失败，请检查网络连接！');
					}			
		});	
	});
	
})