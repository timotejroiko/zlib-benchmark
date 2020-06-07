# zlib-benchmark

Benchmarking zlib compression in node.js and comparing various methods and libraries.

**Tested Libraries**

* [zlib](https://nodejs.org/docs/latest-v12.x/api/zlib.html)
* [fast-zlib](https://github.com/timotejroiko/fast-zlib)
* [zlib-sync](https://github.com/abalabahaha/zlib-sync)
* [pako](https://github.com/nodeca/pako)

**Test List** (see `tests` folder)

-- standalone sync compression --
* 1. zlib deflateSync - tests `zlib.deflateSync()` and `zlib.inflateSync()`
* 2. zlib deflateRawSync - tests `zlib.deflateRawSync()` and `zlib.inflateRawSync()`
* 3. zlib gzipSync - tests `zlib.gzipSync()` and `zlib.gunzipSync()`
* 4. zlib brotliSync - tests `zlib.brotliCompressSync()` and `zlib.brotliDecompressSync()`
* 15. pako deflate - tests `pako.inflate()` and `pako.deflate()`
* 16. pako deflateRaw - tests `pako.inflateRaw()` and `pako.deflateRaw()`
* 17. pako gzip - tests `pako.gzip()` and `pako.ungzip()`

-- shared context async compression --
* 5. zlib deflate stream - tests `new zlib.Deflate()` and `new zlib.Inflate()`
* 6. zlib deflateRaw stream - tests `new zlib.DeflateRaw()` and `new zlib.InflateRaw()`
* 7. zlib gzip stream - tests `new zlib.Gzip()` and `new zlib.Gunzip()`
* 8. zlib brotli stream - tests `new zlib.BrotliCompress()` and `new zlib.BrotliDecompress()`

-- shared context sync compression --
* 9. fast-zlib deflate - tests `fastzlib("deflate")` and `fastzlib("inflate")`
* 10. fast-zlib deflateRaw - tests `fastzlib("deflateRaw")` and `fastzlib("inflateRaw")`
* 11. fast-zlib deflate unsafe - tests `fastzlib("deflate")` and `fastzlib("inflate")` both in unsafe mode
* 12. fast-zlib gzip - tests `fastzlib("gzip")` and `fastzlib("gunzip")`
* 13. fast-zlib brotliCompress - tests `fastzlib("brotliCompress")` and `fastzlib("brotliDecompress")`
* 14. zlib-sync inflate - tests `new zlibsync.Inflate()`
* 18. pako deflate stream - tests `new pako.Inflate()` and `new pako.Deflate()`
* 19. pako deflateRaw stream - tests `new pako.Inflate({raw:true})` and `new pako.Deflate({raw:true})`
* 20. pako gzip stream - tests `new pako.Inflate({gzip:true})` and `new pako.Deflate()`
* 21. minizlib deflate stream - tests `new minizlib.Inflate()` and `new minizlib.Deflate()`
* 22. minizlib deflateRaw stream - tests `new minizlib.InflateRaw()` and `new minizlib.DeflateRaw()`
* 23. minizlib gzip stream - tests `new minizlib.Gzip()` and `new minizlib.Gunzip()`
* 24. minizlib brotli stream - tests `new minizlib.BrotliCompress()` and `new minizlib.BrotliDecompress()`



## Usage

Install or clone this repo and cd into its folder. Then run:

`node benchmark.js [data] [chunk size] [filter]`

**data** - Name of a json file placed in the `data` folder. All values will be randomized on each sample but the keys remain intact (defaults to `medium.json`)

**chunk size** - Integer to define the chunkSize option to be used in all zlib classes (defaults to `16384`)

**filter** - Comma-delimited filter of tests. Tests can be filtered by their number or file name (See the `tests` folder)


Example:

`node benchmark.js small.json 128 1,2,3,4`

(run tests 1 2 3 and 4 on the small.json template with a chunkSize of 128)



## Sample Results - medium.json

Tested on an i5 7300HQ 2.5ghz

```
Benchmarking 1024 bytes of random data per chunk, with a chunkSize value of 16384

fast-zlib - brotli
BrotliCompress x 547.22 ops/sec ± 31.96 (0.534 MB/s)
BrotliDecompress x 33207.83 ops/sec ± 2885.93 (24.821 MB/s)
Sampled 5075 chunks (4.956 MB) in 10.010 seconds
Average compression ratio: 76.54%
Average memory usage: 72.49 MB

fast-zlib - deflate unsafe
Deflate (unsafe) x 10114.88 ops/sec ± 105.58 (9.878 MB/s)
Inflate (unsafe) x 43465.06 ops/sec ± 1909.35 (33.136 MB/s)
Sampled 44737 chunks (43.688 MB) in 10.007 seconds
Average compression ratio: 78.07%
Average memory usage: 57.07 MB

fast-zlib - deflate
Deflate x 9645.19 ops/sec ± 1147.54 (9.419 MB/s)
Inflate x 41458.96 ops/sec ± 3161.64 (31.747 MB/s)
Sampled 43019 chunks (42.011 MB) in 10.008 seconds
Average compression ratio: 78.41%
Average memory usage: 57.46 MB

fast-zlib - deflateRaw
Deflate x 9960.44 ops/sec ± 381.15 (9.727 MB/s)
Inflate x 42134.09 ops/sec ± 2731.65 (32.264 MB/s)
Sampled 44179 chunks (43.144 MB) in 10.007 seconds
Average compression ratio: 78.41%
Average memory usage: 57.00 MB

fast-zlib - gzip
Gzip x 9908.22 ops/sec ± 248.24 (9.676 MB/s)
Gunzip x 41392.61 ops/sec ± 1045.13 (31.697 MB/s)
Sampled 44314 chunks (43.275 MB) in 10.018 seconds
Average compression ratio: 78.41%
Average memory usage: 42.89 MB

pako
Deflate x 4242.15 ops/sec ± 487.55 (3.224 MB/s)
Inflate x 18679.31 ops/sec ± 2440.14 (14.194 MB/s)
Sampled 24798 chunks (24.217 MB) in 10.022 seconds
Average compression ratio: 77.81%
Average memory usage: 83.93 MB

zlib - brotli stream
BrotliCompress Stream x 499.91 ops/sec ± 29.27 (0.488 MB/s)
BrotliDecompress Stream x 12015.37 ops/sec ± 530.62 (11.017 MB/s)
Sampled 4721 chunks (4.610 MB) in 10.016 seconds
Average compression ratio: 93.89%
Average memory usage: 73.84 MB

zlib - brotliSync
BrotliCompressSync x 828.00 ops/sec ± 31.94 (0.809 MB/s)
BrotliDecompressSync x 21907.26 ops/sec ± 5453.86 (16.377 MB/s)
Sampled 7277 chunks (7.106 MB) in 10.010 seconds
Average compression ratio: 76.55%
Average memory usage: 100.38 MB

zlib - deflate stream
Deflate Stream x 4314.02 ops/sec ± 100.16 (4.213 MB/s)
Inflate Stream x 14769.92 ops/sec ± 618.91 (13.606 MB/s)
Sampled 30099 chunks (29.394 MB) in 10.007 seconds
Average compression ratio: 94.33%
Average memory usage: 45.79 MB

zlib - deflateRaw stream
DeflateRaw Stream x 4263.90 ops/sec ± 128.79 (4.164 MB/s)
InflateRaw Stream x 14989.17 ops/sec ± 479.09 (13.860 MB/s)
Sampled 29605 chunks (28.911 MB) in 10.009 seconds
Average compression ratio: 94.69%
Average memory usage: 45.25 MB

zlib - deflateRawSync
DeflateSync x 14745.83 ops/sec ± 298.75 (14.400 MB/s)
InflateSync x 31015.90 ops/sec ± 3855.69 (23.391 MB/s)
Sampled 47239 chunks (46.132 MB) in 10.026 seconds
Average compression ratio: 77.23%
Average memory usage: 74.00 MB

zlib - deflateSync
DeflateSync x 14144.50 ops/sec ± 511.26 (13.813 MB/s)
InflateSync x 34111.73 ops/sec ± 1893.89 (25.921 MB/s)
Sampled 47735 chunks (46.616 MB) in 10.011 seconds
Average compression ratio: 77.81%
Average memory usage: 67.44 MB

zlib - gzip stream
Gzip Stream x 4254.23 ops/sec ± 112.77 (4.155 MB/s)
Gunzip Stream x 14541.61 ops/sec ± 801.28 (13.499 MB/s)
Sampled 29834 chunks (29.135 MB) in 10.007 seconds
Average compression ratio: 95.06%
Average memory usage: 46.42 MB

zlib - gzipSync
GzipSync x 13910.72 ops/sec ± 419.67 (13.585 MB/s)
GunzipSync x 31456.76 ops/sec ± 1806.57 (24.264 MB/s)
Sampled 47154 chunks (46.049 MB) in 10.016 seconds
Average compression ratio: 78.99%
Average memory usage: 66.74 MB

zlib-sync
Inflate x 39899.67 ops/sec ± 2225.26 (30.553 MB/s)
Sampled 44526 chunks (43.482 MB) in 10.006 seconds
Average compression ratio: 78.41%
Average memory usage: 40.40 MB
```

## Sample results - 10 bytes of random data

```
Benchmarking 10 bytes of random data per chunk, with a chunkSize value of 16384

fast-zlib - brotli
BrotliCompress x 2764.26 ops/sec ± 49.39 (0.026 MB/s)
BrotliDecompress x 99519.61 ops/sec ± 4460.58 (1.234 MB/s)
Sampled 25119 chunks (0.240 MB) in 10.006 seconds
Average compression ratio: 130.00%
Average memory usage: 29.59 MB

fast-zlib - deflate unsafe
Deflate (unsafe) x 78258.84 ops/sec ± 1113.16 (0.746 MB/s)
Inflate (unsafe) x 123435.16 ops/sec ± 4188.31 (1.464 MB/s)
Sampled 225399 chunks (2.150 MB) in 10.036 seconds
Average compression ratio: 124.37%
Average memory usage: 56.93 MB

fast-zlib - deflate
Deflate x 71861.44 ops/sec ± 1914.00 (0.685 MB/s)
Inflate x 116568.41 ops/sec ± 4819.48 (1.775 MB/s)
Sampled 216490 chunks (2.065 MB) in 10.049 seconds
Average compression ratio: 159.67%
Average memory usage: 55.20 MB

fast-zlib - deflateRaw
Deflate x 71269.77 ops/sec ± 4031.12 (0.680 MB/s)
Inflate x 113573.31 ops/sec ± 5316.31 (1.729 MB/s)
Sampled 212895 chunks (2.030 MB) in 10.024 seconds
Average compression ratio: 159.66%
Average memory usage: 55.38 MB

fast-zlib - gzip
Gzip x 72967.80 ops/sec ± 2701.25 (0.696 MB/s)
Gunzip x 117862.14 ops/sec ± 2146.04 (1.795 MB/s)
Sampled 219551 chunks (2.094 MB) in 10.076 seconds
Average compression ratio: 159.67%
Average memory usage: 56.23 MB

pako
Deflate x 4634.39 ops/sec ± 657.33 (0.080 MB/s)
Inflate x 26462.73 ops/sec ± 3454.24 (0.454 MB/s)
Sampled 34845 chunks (0.332 MB) in 10.010 seconds
Average compression ratio: 180.00%
Average memory usage: 92.99 MB

zlib - brotli stream
BrotliCompress Stream x 2039.09 ops/sec ± 58.35 (0.019 MB/s)
BrotliDecompress Stream x 20999.68 ops/sec ± 1196.75 (0.310 MB/s)
Sampled 19261 chunks (0.184 MB) in 10.006 seconds
Average compression ratio: 154.72%
Average memory usage: 33.02 MB

zlib - brotliSync
BrotliCompressSync x 1633.83 ops/sec ± 42.86 (0.016 MB/s)
BrotliDecompressSync x 26204.37 ops/sec ± 5241.64 (0.350 MB/s)
Sampled 14736 chunks (0.141 MB) in 10.006 seconds
Average compression ratio: 140.00%
Average memory usage: 98.75 MB

zlib - deflate stream
Deflate Stream x 8385.56 ops/sec ± 261.39 (0.080 MB/s)
Inflate Stream x 22326.76 ops/sec ± 548.83 (0.414 MB/s)
Sampled 68331 chunks (0.652 MB) in 10.010 seconds
Average compression ratio: 194.66%
Average memory usage: 41.27 MB

zlib - deflateRaw stream
DeflateRaw Stream x 8332.78 ops/sec ± 293.05 (0.079 MB/s)
InflateRaw Stream x 22155.39 ops/sec ± 903.28 (0.417 MB/s)
Sampled 67938 chunks (0.648 MB) in 10.013 seconds
Average compression ratio: 197.35%
Average memory usage: 40.96 MB

zlib - deflateRawSync
DeflateSync x 19136.68 ops/sec ± 387.23 (0.183 MB/s)
InflateSync x 35935.27 ops/sec ± 1912.00 (0.411 MB/s)
Sampled 95084 chunks (0.907 MB) in 10.018 seconds
Average compression ratio: 120.00%
Average memory usage: 56.44 MB

zlib - deflateSync
DeflateSync x 19427.02 ops/sec ± 949.58 (0.185 MB/s)
InflateSync x 35383.03 ops/sec ± 1997.86 (0.607 MB/s)
Sampled 96034 chunks (0.916 MB) in 10.021 seconds
Average compression ratio: 180.00%
Average memory usage: 66.48 MB

zlib - gzip stream
Gzip Stream x 8304.49 ops/sec ± 311.47 (0.079 MB/s)
Gunzip Stream x 22133.82 ops/sec ± 597.89 (0.410 MB/s)
Sampled 67844 chunks (0.647 MB) in 10.010 seconds
Average compression ratio: 194.32%
Average memory usage: 41.28 MB

zlib - gzipSync
GzipSync x 17389.48 ops/sec ± 1006.36 (0.166 MB/s)
GunzipSync x 34615.67 ops/sec ± 3125.29 (0.990 MB/s)
Sampled 89588 chunks (0.854 MB) in 10.063 seconds
Average compression ratio: 300.00%
Average memory usage: 56.06 MB

zlib-sync
Inflate x 113567.84 ops/sec ± 6810.21 (1.729 MB/s)
Sampled 259039 chunks (2.470 MB) in 10.005 seconds
Average compression ratio: 159.66%
Average memory usage: 42.23 MB
```

## Notes

* Each test is run in a dedicated child process, with a 1 second cooldown between tests
* Each test does a 2 second warmup run before beginning
* The test uses 10 runs of 1 second each to obtain its average and standard deviation
* Memory usage indicates the total process.memoryUsage.rss() value consumed by the child process at the end of the test. This is only a rough estimate and does not accurately reflect real world memory usage
* Streams are difficult to benchmark correctly so their results may be less accurate than others
* The data used in all tests consists of strings of random characters, which results in worse compression ratios and performance. Real world applications may have better performance due to predictable data patterns
* I have attempted to use benchmark.js but was not able to obtain good results with it. The current manual benchmark produces more consistent results

## Findings

* Brotli is extremely slow at compressing, but very fast at decompressing
* Standalone sync is the best at compressing large amounts of data
* Shared context sync is the best at decompressing small amounts of data
* Compressing data below a certain size can make the compressed data larger than the actual data
* The chunkSize option can have a substantial effect on performance depending on the situation