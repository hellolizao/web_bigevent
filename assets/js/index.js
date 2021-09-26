$(function () {
    var layer = layui.layer;

    //1:获取用户的信息

    // 点击并退出
    $('#btnLogout').on('click', function (e) {
        layer.confirm('确定退出登录?', {icon: 3, title: '提示'}, function (index) {
            //将本地登录时缓存清
            localStorage.removeItem('token');
            location.href = 'login.html'
            layer.close(index);
        });


    })

    getUserInfo();

    function getUserInfo() {
// 请求服务器
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败")
                }
                // 1: 利用返回的信息渲染用户的图像
                //MP: 1:用户图像存在与否（图片图像或者文字显示）
                renderAvatar(res.data);
            },
            //    3:确保从地址栏直接请求inde.html(带有访问权限的）无法跳转（被全局同一挂载complete)
            // complete: function (res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         //    清空本地缓存
            //         localStorage.removeItem('token');
            //         location.href = 'login.html';
            //     }
            // }
        })
    }

    function renderAvatar(user) {
//用户可能设置了昵称和没有
        var name = user.nickname || user.username;
        $("#welcome").html('欢迎&nbsp' + name);
//   渲染用户的图像（图片和文本图像）
        if (user.user_pic !== null) {
            $(".layui-nav-img").attr('src', user.user_pic).show();
            $('.text-avatar').hide();
        } else {
            $('.layui-nav-img').hide();
            //TODO:（未知）查看这里的name[0]为什么可以？。
            var first = name[0].toUpperCase();
            $('.text-avatar').html(first).show();
        }
    }
})