var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var db = require('./db.js');
var util = require('./util/util.js');
 
request({
		url:'http://news.163.com/', 
		encoding: null  // 关键代码
	}, function (error, response, body) {
		if (!error && response && response.statusCode == '200') {
			var html = iconv.decode(body, 'gb2312')
				var $ = cheerio.load(html, {decodeEntities: false});
			var lists =$('.top_news_ul li a');
			var titleTotal = 0;
			var detailTotal = 0;
			var length = lists.length;
			lists.each(function(index,el){
				let tid = (new Date().getTime()+"").slice(-6);
				let title = $(this).text();
				let href = $(this).attr('href');
				//将概要插入数据库
				let jsonData = {
					"date":new Date().getTime()+Math.floor(Math.random()*99),
					"id":tid,
					"title":title,
					"href":href
				}
				db.insertOne('title',jsonData,function(err,result){
					if (err) {
				  		console.log("插入一条概要失败");
				  	}
				  	if (result.result.ok) {
				  		titleTotal++;
				  		console.log("成功插入一条概要,总共插入"+titleTotal+"条概要");
				  		if (titleTotal == length) {
				  			console.log("插入概要完成");
				  		}
				    }
				})

				//将详情插入数据库
				request({
		  			url:href, 
		  			encoding: null  // 关键代码
				}, function (error, response, body) {
					if (!error && response && response.statusCode == '200') {
						var html = iconv.decode(body, 'gb2312');
		  				var $ = cheerio.load(html, {decodeEntities: false});

		  				var source = $('.post_time_source').text().replace('\n','').trim();
		  				var pLists = $('.post_text').find('p');

		  				var content = [];
		  				pLists.each(function(index,el){
		  					if ($(this).attr('class') =='f_center') {
		  						content.push({"type":"img","src":$(this).find('img').attr('src')});
		  					}else{
								content.push({"type":"text","text":$(this).text().replace('\n','').trim()});
		  					}
						})
		  				let json = {
		  					'title':title,
		  					'source':source,
		  					'id':tid,
					  		'content':content
		  				}
						//插入数据库
						db.insertOne('detail',json,function(err,result){
							if (err) {
						  		console.log("插入一条详情失败");
						  	}
						  	if (result.result.ok) {
						  		detailTotal++;
						  		console.log("成功插入一条详情,总共插入"+detailTotal+"条详情");
						  		if (detailTotal == length) {
						  			console.log("插入详情完成");
						  		}
						    }
						})
					}
				});
				
			})
			


			
		}
});
