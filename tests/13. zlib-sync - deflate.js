"use strict";

const { performance } = require("perf_hooks");
const fs = require("fs");
const functions = require("../functions.js");

let zlib;
try {
	zlib = require("fast-zlib");
} catch(e) {
	console.log(`${__filename.slice(__dirname.length + 1).slice(0, -3)} (skipping, fast-zlib not installed)`);
	process.exit();
}

let zlibsync;
try {
	zlibsync = require("zlib-sync");
} catch(e) {
	console.log(`${__filename.slice(__dirname.length + 1).slice(0, -3)} (skipping, zlib-sync not installed)`);
	process.exit();
}

const args = JSON.parse(process.argv[2]);
if(args.dictionary) { args.dictionary = Buffer.from(args.dictionary); }
const dat = fs.readFileSync(`./data/${args.data}`, "utf8");
const compress = new zlib.Deflate(args);
const decompress = new zlibsync.Inflate(args);

const warmup = performance.now();
while(performance.now() < warmup + 2000) {
	const data = functions.randomize(dat);
	const c = compress.process(data);
	decompress.push(c, 2);
	const d = decompress.result;
	if(d.toString() !== data) { throw new Error("data validation failed"); }
}

const result2 = [];
const result3 = [];
let total = 0;
let ops = 0;
const run = performance.now();
while(performance.now() < run + 10000) {
	const s2 = [];
	const s3 = [];
	const sample = performance.now();
	while(performance.now() < sample + 1000) {
		const data = functions.randomize(dat);
		total += Buffer.from(data).length;
		let t = performance.now();
		const c = compress.process(data);
		s3.push(c.length);
		t = performance.now();
		decompress.push(c, 2);
		const d = decompress.result;
		s2.push(performance.now() - t);
		if(d.toString() !== data) { throw new Error("data validation failed"); }
		ops++;
	}
	result2.push(1000 / (s2.reduce((a, t) => a + t, 0) / s2.length));
	result3.push(s3.reduce((a, t) => a + t, 0) / s3.length);
}

const time = (performance.now() - run) / 1000;
const avg2 = result2.reduce((a, t) => a + t, 0) / result2.length;
const avg3 = result3.reduce((a, t) => a + t, 0) / result3.length;
const dev2 = functions.dev(avg2, result2);
const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

console.log(`\n${__filename.slice(__dirname.length + 1).slice(0, -3)}`);
console.log("Deflate - not available (zlib-sync does not support compression)");
console.log(`Inflate x ${avg2.toFixed(2)} ops/sec ± ${dev2.toFixed(2)} (${(avg3 * avg2 / 1024 / 1024).toFixed(3)} MB/s)`);
console.log(`Sampled ${ops} chunks (${(total / 1024 / 1024).toFixed(3)} MB) in ${time.toFixed(3)} seconds`);
console.log(`Average memory usage: ${ram} MB`);
