const fs = require("fs");
const { fork } = require("child_process");
const args = require('minimist')(process.argv.slice(2),{
	string:["data","tests"],
	default:{
		data:"medium.json",
		chunkSize:16*1024,
	}
});

const filter = args.tests ? args.tests.split(",") : [];
const tests = fs.readdirSync("./tests").filter(t => filter.length ? filter.some(s => t.startsWith(s+".")) : true).sort((a,b) => a.split(".")[0] - b.split(".")[0]);

try {
	fs.readFileSync("./data/" + args.data);
} catch(e) {
	throw `test file ${args.data} not found, aborting...`
}

console.log(`Benchmarking ${args.data}`);

(async () => {
	for(let test of tests) {
		await new Promise(r => {
			let c = fork("./tests/" + test, [JSON.stringify(args)]);
			c.on("exit", () => {
				setTimeout(() => r(), 1000);
			});
		});
	}
})();