//处理帖子正文的表情的，请将获取到的数据传到str，表情才能正常显示
function replace_em(str){
		str = str.replace(/\</g,'&lt;');
		str = str.replace(/\>/g,'&gt;');
		str = str.replace(/\n/g,'<br/>');
		str = str.replace(/\[em-([0-9]*)\]/g,'<img src="assets/img/face/$1.gif" border="0" />');
		return str;
	}