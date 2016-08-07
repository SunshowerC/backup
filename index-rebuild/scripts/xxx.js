function sendformdataRequest(url, params, beforeSend, success, error){
	$.ajax({ 
		async: false,  
		cache: false,  
		contentType: false,  
		processData: false,  
		type: "POST",
		dataType:"json",
		cache: false,
		url: 'http://192.168.20.25:3000/' + url,
		data: params,
		success: success,
		error: error,
		beforeSend:beforeSend
	});	
}
function sendRequest(url, params, beforeSend, success, error){
	$.ajax({
		type: "POST",
		dataType:"json",
		cache: false,
		url: 'http://192.168.20.25:3000/' + url,
		data: params,
		success: success,
		error: error,
		beforeSend:beforeSend
	});
}
