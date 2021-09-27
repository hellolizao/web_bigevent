//TODO:无法请求到服务器端date内容，页面页无法显示文章内容。
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    var q = {
        /*pagenum初始的当前的页码值(分页条中显示的页面数字的值），*/
        pagenum: 1,
        /*每页显示多少的数据*/
        pagesize: 2,
        //DP:为什么这可以cate_id是什么？
        /*cata_id分类(String) */
        cate_id: '',
        state: ''
    }

    //1-1:美化时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;

    }

//    1-1-1：补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;

    }

//    1:初始化页面列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                layer.msg("获取文章列表成功");
                //    1-1:使用模板渲染列表
                var htmlStr = template('tpl-table', res);
                console.log(res);
                $('tbody').html(htmlStr);
                //4-1:页面初始化。
                renderPage(res.total)
            }
        })
    }

    initTable();

//2:筛选框中显示文章分类下拉项渲染

    function initCate() {

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/',

            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取分类数据失败");
                }
                layui.layer.msg("获取分类数据成功");

                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //MP:layui表单的重新再次熏染。
                form.render();
            }
        })
    }

    initCate();
    //3:为表单绑定提交事件+根据赛选提交渲染出文章列表。
    $('form-search').on('submit', function (e) {
        e.preventDefault();
        //3-1:根据下拉选项中选中cate_id和name来渲染出指定文章内容
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        console.log(cate_id)
        console.log(state);
        q.cate_id = cate_id;
        q.state = state;
        //3-1-1：根据最新的cate_id和state来渲染表格。
        initTable();
    })

//    4：分页显示条+点击数字实现分页的效果。
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5],
            /*默认被选中页数*/
            curr: q.pagenum,
            //4-2: 分页的效果+解决死循环。
            // MP:first的表明jump的触发的方式是：1：点击页码会回调jump;2:调用renderPge（）方法就会回调jump
            //  不要调用renderpage（）的方式，
            jump: function (obj, first) {
                //获取最新的页面值（显示到第几页数据）
                q.pagenum = obj.curr;
                //渲染最新的条目数。
                q.pagesize = obj.limit
                //    MP：点击分页根据最新的q.pagenum初始化页面
                if (!first) {
                    initTable();
                }
            }
        })
    }

//    5：为删除按钮绑定点击事件（弹出询问的对话框）。
//    MP:注意这里事件委托可以放在tbody上。
    $('tbody').on('click', '.btn-delete', function () {
        layer.confirm('确认删除?', {icon: 3, title: '提示'}, function (index) {
            var id = $(this).attr('data-id');
            //MP：jquery的类选择器如果是多个相同类名那么这个$('')就是为数组的形式。
            var len = $('.btn-delete').length;
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,

                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败");
                    }
                    layer.msg("删除分类成功");
                    //5-1：重新的对请求回来的数据进行渲染
                    //5-1-1:判断当前删除后的显示页是否删除完毕 (对删除按钮还剩一个时的情况做出判断)
                    //MP:1是一个临界点
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        initTable();
                    }
                    layer.close(index);
                }
            })
            layer.close(index);
        });

    })


})