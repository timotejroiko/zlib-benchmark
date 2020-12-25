"use strict";

const chars = "1234567890 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function dev(avg, array) {
	return Math.sqrt(array.map(t => (t - avg) ** 2).reduce((a, t) => a + t, 0) / array.length);
}

function randomChar() {
	return chars[Math.floor(Math.random() * chars.length)];
}

function r(obj) {
	const keys = Object.keys(obj);
	for(const key of keys) {
		switch(typeof obj[key]) {
			case "object":
				r(obj[key]);
				break;
			case "number":
				obj[key] = Math.random();
				break;
			case "string":
				obj[key] = new Array(Math.round(obj[key].length * (Math.random() * 3))).fill().map(randomChar).join("");
				break;
		}
	}
}

function randomize(data) {
	try {
		const o = JSON.parse(data);
		r(o);
		return JSON.stringify(o);
	} catch(e) {
		return data;
	}
}

module.exports = {
	dev,
	randomize
};
