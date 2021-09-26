$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比(裁剪缩放的大小）
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //2：手动的触发input
    $('#btnChooseImage').on('click', function (e) {
        //手动调用触发input的点击事件
        $('#file').click();
    })
    //        3：选中图片并渲染到页面
    //    MP:在input中监听change事件
    $("#file").on('change', function (e) {
        // MP：获得用户选择文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layui.layer.msg('请选择照片');
        }

        //用户拿到了照片后
        var file = e.target.files[0];
        //MP:将用户选择的文件转为URL地址
        var newImgURL = URL.createObjectURL(file);
        //   MP：先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })
    /*4：将图像发送到服务器端*/
    $('#btnUpload').on('click', function () {
        //将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更换图像失败");
                }
                layui.layer.msg('更新头像成功');
                lay
                window.parent.getUserInfo();
            }


        })
    })
//

})