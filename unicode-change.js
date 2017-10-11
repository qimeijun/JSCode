// 将字符串转换成Unicode编码 参数：字符串
function changeUnicode (str) {
    if (str.length <= 0) {
        return false;
    }
    var getUnicode = [];
    // 循环便利，将每个字符拆开
    for (var i = 0; i < str.length; i++) {
        // str.charCodeAt(i) 将第i个字符转换成Unicode编码，返回位于0到65535 之间的整数
        // .toString(16) 将Unicode编码转换成十六进制
        getUnicode.push(str.charCodeAt(i).toString(16));
    }
    return getUnicode;
}

// 将Unicode编码转换成字符串 参数：数组
// *** 将想要解密Unicode编码必须添加"\u"转义字符
function change(arr) {
    if (arr.length <= 0){
        return false;
    }
    var str = '{', temp;
    // 将每个Unicode编码拼接为JSON字符串
    for (var i = 0; i < arr.length; i++) {
        temp = '\\u' + arr[i];
        if (i == arr.length - 1) {
            str += '"' + i + '": "'+ temp +'"';
        } else {
            str += '"' + i + '": "'+ temp +'",';
        }
    }
    str += '}';
    // 将字符串转换成Object对象，目的是转码Unicode编码为正常字符串
    var objJSON = JSON.parse(str);
    var result = '';
    // 将转码的单个字符拼接起来
    for (var i in objJSON) {
        result += objJSON[i];
    }
    return result;
}

var ar = changeUnicode('我是张三');
var res = change(ar);
console.log(res);
