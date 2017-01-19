//在这里写删除的逻辑
//$(function(){});是$(document).ready(function(){ })的简写.
$(function(){
	$(".del").click(function(e){
		var target=$(e.target);
		var id=target.data("id");
		var tr=$(".item-id-"+id);
		$.ajax({
			type: 'DELETE',
			url: "/admin/movie/list?id=" +id,
			async: true,
			success:function(req){
				if(tr.length>0){
					tr.remove();
				}
			},
			error:function(){
				alert("出错");
			}
		})
	});
});