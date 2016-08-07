(function() {
    var userData = {
        userId: localStorage['userId']
    } 
    sendRequest('user/getMsg', userData,
    function beforeSend(xhr) {
        xhr.setRequestHeader('xkey', localStorage['userId']);
        xhr.setRequestHeader('xtoken', localStorage['token']);
    },
    function success(data) {
        console.log(data)
    },
    function error() {
        alert('error');
    });
    //alert('a');
})();
(function() {
    var userData = {
        userId: localStorage['userId'],
        msgId: '579dcc4ffb2d3f088c952852'
    } 
    sendRequest('user/markRead', userData,
    function beforeSend(xhr) {
        xhr.setRequestHeader('xkey', localStorage['userId']);
        xhr.setRequestHeader('xtoken', localStorage['token']);
    },
    function success(data) {
        console.log(data)
        var userId = localStorage['userId'];
            var token = localStorage['token'];
            var title = $("input[name='title']").val();
            var content = $("textarea[name='content']").val();
            var pubsel = $("#expTime").find("option:selected").val(); 
            var contact = $("input[name='contact']").val();
            var missionCoin = $("input[name='missionCoin']").val();
    },
    function error() {
        alert('error');
    });
    //alert('a');
})();

