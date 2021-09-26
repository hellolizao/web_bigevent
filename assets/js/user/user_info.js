$(function () {
    var form = layui.form;
    var layer = layui.layer;
//  1：对表单中输入value值进行自定义的名称校验。
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "长度必须在1-6个字符";
            }

        }
    })
    initUserInfo();

//    2：获取用户的信息并大写入到页面中
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户的信息失败')
                }
                console.log(res);
                //    3:将返回用户信息写入到表单中
                form.val('formUserInfo', res.data);
            }
        })

    }
//    4：重置表单
//    MP：重置按钮
    $("#btnReset").on('click', function (e) {
        //重置按钮可以将表单中内容全部的清空
        e.preventDefault();
        initUserInfo();
    })

//    5：提交修改(表单中内容发送到服务器端：表单的提交事件触发）;这里可以触发submit是因为“提交按钮”上带有lay-submit属性。
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新数据失败")
                }
                layer.msg("更新数据成功");
                //    MP：子页面中调用父页面index.js中方法实现同步头像
                //TODO:无法实现头像更新。
                window.parent.getUserInfo();
            }
        })

    })

})