"use strict";

const { performance } = require("perf_hooks");
const fs = require("fs");
const functions = require("../functions.js");

let pako;
try {
	pako = require("pako");
} catch(e) {
	console.log(`${__filename.slice(__dirname.length + 1).slice(0, -3)} (skipping, pako not installed)`);
	process.exit();
}

const args = JSON.parse(process.argv[2]);
if(args.dictionary) { args.dictionary = Buffer.from(args.dictionary); }
const dat = fs.readFileSync(`./data/${args.data}`, "utf8");
const compress = new pako.Deflate(args);
compress.onData = chunk => { X = chunk; };
let X;

const warmup = performance.now();
while(performance.now() < warmup + 2000) {
	const data = functions.randomize(dat);
	compress.push(data, pako.constants.Z_SYNC_FLUSH);
}

const result1 = [];
const result3 = [];
const result4 = [];
let total = 0;
let ops = 0;
const run = performance.now();
while(performance.now() < run + 10000) {
	const s1 = [];
	const s3 = [];
	const s4 = [];
	const sample = performance.now();
	while(performance.now() < sample + 1000) {
		const data = functions.randomize(dat);
		s4.push(Buffer.from(data).length);
		const t = performance.now();
		compress.push(data, pako.constants.Z_SYNC_FLUSH);
		s1.push(performance.now() - t);
		s3.push(X.length);
		ops++;
	}
	result1.push(1000 / (s1.reduce((a, t) => a + t, 0) / s1.length));
	result3.push(s3.reduce((a, t) => a + t, 0) / s3.length);
	result4.push(s4.reduce((a, t) => a + t, 0) / s4.length);
	total += s4.reduce((a, t) => a + t, 0);
}

const time = (performance.now() - run) / 1000;
const avg1 = result1.reduce((a, t) => a + t, 0) / result1.length;
const avg3 = result3.reduce((a, t) => a + t, 0) / result3.length;
const avg4 = result4.reduce((a, t) => a + t, 0) / result4.length;
const dev1 = functions.dev(avg1, result1);
const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

console.log(`\n${__filename.slice(__dirname.length + 1).slice(0, -3)}`);
console.log(`Deflate stream x ${avg1.toFixed(2)} ops/sec ± ${dev1.toFixed(2)} (${(avg4 * avg1 / 1024 / 1024).toFixed(3)} MB/s)`);
console.log("Inflate stream - not available (pako v2 removed support for sync decompression)");
console.log(`Sampled ${ops} chunks (${(total / 1024 / 1024).toFixed(3)} MB) in ${time.toFixed(3)} seconds`);
console.log(`Average compression ratio: ${(avg3 * 100 / avg4).toFixed(2)}%`);
console.log(`Average memory usage: ${ram} MB`);
