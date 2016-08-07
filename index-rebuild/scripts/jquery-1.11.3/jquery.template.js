/**
 * Created by Chenweiyu
 * Date : 2016/7/23
 * Time : 14:24
 * Require : jquery 
 */


;(function ($) {
    $.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/;
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    $.template = function (text, data, settings) {
        var render;
        settings = $.extend({}, settings, $.templateSettings);

        var matcher = new RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function (match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', '$', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, $);
        var template = function (data) {
            return render.call(this, data, $);
        };

        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    
    $.getDate = function (time) {
        var date = new Date(time);
        return date.getFullYear() + "年" + (date.getMonth()+1) + "月" + date.getDate()+ "日";
    }




    //计算时间差
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    $.getDateDiff = function getDateDiff(dateTimeStamp) {
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            //非法操作
            //alert("结束日期不能小于开始日期！");
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
            result = "发表于" + parseInt(monthC) + "个月前";
        }
        else if (weekC >= 1) {
            result = "发表于" + parseInt(weekC) + "个星期前";
        }
        else if (dayC >= 1) {
            result = "发表于" + parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = "发表于" + parseInt(hourC) + "个小时前";
        }
        else if (minC >= 1) {
            result = "发表于" + parseInt(minC) + "分钟前";
        } else
            result = "刚刚发表";
        return result;
    };


    $.replace_em = function(str){
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="assets/img/face/$1.gif" border="0" />');
        return str;
    };

    $.originUrl = "http://192.168.20.25:3000";



})(jQuery);