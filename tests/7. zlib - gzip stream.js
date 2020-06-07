const { performance } = require("perf_hooks");
const fs = require("fs");
const functions = require("../functions.js");

let zlib = require("zlib");

const args = JSON.parse(process.argv[2]);
if(args.dictionary) { args.dictionary = Buffer.from(args.dictionary); }
const dat = fs.readFileSync("./data/" + args.data, "utf8");
const compress = new zlib.Gzip(Object.assign(args,{flush:zlib.constants.Z_SYNC_FLUSH}));
const decompress = new zlib.Gunzip(Object.assign(args,{flush:zlib.constants.Z_SYNC_FLUSH}));

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

	let warmup = performance.now();
	while(performance.now() < warmup + 2000) {
		data = functions.randomize(dat);
		await new Promise(r => {
			promise = r;
			compress.write(data);
		});
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
	console.log(`Gzip Stream x ${avg1.toFixed(2)} ops/sec ± ${dev1.toFixed(2)} (${(avg4 * avg1 / 1024 / 1024).toFixed(3)} MB/s)`);
	console.log(`Gunzip Stream x ${avg2.toFixed(2)} ops/sec ± ${dev2.toFixed(2)} (${(avg3 * avg2 / 1024 / 1024).toFixed(3)} MB/s)`);
	console.log(`Sampled ${ops} chunks (${(total / 1024 / 1024).toFixed(3)} MB) in ${time.toFixed(3)} seconds`);
	console.log(`Average compression ratio: ${(avg3 * 100 / avg4).toFixed(2)}%`);
	console.log(`Average memory usage: ${ram} MB`);

})()