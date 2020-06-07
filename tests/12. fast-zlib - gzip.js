const { performance } = require("perf_hooks");
const fs = require("fs");
const functions = require("../functions.js");

let zlib;
try {
	zlib = require("fast-zlib");
} catch(e) {
	console.log(__filename.slice(__dirname.length + 1).slice(0,-3) + " (skipping, fast-zlib not installed)");
	process.exit();
}

const args = JSON.parse(process.argv[2]);
if(args.dictionary) { args.dictionary = Buffer.from(args.dictionary); }
const dat = fs.readFileSync("./data/" + args.data, "utf8");
const compress = zlib("gzip",args);
const decompress = zlib("gunzip",args);

let warmup = performance.now();
while(performance.now() < warmup + 2000) {
	let data = functions.randomize(dat);
	let c = compress(data);
	let d = decompress(c);
	if(d.toString() !== data) { throw "data validation failed"; }
}

let result1 = [];
let result2 = [];
let result3 = [];
let result4 = [];
let total = 0;
let ops = 0;
let run = performance.now();
while(performance.now() < run+10000) {
	let s1 = [];
	let s2 = [];
	let s3 = [];
	let s4 = [];
	let sample = performance.now();
	while(performance.now() < sample+1000) {
		let data = functions.randomize(dat);
		s4.push(Buffer.from(data).length);
		let t = performance.now();
		let c = compress(data);
		s1.push(performance.now() - t);
		s3.push(c.length);
		t = performance.now();
		let d = decompress(c);
		s2.push(performance.now() - t);
		if(d.toString() !== data) { throw "data validation failed"; }
		ops++;
	}
	result1.push(1000 / (s1.reduce((a,t) => a+t,0) / s1.length));
	result2.push(1000 / (s2.reduce((a,t) => a+t,0) / s2.length));
	result3.push(s3.reduce((a,t) => a+t,0) / s3.length);
	result4.push(s4.reduce((a,t) => a+t,0) / s4.length);
	total += s4.reduce((a,t) => a+t,0);
}

let time = (performance.now() - run) / 1000;
let avg1 = result1.reduce((a,t) => a+t,0) / result1.length;
let avg2 = result2.reduce((a,t) => a+t,0) / result2.length;
let avg3 = result3.reduce((a,t) => a+t,0) / result3.length;
let avg4 = result4.reduce((a,t) => a+t,0) / result4.length;
let dev1 = functions.dev(avg1,result1);
let dev2 = functions.dev(avg2,result2);
let ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

console.log("\n" + __filename.slice(__dirname.length + 1).slice(0,-3));
console.log(`Gzip x ${avg1.toFixed(2)} ops/sec ± ${dev1.toFixed(2)} (${(avg4 * avg1 / 1024 / 1024).toFixed(3)} MB/s)`);
console.log(`Gunzip x ${avg2.toFixed(2)} ops/sec ± ${dev2.toFixed(2)} (${(avg3 * avg2 / 1024 / 1024).toFixed(3)} MB/s)`);
console.log(`Sampled ${ops} chunks (${(total / 1024 / 1024).toFixed(3)} MB) in ${time.toFixed(3)} seconds`);
console.log(`Average compression ratio: ${(avg3 * 100 / avg4).toFixed(2)}%`);
console.log(`Average memory usage: ${ram} MB`);