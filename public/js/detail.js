$(function() {
    $('.comment').click(function(e) {
        //先拿到这个锚点自身的dom节点,自身的tid,cid
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');

        //做是否已经插入过的判断,所以给隐藏域再添加一个字段，id，如果已经有了，就赋值
        if ($('#toId').length > 0) {
            $("#toId").val(toId);
        } else {
            //动态插入隐藏域
            $('<input/>').attr({
                type: 'hidden',
                id: 'toId',
                name: 'comment[tid]',
                value: toId
            }).appendTo("#commentForm");
        }

        if ($('#commentId').length > 0) {
            $("#commentId").val(commentId);
        } else {
            $('<input/>').attr({
                type: 'hidden',
                name: 'comment[cid]',
                id: 'commentId',
                value: commentId
            }).appendTo("#commentForm");
        }

    })
})