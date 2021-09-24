$(function () {
//    1：点击注册触发事件

    $("#link_reg").on('click', function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").on('click', function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })

//    2:借助layui自定义表单的校验规则
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //对确认密码校验
        repwd: function (value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return layer.msg("两次输入密码不一致 ");
            }
            layer.msg("注册成功请登录");
        }
    })


//    TODO:监听注册表单的提交事件并提示信息（介入接口+模拟点击事件跳到登录页面）


    $("#form_reg").on('submit', function (e) {
        e.preventDefault();
        //提交数据到服务端
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val(),

        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功，请登录");
            $("#link_login").click();

        })
    })
//    TODO：监听登录页面提交事件（请求接口api提交页面数据+跳转index.html+postman测试token)
    $("#form_login").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg("登录失败")
                }
                localStorage.setItem('token',res.token);
                layer.msg('登陆成功');
                location.href = './index.html';
            }
        })

    })
//    TODO：对ajax的请求的配置项做出同一的配置管理（url地拼接）。
//    TODO:推送到github

})
