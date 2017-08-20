var sd = require('silly-datetime');/*格式化日期*/

exports.getDate = getDate;


/**
 * 获取当前日期 YYYY-MM-DD
 * @return {[type]} [description]
 */
function getDate(){
	return sd.format(new Date(), 'YYYY-MM-DD');
}


