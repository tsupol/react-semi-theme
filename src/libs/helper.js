import deepEqual from 'deep-equal';

const helper = {
	/**
	 * Convert Moment to Date
	 *
	 */
	toDate: (moment) => {
		return new Date(moment.format('YYYY/MM/DD H:mm:ss')); // '/' instead of '-' for safari
	},
	/**
	 * Checking react-router for params changes
	 *
	 */
	isParamChanged: (params, nextParams) => { // from Moment to Date
		if (params.length !== nextParams) return true;
		for (let i in nextParams) {
			if (params[i] !== nextParams[i]) return true;
		}
		return false;
	},
	/**
	 * Get height by query string
	 *
	 */
	getHeight: (selector) => {
		let el = document.querySelector(selector);
		return window.getComputedStyle(el).height;
	},
	/**
	 * Get width by query string
	 *
	 */
	getWidth: (selector) => {
		let el = document.querySelector(selector);
		return window.getComputedStyle(el).width;
	},
	/**
	 * Get offsetTop by query string
	 * Useful for resizing operations
	 *
	 */
	getOffsetTop: (selector) => {
		let elem = document.querySelector(selector);
		var offsetTop = 0;
		do {
			if (!isNaN(elem.offsetTop)) {
				offsetTop += elem.offsetTop;
			}
		} while (elem = elem.offsetParent);
		return offsetTop;
	},
	/**
	 * Sadly, if you use add isEqual to Array.prototype it will cause a very confusing bug all over the program.
	 * So I write it here instead.
	 *
	 */
	isArrayEqual: (array1, array2) => {
		return (array1.length == array2.length) &&
			array1.every(function (element, index) {
				return element === array2[index];
			});
	},
	/**
	 * Nested object getter
	 * Better than doing this...
	 * a && a.b && a.b.c ..... just to find the rightmost value
	 *
	 */
	get: (obj, key) => {
		return key.split(".").reduce(function (o, x) {
			return (typeof o == "undefined" || o === null) ? o : o[x];
		}, obj);
	},
	/**
	 * return true if null, undefined, and empty string, array, object
	 *
	 * @param obj
	 * @param key (optional) If specified will use `get`
	 */
	isEmpty: (obj, key) => {
		let value = key ? helper.get(obj, key) : obj;
		// console.log('value', value);
		if (value) {
			// console.log('456', Array.isArray(value), typeof value === 'object', typeof value.getMonth === 'function', Object.keys(value));
			if (Array.isArray(value)) return value.length === 0; // Array
			if (typeof value.getMonth === 'function') return false; // Date Object (special)
			if (typeof value === 'object') return Object.keys(value).length === 0; // Object
			return false;
		}
		return !value;
	},
	/**
	 * Execute function based on `get` above
	 * ex.
	 * helper.execute(this.props, 'settings.actions.create.onClick', param1, param2);
	 *
	 * @param obj
	 * @param key Path to function
	 * @param params (optional) unlimited length
	 */
	execute: (obj, key, ...params) => {
		let f = helper.get(obj, key);
		if (f && typeof f == 'function') {
			f(...params);
		}
	},
	/**
	 * Deep compare both props and state
	 * Compare both state and props
	 */
	deepCompareAll: (instance, nextProps, nextState) => {
		return (
			!deepEqual(instance.props, nextProps) || !deepEqual(instance.state, nextState)
		);
	},
	/**
	 * Deep compare objects
	 * code taken from:
	 * http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
	 */
	deepCompare: (current, next) => {
		// --- Performance Test
		// let t0;
		// t0 = performance.now();
		// // todo: code here
		// console.log("deepCompare " + (performance.now() - t0) + " milliseconds.");
		return (
			!deepEqual(current, next)
		);
	},
	/**
	 * Another compare method
	 * May be faster but wrong if the order of properties are different.
	 */
	jsonDeepCompare: (current, next) => {
		return JSON.stringify(current) == JSON.stringify(next);
	},
	/**
	 * Formatting function to pad numbers to two digits…
	 **/
	twoDigits: (d) => {
		if (0 <= d && d < 10) return "0" + d.toString();
		if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
		return d.toString();
	},
	/**
	 * Check array for an integer value (auto parse int)
	 **/
	hasInt: (array, value) => {
		return array.map(v=>parseInt(v, 10)).indexOf(parseInt(value, 10)) >= 0;
	},
	/**
	 * Check array for an integer value, type insensitive (1 = '1')
	 **/
	has: (array, value) => {
		if(value === null || value === undefined) return false;
		return array.map(v=>{
			if(v === null || v === undefined) return false;
			return v.toString();
		}).indexOf(value.toString()) >= 0;
		// Int based version (Wrong Concept)
		// if (isNaN(parseInt(value, 10))) {
		// 	return array.indexOf(value) >= 0;
		// }
		// return array.map(v=>parseInt(v, 10)).indexOf(parseInt(value, 10)) >= 0;
	},
	/**
	 * Check array for an integer value, type insensitive (1 = '1')
	 **/
	indexOf: (array, value) => {
		if(value === null || value === undefined) return -1;
		return array.map(v=>{
			if(v === null || v === undefined) return -1;
			return v.toString();
		}).indexOf(value.toString());
		// Int based version (Wrong Concept)
		// if (isNaN(parseInt(value, 10))) {
		// 	return array.indexOf(value) >= 0;
		// }
		// return array.map(v=>parseInt(v, 10)).indexOf(parseInt(value, 10)) >= 0;
	},
	/**
	 * Compare 2 integer value (auto parse int)
	 **/
	equalInt: (value1, value2) => {
		return parseInt(value1, 10) === parseInt(value2, 10);
	},
	/**
	 * Type insensitive comparison (1 = '1')
	 **/
	equals: (value1, value2) => {
		if (
			value1 === null || value1 === undefined ||
			value2 === null || value2 === undefined
		) return false;
		return value1.toString() == value2.toString();
		// Int based version (Wrong Concept)
		// if (isNaN(parseInt(value1, 10)) || isNaN(parseInt(value2, 10))) {
		// 	return value1 == value2;
		// }
		// return parseInt(value1, 10) === parseInt(value2, 10);
	},
	/**
	 * Prevent NaN
	 **/
	toInt: (value) => {
		if (isNaN(parseInt(value, 10))) {
			return value;
		}
		return parseInt(value, 10);
	},
	notation: {
		root: {
			b: (bracket_str)=> {
				let index = bracket_str.indexOf('[');
				return bracket_str.substr(0, index!=-1 ? index : bracket_str.length);
			},
			d: (dot_str)=> {
				return dot_str.split('.')[0];
			}
		},
		d2b: (dot_str) => {
			let names = dot_str.split('.');
			return names.length>1 ? `${names[0]}[${names.slice(1, names.length).join('][')}]` : names[0];
		},
		b2d: (bracket_str) => {
			return bracket_str.replace(/\[/g, '.').replace(/\]/g, '');
		}
	},
	object: {
		className: (obj)=> {
			if(obj!==null && typeof obj == "object"){
				return obj.constructor.name;
			}
			return;
		}
	},
	form: {
		setArrayValue: (field, values)=> {
			let keys = [];
			for(let key in values){
				if(typeof values[key] == "string"){
					keys.push([field, key].join('.'));
				}else{
					keys.push(helper.form.setArrayValue(key, values[key]).map((k)=>[field, k].join('.')));
				}
			}
			return keys;
		}
	},
	location: {
		hash: {
			params: ()=> {
				let {hash} = window.location;
				return (hash.split('?')[1] || "").split('&').map((p)=>p.split('=').reduce((a, b)=>Object.assign({}, {[a]: b}))).reduce((a, b)=>Object.assign({}, a, b), {})
			},
			get: (key, defaultValue)=> {
				let value = helper.location.hash.params()[key];
				return value || defaultValue;
			}
		}
	},
	language: {
		laravel2react: (locale, messages, name)=> {
			return {
				[name ? name : locale]: {
					locale,
					messages
				}
			}
		}
	}
};

export default helper;
