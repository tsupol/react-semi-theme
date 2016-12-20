Date.prototype.getISODate = function () {
	let month = this.getMonth() + 1;
	if (month < 10) month = '0' + month;
	let day = this.getDate();
	if (day < 10) day = '0' + day;
	return this.getFullYear() + '-' + month + '-' + day;
};
Date.prototype.getTimeAmPm = function () {
	// time
	let hours = this.getHours();
	let minutes = this.getMinutes();
	let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	let strTime = hours + ':' + minutes + '' + ampm;
	return strTime;
};
Date.prototype.getDateTimeStr = function () {
	// date
	let month = this.getMonth() + 1;
	if (month < 10) month = '0' + month;
	let day = this.getDate();
	if (day < 10) day = '0' + day;
	return this.getFullYear() + '-' + month + '-' + day + ' ' + this.getTimeAmPm();
};
Date.prototype.unix = function () {
	return this.getTime() / 1000;
};
Date.prototype.getMonthName = function () {
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	return monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	return monthNames[this.getMonth()];
};
Date.prototype.toMysqlFormat = function () {
	// return this.getUTCFullYear() + "-" + helper.twoDigits(1 + this.getUTCMonth()) + "-" + helper.twoDigits(this.getUTCDate()) + " " + helper.twoDigits(this.getUTCHours()) + ":" + helper.twoDigits(this.getUTCMinutes()) + ":" + helper.twoDigits(this.getUTCSeconds());
	return this.getFullYear() + "-" + helper.twoDigits(1 + this.getMonth()) + "-" + helper.twoDigits(this.getDate()) + " " + helper.twoDigits(this.getHours()) + ":" + helper.twoDigits(this.getMinutes()) + ":" + helper.twoDigits(this.getSeconds());
};
Date.prototype.toMysqlDateFormat = function () {
	return this.getFullYear() + "-" + helper.twoDigits(1 + this.getMonth()) + "-" + helper.twoDigits(this.getDate());
};

String.prototype.has = function (find) {
	let result = this.indexOf(find);
	return result != -1;
};
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

export default {};
