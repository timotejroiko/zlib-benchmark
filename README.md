# zlib-benchmark

Benchmarking zlib compression in node.js and comparing various methods and libraries.

## Tested Libraries

* [zlib](https://nodejs.org/docs/latest-v15.x/api/zlib.html) -
* [fast-zlib](https://github.com/timotejroiko/fast-zlib) v2.0.0
* [zlib-sync](https://github.com/abalabahaha/zlib-sync) v0.1.7
* [pako](https://github.com/nodeca/pako) v2.0.2
* [minizlib](https://github.com/isaacs/minizlib) v2.1.2

## Test List (see `tests` folder)

-- standalone sync compression --

* 1 zlib deflateSync - tests `zlib.deflateSync()` and `zlib.inflateSync()`
* 2 zlib deflateRawSync - tests `zlib.deflateRawSync()` and `zlib.inflateRawSync()`
* 3 zlib gzipSync - tests `zlib.gzipSync()` and `zlib.gunzipSync()`
* 4 zlib brotliSync - tests `zlib.brotliCompressSync()` and `zlib.brotliDecompressSync()`
* 14 pako deflate - tests `pako.inflate()` and `pako.deflate()`
* 15 pako deflateRaw - tests `pako.inflateRaw()` and `pako.deflateRaw()`
* 16 pako gzip - tests `pako.gzip()` and `pako.ungzip()`

-- shared context async compression --

* 5 zlib deflate stream - tests `new zlib.Deflate()` and `new zlib.Inflate()`
* 6 zlib deflateRaw stream - tests `new zlib.DeflateRaw()` and `new zlib.InflateRaw()`
* 7 zlib gzip stream - tests `new zlib.Gzip()` and `new zlib.Gunzip()`
* 8 zlib brotli stream - tests `new zlib.BrotliCompress()` and `new zlib.BrotliDecompress()`

-- shared context sync compression --

* 9 fast-zlib deflate - tests `new fastzlib.Deflate()` and `new fastzlib.Inflate()`
* 10 fast-zlib deflateRaw - tests `new fastzlib.DeflateRaw()` and `new fastzlib.InflateRaw()`
* 11 fast-zlib gzip - tests `new fastzlib.Gzip()` and `new fastzlib.Gunzip()`
* 12 fast-zlib brotliCompress - tests `new fastzlib.BrotliCompress()` and `new fastzlib.BrotliDecompress()`
* 13 zlib-sync inflate - tests `new zlibsync.Inflate()`
* 17 pako deflate stream - tests `new pako.Inflate()`
* 18 pako deflateRaw stream - tests `new pako.Inflate({raw:true})`
* 19 pako gzip stream - tests `new pako.Inflate({gzip:true})`
* 20 minizlib deflate stream - tests `new minizlib.Inflate()` and `new minizlib.Deflate()`
* 21 minizlib deflateRaw stream - tests `new minizlib.InflateRaw()` and `new minizlib.DeflateRaw()`
* 22 minizlib gzip stream - tests `new minizlib.Gzip()` and `new minizlib.Gunzip()`
* 23 minizlib brotli stream - tests `new minizlib.BrotliCompress()` and `new minizlib.BrotliDecompress()`

## Usage

Install or clone this repo, cd into its folder and run:

`node benchmark.js [options]`

## Options

**data** - Name of a json file placed in the `data` folder. All values will be randomized on each sample to simulate real world usage. The keys remain intact (defaults to `small.json`).

**tests** - Comma-delimited list of tests to run.

**[zlib option]** - Any other standard zlib option.

Example:

`node benchmark.js --data=medium.json --chunkSize=128 --tests=1,2,3,4`

(run tests 1 2 3 and 4 on medium.json with a chunkSize of 128 bytes)

## Notes

* Each test is run in a dedicated child process
* Each test does a 2 second warmup run before starting
* The test consists of 10 runs of 1 second each in order to obtain an average and a standard deviation
* Average memory usage is obtained from `process.memoryUsage().rss` in the child process at the end of the test. This is only a rough estimate and may not reflect real world memory usage
* Streams are difficult to benchmark correctly, especially async streams. Their results may be less accurate than other methods
* The tested data consists of a supplied json file with randomized values on each chunk in order to approximate real world usage.

## Sample Results

Tested on an i5 7300HQ 2.5ghz running Node.js v15.4.0

```haskell
node benchmark.js
Benchmarking small.json

1. zlib - deflateSync
DeflateSync x 25400.24 ops/sec ± 470.39 (10.687 MB/s)
InflateSync x 74891.53 ops/sec ± 2357.36 (23.953 MB/s)
Sampled 121827 chunks (51.256 MB) in 10.007 seconds
Average compression ratio: 76.02%
Average memory usage: 61.36 MB

2. zlib - deflateRawSync
DeflateRawSync x 23976.79 ops/sec ± 1708.90 (10.083 MB/s)
InflateRawSync x 66826.92 ops/sec ± 5566.99 (20.980 MB/s)
Sampled 112849 chunks (47.455 MB) in 10.008 seconds
Average compression ratio: 74.65%
Average memory usage: 58.60 MB

3. zlib - gzipSync
GzipSync x 22676.71 ops/sec ± 1505.06 (9.533 MB/s)
GunzipSync x 63257.99 ops/sec ± 7026.65 (20.937 MB/s)
Sampled 106896 chunks (44.934 MB) in 10.008 seconds
Average compression ratio: 78.74%
Average memory usage: 55.36 MB

4. zlib - brotliSync
BrotliCompress x 647.10 ops/sec ± 33.84 (0.272 MB/s)
BrotliDecompress x 24967.71 ops/sec ± 5562.10 (7.598 MB/s)
Sampled 6095 chunks (2.561 MB) in 10.010 seconds
Average compression ratio: 72.42%
Average memory usage: 30.93 MB

5. zlib - deflate stream
Deflate Stream x 17157.83 ops/sec ± 1544.04 (7.209 MB/s)
Inflate Stream x 31263.78 ops/sec ± 3107.25 (7.597 MB/s)
Sampled 77646 chunks (32.624 MB) in 10.015 seconds
Average compression ratio: 57.83%
Average memory usage: 53.82 MB

6. zlib - deflateRaw stream
DeflateRaw Stream x 17279.27 ops/sec ± 2337.75 (7.271 MB/s)
InflateRaw Stream x 31999.10 ops/sec ± 4434.06 (7.791 MB/s)
Sampled 78045 chunks (32.844 MB) in 10.012 seconds
Average compression ratio: 57.86%
Average memory usage: 54.61 MB

7. zlib - gzip stream
Gzip Stream x 17051.15 ops/sec ± 1957.37 (7.175 MB/s)
Gunzip Stream x 30287.39 ops/sec ± 4652.39 (7.376 MB/s)
Sampled 76832 chunks (32.328 MB) in 10.012 seconds
Average compression ratio: 57.87%
Average memory usage: 54.51 MB

8. zlib - brotli stream
BrotliCompress Stream x 639.42 ops/sec ± 37.03 (0.269 MB/s)
BrotliDecompress Stream x 9940.10 ops/sec ± 1822.08 (2.287 MB/s)
Sampled 5798 chunks (2.438 MB) in 10.011 seconds
Average compression ratio: 54.71%
Average memory usage: 58.31 MB

9. fast-zlib - deflate
Deflate x 29842.45 ops/sec ± 1551.95 (12.549 MB/s)
Inflate x 145668.62 ops/sec ± 8418.78 (35.437 MB/s)
Sampled 143051 chunks (60.155 MB) in 10.008 seconds
Average compression ratio: 57.85%
Average memory usage: 61.28 MB

10. fast-zlib - deflateRaw
DeflateRaw x 29804.53 ops/sec ± 2192.32 (12.537 MB/s)
InflateRaw x 149175.79 ops/sec ± 12970.10 (36.306 MB/s)
Sampled 144606 chunks (60.825 MB) in 10.008 seconds
Average compression ratio: 57.86%
Average memory usage: 63.58 MB

11. fast-zlib - gzip
Gzip x 27974.29 ops/sec ± 1053.99 (11.770 MB/s)
Gunzip x 134631.62 ops/sec ± 6162.16 (32.777 MB/s)
Sampled 132634 chunks (55.803 MB) in 10.008 seconds
Average compression ratio: 57.87%
Average memory usage: 61.85 MB

12. fast-zlib - brotli
BrotliCompress x 671.06 ops/sec ± 28.30 (0.282 MB/s)
BrotliDecompress x 47467.06 ops/sec ± 5695.65 (10.751 MB/s)
Sampled 6358 chunks (2.676 MB) in 10.013 seconds
Average compression ratio: 53.81%
Average memory usage: 61.05 MB

13. zlib-sync - deflate
Deflate - not available (zlib-sync does not support compression)
Inflate x 127540.53 ops/sec ± 7482.31 (31.059 MB/s)
Sampled 142303 chunks (59.887 MB) in 10.003 seconds
Average memory usage: 46.59 MB

14. pako - deflate
Deflate x 6384.33 ops/sec ± 364.59 (2.685 MB/s)
Inflate x 40045.09 ops/sec ± 1952.15 (12.803 MB/s)
Sampled 45023 chunks (18.936 MB) in 10.024 seconds
Average compression ratio: 76.02%
Average memory usage: 52.76 MB

15. pako - deflateRaw
DeflateRaw x 6412.28 ops/sec ± 306.58 (2.699 MB/s)
InflateRaw x 27206.21 ops/sec ± 2089.15 (8.549 MB/s)
Sampled 42086 chunks (17.714 MB) in 10.008 seconds
Average compression ratio: 74.66%
Average memory usage: 63.99 MB

16. pako - gzip
Gzip x 6016.89 ops/sec ± 702.60 (2.529 MB/s)
Ungzip x 38031.58 ops/sec ± 3673.65 (12.586 MB/s)
Sampled 42733 chunks (17.963 MB) in 10.007 seconds
Average compression ratio: 78.74%
Average memory usage: 64.91 MB

17. pako - deflate stream
Deflate stream x 13561.53 ops/sec ± 88.34 (5.705 MB/s)
Inflate stream - not available (pako v2 removed support for sync decompression)
Sampled 96169 chunks (40.453 MB) in 10.006 seconds
Average compression ratio: 57.86%
Average memory usage: 50.86 MB

18. pako - deflateRaw stream
Deflate stream x 13461.86 ops/sec ± 337.08 (5.663 MB/s)
Inflate stream - not available (pako v2 removed support for sync decompression)
Sampled 95430 chunks (40.147 MB) in 10.006 seconds
Average compression ratio: 57.87%
Average memory usage: 46.29 MB

19. pako - gzip stream
Deflate stream x 12937.64 ops/sec ± 683.29 (5.440 MB/s)
Inflate stream - not available (pako v2 removed support for sync decompression)
Sampled 91925 chunks (38.651 MB) in 10.006 seconds
Average compression ratio: 57.86%
Average memory usage: 49.34 MB

20. minizlib - deflate stream
Deflate stream x 27404.97 ops/sec ± 544.92 (11.524 MB/s)
Inflate stream x 102600.19 ops/sec ± 2532.22 (24.959 MB/s)
Sampled 133740 chunks (56.238 MB) in 10.007 seconds
Average compression ratio: 57.85%
Average memory usage: 63.06 MB

21. minizlib - deflateRaw stream
DeflateRaw stream x 27848.97 ops/sec ± 233.76 (11.716 MB/s)
InflateRaw stream x 104510.36 ops/sec ± 1684.35 (25.441 MB/s)
Sampled 136428 chunks (57.395 MB) in 10.007 seconds
Average compression ratio: 57.86%
Average memory usage: 62.46 MB

22. minizlib - gzip stream
Gzip stream x 27303.06 ops/sec ± 264.53 (11.488 MB/s)
Gunzip stream x 102541.21 ops/sec ± 2156.34 (24.966 MB/s)
Sampled 134307 chunks (56.512 MB) in 10.007 seconds
Average compression ratio: 57.86%
Average memory usage: 62.04 MB

23. minizlib - brotli stream
BrotliCompress stream x 752.10 ops/sec ± 49.18 (0.316 MB/s)
BrotliDecompress stream x 47502.85 ops/sec ± 6624.71 (10.736 MB/s)
Sampled 7158 chunks (3.010 MB) in 10.009 seconds
Average compression ratio: 53.74%
Average memory usage: 66.30 MB
```

## Findings

* General performance increased about 250% from node 12 to node 15.
* Brotli is extremely slow at compressing, maybe i missed something or there is something wrong with node's implementation.
* Compressing data below a certain size can make the compressed data larger than the actual data (for example compressing a string of 5 characters)
* The chunkSize option can have a substantial effect on decompression performance, especially as data grows larger. Best results were obtained when chunkSize was equal or slightly larger than the compressed data size
* The zlib-sync package seems nearly unaffected by chunkSize
* Sync compression is exponentially faster than Async as data gets smaller
* Performance difference between deflate, deflateRaw and gzip progressively becomes relevant as data size increases, otherwise the difference is negligible
