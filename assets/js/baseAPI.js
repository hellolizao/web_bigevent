$(function () {
    //TODO:（弄清）这个。
    $.ajaxPrefilter(function (options) {
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
//为每个需要请求权限同一管理headers
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
        //    全局挂在complete回调函数
        options.complete = function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                        //    清空本地缓存
                        localStorage.removeItem('token');
                        location.href = 'login.html';
                    }
        }
    })
})
