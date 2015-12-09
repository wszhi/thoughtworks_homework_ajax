$('document').ready(function(){
	console.log(data);
	$("#book-moredetails").hide();
	var currentCount = 0;
	var defaultCount = 20;
	var ifsearch=0;
	var fields = "id,images,title,url,author,publisher,price,pubdate,summary";
	var tagtitle="儿童文学";
	var bookurl="";
	searchallBook();
	
	$("#top").click(function(){
		$('body').scrollTop(0);
	});
	$(".items").click(function(){
		ifsearch=2;
		document.getElementById('book-list').innerHTML="";
		
		tagtitle=$(this).html();
		currentCount = 0;
		$("#tag-title").html("关于"+$(this).html()+"的书 (豆瓣)");
		searchallBook();
	});
	$(".load-more").bind('click', function(){
		if(ifsearch == 0){
			tagtitle="儿童文学";
			searchallBook();
		}
		else if(ifsearch == 1)
			searchBook();
		else if(ifsearch == 2)
			searchallBook();
	});
	$("#nav-search-btn").bind('click', function(){
		ifsearch=2;
		document.getElementById('book-list').innerHTML="";
		if($("#nav-search-content").val()){
			tagtitle=$("#nav-search-content").val();
			currentCount = 0;
			$("#tag-title").html("关于"+$("#nav-search-content").val()+"的书 (豆瓣)");
			searchallBook();
		}
		else{
			currentCount = 0;
			tagtitle="儿童文学";
			searchallBook();
		}
	});
	$("#search-btn").bind('click', function(){
		ifsearch=1;
		document.getElementById('book-list').innerHTML="";
		if($("#search-content").val()){
			currentCount = 0;
			searchBook();
		}
		else{
			currentCount = 0;
			tagtitle="儿童文学";
			searchallBook();
		}
	});
	function searchallBook(){
		$.ajax({
			type:"get",
			url:"https://api.douban.com/v2/book/search?tag="+tagtitle+"&start="+currentCount+"&fields="+fields,
			dataType: 'jsonp',
			success:function(data){
				moreBook(data);
				currentCount+=defaultCount;
			},
		});
	}
	function searchBook(){
		$.ajax({
			type:"get",
			url:"https://api.douban.com/v2/book/search?q="+$("#search-content").val()+"&start="+currentCount+"&fields="+fields,
			dataType: 'jsonp',
			success:function(data){
				moreBook(data);
				currentCount+=defaultCount;
			},
		});
	}
	function bookinDetail(){
		$.ajax({
			type:"get",
			url:bookurl,
			dataType: 'jsonp',
			success:function(bookdetailsdata){
				morebookdetails(bookdetailsdata);
			},
		});
	}
	function moreBook(data) {
		var bookItems = "";
		$.each(data.books, function(index, book){	
			var bookItem = "<li>"+
                "<img src='"+book.images.medium+"'>"+
                "<div class='book-detail'>"+
                	"<h4 class='bookname' data-detail='"+book.url+"'>"+book.title+"</h4>"+
                    "<p class='book-info'>"+
                        "<span class='author' >"+book.author.join('/')+"/</span>"+
                        "<span class='publisher' >"+book.publisher+"/</span>"+
                        "<span class='price' >"+book.price+"/</span>"+
                        "<span class='pubdate' >"+book.pubdate+"</span></p>"+
                    "</div></li>"
        	
        	bookItems += bookItem;
		
		});
		$("#book-list").append(bookItems);
		$('.bookname').click(function(){
			document.getElementById('book-moredetails').innerHTML="";
			bookurl=$(this).attr("data-detail");
			bookinDetail();
			$("#book-moredetails").show();
		});
		
	}
	
	function morebookdetails(bookdetailsdata){
		var booktags="";
		$.each(bookdetailsdata.tags, function(index, tag){
			var booktag=tag.name;
			booktags +=booktag+" ";
		});
		var bookDetail="<div>"+
			"<img src='"+bookdetailsdata.image+"'>"+
                "<div class='book-details'>"+
                	"<h3 class='book-names' data-detail='"+bookdetailsdata.url+"'>"+bookdetailsdata.title+"</h3>"+
                    "<p class='book-infos'>"+
                        "<span>作者："+bookdetailsdata.author.join('/')+"/</span><br />"+
                        "<span>出版社："+bookdetailsdata.publisher+"</span><br />"+
                        "<span>页数："+bookdetailsdata.pages+"</span><br />"+
                        "<span>价格："+bookdetailsdata.price+"</span><br />"+
                        "<span>出版日期："+bookdetailsdata.pubdate+"</span><br />"+
                        "<span>ISBN："+bookdetailsdata.isbn13+"</span><br /></p>"+
                    "<h4>内容简介……</h4>"+
                    "<div id='summary'>"+bookdetailsdata.summary+"</div><br />"+
                    "<h4>作者简介……</h4>"+
                    "<div id='authorinfo'>"+bookdetailsdata.author_intro+"</div><br />"+
                    "<h4>目录……</h4>"+
                    "<div id='catalog'>"+bookdetailsdata.catalog+"</div><br />"+
                    "<h4>豆瓣成员常用的标签……</h4>"+
                    "<div class='tag'>"+booktags+"</div><br /><button id='back'>返回</button></div></div>";
        
        $("#book-moredetails").append(bookDetail);
        testlength('summary');
        testlength('authorinfo');
        testlength('catalog');
        $("#back").click(function(){
			$("#book-moredetails").hide();
		});
	}
	function testlength(idname){
		var oBox=document.getElementById(idname);
		var demoHtml = oBox.innerHTML.slice(0,300)+'......';
		oBox.innerHTML = demoHtml;
	}
})
