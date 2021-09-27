$(function () {
    var form = layui.form;
    var layer = layui.layer;
    initCate();

//    1:渲染初始化模板文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("初始化文章分类失败");
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

//     2：初始化富文本
    initEditor();


//     3：封面的裁减
    //  初始化图片裁剪器
    var $image = $('#image')
    //  裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)

//    4:MP:选择封面的按钮绑定点击事件(为的调出隐藏的input）
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').click();
    })
//    5：监听选择事件的input的change事件，获取到选择的文件
    $('#coverFile').on('change', function (e) {
        //获取到用户选择的图片文件
        var files = e.target.files;
        // 判断是否选择了文件
        if (files.length === 0) {
        }
        // 根据图片文件获取文件地址URL
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

//    6:对文章的状态判断
    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

//    7:基于FormData的请求体发布文章更新服务器端数据
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //    基于表达创建一个FormData对象
        // MP:(重要）这里创建了FormData时传入的表单就已经获取到表单中的数据了
        var dataForm = new FormData($(this)[0]);

        // MP：下面的图片和状态是只有最后才知道
        dataForm.append('state', art_state);
        //将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // MP:必须放置在这里
                dataForm.append('cover_img', blob);
                publishArticle(dataForm);
            })
    })

    function publishArticle(dataForm) {

        $.ajax({
            method: 'POST',
            url: '/my/article/add/',
            data: dataForm,
            contentType: false,
            process: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！");
                }
                layer.msg("发布文章成功！");
                location.href = '/article/art_list.html';
            }
        })

    }
})