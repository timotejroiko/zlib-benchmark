/* eslint no-loop-func: "off" */
"use strict";

const { performance } = require("perf_hooks");
const fs = require("fs");
const functions = require("../functions.js");

const zlib = require("zlib");

const args = JSON.parse(process.argv[2]);
if(args.dictionary) { args.dictionary = Buffer.from(args.dictionary); }
const dat = fs.readFileSync(`./data/${args.data}`, "utf8");
const compress = new zlib.DeflateRaw(Object.assign(args, { flush: zlib.constants.Z_SYNC_FLUSH }));
const decompress = new zlib.InflateRaw(Object.assign(args, { flush: zlib.constants.Z_SYNC_FLUSH }));

let data;
let promise;
let t;
let t2;
let t3;
let buffer = "";
let buffer2 = [];
let buffer3;

compress.on("data", d => {
	if(d.length >= 4 && d.readUInt32BE(d.length - 4) === 0xffff) {
		t2 = performance.now();
		buffer2.push(d);
		buffer3 = Buffer.concat(buffer2);
		buffer2 = [];
		t3 = performance.now();
		decompress.write(buffer3);
	} else {
		buffer2.push(d);
	}
});
decompress.on("data", d => {
	buffer += d.toString();
	if(buffer === data) {
		buffer = "";
		promise();
	}
});

(async () => {

	const warmup = performance.now();
	while(performance.now() < warmup + 2000) {
		data = functions.randomize(dat);
		await new Promise(r => {
			promise = r;
			compress.write(data);
		});
	}

	const result1 = [];
	const result2 = [];
	const result3 = [];
	const result4 = [];
	let total = 0;
	let ops = 0;
	const run = performance.now();
	while(performance.now() < run + 10000) {
		const s1 = [];
		const s2 = [];
		const s3 = [];
		const s4 = [];
		const sample = performance.now();
		while(performance.now() < sample + 1000) {
			data = functions.randomize(dat);
			s4.push(Buffer.from(data).length);
			t = performance.now();
			await new Promise(r => {
				promise = r;
				compress.write(data);
			});
			s1.push(t2 - t);
			s2.push(performance.now() - t3);
			s3.push(buffer3.length);
			ops++;
		}
		result1.push(1000 / (s1.reduce((a, z) => a + z, 0) / s1.length));
		result2.push(1000 / (s2.reduce((a, z) => a + z, 0) / s2.length));
		result3.push(s3.reduce((a, z) => a + z, 0) / s3.length);
		result4.push(s4.reduce((a, z) => a + z, 0) / s4.length);
		total += s4.reduce((a, z) => a + z, 0);
	}

	const time = (performance.now() - run) / 1000;
	const avg1 = result1.reduce((a, z) => a + z, 0) / result1.length;
	const avg2 = result2.reduce((a, z) => a + z, 0) / result2.length;
	const avg3 = result3.reduce((a, z) => a + z, 0) / result3.length;
	const avg4 = result4.reduce((a, z) => a + z, 0) / result4.length;
	const dev1 = functions.dev(avg1, result1);
	const dev2 = functions.dev(avg2, result2);
	const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

	console.log(`\n${__filename.slice(__dirname.length + 1).slice(0, -3)}`);
	console.log(`DeflateRaw Stream x ${avg1.toFixed(2)} ops/sec ± ${dev1.toFixed(2)} (${(avg4 * avg1 / 1024 / 1024).toFixed(3)} MB/s)`);
	console.log(`InflateRaw Stream x ${avg2.toFixed(2)} ops/sec ± ${dev2.toFixed(2)} (${(avg3 * avg2 / 1024 / 1024).toFixed(3)} MB/s)`);
	console.log(`Sampled ${ops} chunks (${(total / 1024 / 1024).toFixed(3)} MB) in ${time.toFixed(3)} seconds`);
	console.log(`Average compression ratio: ${(avg3 * 100 / avg4).toFixed(2)}%`);
	console.log(`Average memory usage: ${ram} MB`);

})();
