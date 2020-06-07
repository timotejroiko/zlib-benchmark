# zlib-benchmark

Benchmarking zlib compression in node.js and comparing various methods and libraries.

**Tested Libraries**

* [zlib](https://nodejs.org/docs/latest-v12.x/api/zlib.html)
* [fast-zlib](https://github.com/timotejroiko/fast-zlib)
* [zlib-sync](https://github.com/abalabahaha/zlib-sync)
* [pako](https://github.com/nodeca/pako)

**Test List** (see `tests` folder)

-- standalone sync compression --

 1. zlib deflateSync - tests `zlib.deflateSync()` and `zlib.inflateSync()`
 2. zlib deflateRawSync - tests `zlib.deflateRawSync()` and `zlib.inflateRawSync()`
 3. zlib gzipSync - tests `zlib.gzipSync()` and `zlib.gunzipSync()`
 4. zlib brotliSync - tests `zlib.brotliCompressSync()` and `zlib.brotliDecompressSync()`
 15. pako deflate - tests `pako.inflate()` and `pako.deflate()`
 16. pako deflateRaw - tests `pako.inflateRaw()` and `pako.deflateRaw()`
 17. pako gzip - tests `pako.gzip()` and `pako.ungzip()`

-- shared context async compression --

 5. zlib deflate stream - tests `new zlib.Deflate()` and `new zlib.Inflate()`
 6. zlib deflateRaw stream - tests `new zlib.DeflateRaw()` and `new zlib.InflateRaw()`
 7. zlib gzip stream - tests `new zlib.Gzip()` and `new zlib.Gunzip()`
 8. zlib brotli stream - tests `new zlib.BrotliCompress()` and `new zlib.BrotliDecompress()`

-- shared context sync compression --

 9. fast-zlib deflate - tests `fastzlib("deflate")` and `fastzlib("inflate")`
 10. fast-zlib deflateRaw - tests `fastzlib("deflateRaw")` and `fastzlib("inflateRaw")`
 11. fast-zlib deflate unsafe - tests `fastzlib("deflate")` and `fastzlib("inflate")` both in unsafe mode
 12. fast-zlib gzip - tests `fastzlib("gzip")` and `fastzlib("gunzip")`
 13. fast-zlib brotliCompress - tests `fastzlib("brotliCompress")` and `fastzlib("brotliDecompress")`
 14. zlib-sync inflate - tests `new zlibsync.Inflate()`
 18. pako deflate stream - tests `new pako.Inflate()` and `new pako.Deflate()`
 19. pako deflateRaw stream - tests `new pako.Inflate({raw:true})` and `new pako.Deflate({raw:true})`
 20. pako gzip stream - tests `new pako.Inflate({gzip:true})` and `new pako.Deflate()`
 21. minizlib deflate stream - tests `new minizlib.Inflate()` and `new minizlib.Deflate()`
 22. minizlib deflateRaw stream - tests `new minizlib.InflateRaw()` and `new minizlib.DeflateRaw()`
 23. minizlib gzip stream - tests `new minizlib.Gzip()` and `new minizlib.Gunzip()`
 24. minizlib brotli stream - tests `new minizlib.BrotliCompress()` and `new minizlib.BrotliDecompress()`



## Usage

Install or clone this repo, cd into its folder and run:

`node benchmark.js [data] [chunk size] [filter]`

**data** - Name of a json file placed in the `data` folder. All values will be randomized on each sample but the keys remain intact (defaults to `medium.json`)

**chunk size** - Integer to define the chunkSize option to be used in all zlib classes (defaults to `16384`)

**filter** - Comma-delimited filter of tests. Tests can be filtered by their number or file name (See the `tests` folder)


Example:

`node benchmark.js small.json 128 1,2,3,4`

(run tests 1 2 3 and 4 on small.json with a chunkSize of 128)



## Sample Results - small.json with default chunkSize

Tested on an i5 7300HQ 2.5ghz running Node.js v12.16.1

```
Benchmarking small.json, with a chunkSize value of 16384

1. zlib - deflateSync
DeflateSync x 10225.39 ops/sec ± 1976.57 (4.299 MB/s)
InflateSync x 21276.71 ops/sec ± 4547.82 (6.800 MB/s)
Sampled 43377 chunks (18.240 MB) in 10.080 seconds
Average compression ratio: 76.01%
Average memory usage: 80.44 MB

2. zlib - deflateRawSync
DeflateRawSync x 10071.50 ops/sec ± 2254.58 (4.233 MB/s)
InflateRawSync x 21385.84 ops/sec ± 5404.90 (6.711 MB/s)
Sampled 41910 chunks (17.612 MB) in 10.010 seconds
Average compression ratio: 74.65%
Average memory usage: 64.18 MB

3. zlib - gzipSync
GzipSync x 11365.29 ops/sec ± 861.80 (4.787 MB/s)
GunzipSync x 24987.46 ops/sec ± 2615.25 (8.287 MB/s)
Sampled 46764 chunks (19.694 MB) in 10.019 seconds
Average compression ratio: 78.74%
Average memory usage: 79.18 MB

4. zlib - brotliSync
BrotliCompress x 428.71 ops/sec ± 56.98 (0.181 MB/s)
BrotliDecompress x 11472.45 ops/sec ± 4072.21 (3.498 MB/s)
Sampled 3927 chunks (1.653 MB) in 10.016 seconds
Average compression ratio: 72.42%
Average memory usage: 74.76 MB

5. zlib - deflate stream
Deflate Stream x 6331.87 ops/sec ± 1570.18 (2.666 MB/s)
Inflate Stream x 9448.15 ops/sec ± 2223.03 (2.302 MB/s)
Sampled 27579 chunks (11.608 MB) in 10.012 seconds
Average compression ratio: 57.87%
Average memory usage: 31.99 MB

6. zlib - deflateRaw stream
DeflateRaw Stream x 7367.59 ops/sec ± 1269.71 (3.098 MB/s)
InflateRaw Stream x 11188.54 ops/sec ± 1999.71 (2.721 MB/s)
Sampled 32135 chunks (13.510 MB) in 10.016 seconds
Average compression ratio: 57.84%
Average memory usage: 41.08 MB

7. zlib - gzip stream
Gzip Stream x 5231.12 ops/sec ± 986.17 (2.197 MB/s)
Gunzip Stream x 7521.85 ops/sec ± 1392.35 (1.827 MB/s)
Sampled 23049 chunks (9.683 MB) in 10.016 seconds
Average compression ratio: 57.83%
Average memory usage: 31.68 MB

9. fast-zlib - deflate
Deflate x 12487.46 ops/sec ± 2096.88 (5.247 MB/s)
Inflate x 40744.57 ops/sec ± 6604.11 (9.902 MB/s)
Sampled 50636 chunks (21.283 MB) in 10.015 seconds
Average compression ratio: 57.83%
Average memory usage: 41.39 MB

10. fast-zlib - deflateRaw
DeflateRaw x 14718.73 ops/sec ± 1345.75 (6.187 MB/s)
InflateRaw x 47952.24 ops/sec ± 4470.54 (11.660 MB/s)
Sampled 59948 chunks (25.201 MB) in 10.011 seconds
Average compression ratio: 57.85%
Average memory usage: 42.70 MB

11. fast-zlib - deflate unsafe
Deflate (unsafe) x 17025.44 ops/sec ± 329.86 (7.162 MB/s)
Inflate (unsafe) x 55293.07 ops/sec ± 1887.68 (13.269 MB/s)
Sampled 68916 chunks (28.989 MB) in 10.010 seconds
Average compression ratio: 57.05%
Average memory usage: 60.88 MB

12. fast-zlib - gzip
Gzip x 14286.00 ops/sec ± 938.78 (6.009 MB/s)
Gunzip x 42578.40 ops/sec ± 2263.08 (10.363 MB/s)
Sampled 56608 chunks (23.811 MB) in 10.016 seconds
Average compression ratio: 57.86%
Average memory usage: 42.59 MB

13. fast-zlib - brotli
BrotliCompress x 484.98 ops/sec ± 55.87 (0.203 MB/s)
BrotliDecompress x 25849.50 ops/sec ± 6527.42 (5.824 MB/s)
Sampled 4523 chunks (1.895 MB) in 10.012 seconds
Average compression ratio: 53.75%
Average memory usage: 48.63 MB

14. zlib-sync - deflate
Inflate x 43476.66 ops/sec ± 1222.04 (10.574 MB/s)
Sampled 64880 chunks (27.275 MB) in 10.021 seconds
Average memory usage: 41.79 MB

15. pako - deflate
Deflate x 3979.18 ops/sec ± 549.22 (1.671 MB/s)
Inflate x 17327.43 ops/sec ± 2549.04 (5.532 MB/s)
Sampled 24899 chunks (10.458 MB) in 10.022 seconds
Average compression ratio: 76.01%
Average memory usage: 86.06 MB

16. pako - deflateRaw
DeflateRaw x 3912.71 ops/sec ± 486.80 (1.645 MB/s)
InflateRaw x 13707.63 ops/sec ± 2316.47 (4.302 MB/s)
Sampled 23593 chunks (9.919 MB) in 10.008 seconds
Average compression ratio: 74.65%
Average memory usage: 89.89 MB

17. pako - gzip
Gzip x 3306.65 ops/sec ± 692.57 (1.389 MB/s)
Ungzip x 14466.42 ops/sec ± 3767.74 (4.786 MB/s)
Sampled 20816 chunks (8.744 MB) in 10.014 seconds
Average compression ratio: 78.73%
Average memory usage: 81.50 MB

18. pako - deflate stream
Deflate stream x 8046.63 ops/sec ± 1129.91 (3.379 MB/s)
Inflate stream x 22575.28 ops/sec ± 3331.89 (5.482 MB/s)
Sampled 38246 chunks (16.063 MB) in 10.014 seconds
Average compression ratio: 57.83%
Average memory usage: 52.59 MB

19. pako - deflateRaw stream
DeflateRaw stream x 8600.66 ops/sec ± 286.87 (3.617 MB/s)
InflateRaw stream x 24767.14 ops/sec ± 1063.89 (6.026 MB/s)
Sampled 41235 chunks (17.339 MB) in 10.008 seconds
Average compression ratio: 57.86%
Average memory usage: 56.66 MB

20. pako - gzip stream
Gzip stream x 7047.13 ops/sec ± 607.91 (2.963 MB/s)
Inflate stream x 20104.10 ops/sec ± 804.81 (4.889 MB/s)
Sampled 33699 chunks (14.167 MB) in 10.012 seconds
Average compression ratio: 57.84%
Average memory usage: 49.07 MB

21. minizlib - deflate stream
Deflate stream x 12505.45 ops/sec ± 2165.27 (5.266 MB/s)
Inflate stream x 34000.87 ops/sec ± 5144.76 (8.289 MB/s)
Sampled 51953 chunks (21.882 MB) in 10.034 seconds
Average compression ratio: 57.89%
Average memory usage: 43.03 MB

22. minizlib - deflateRaw stream
DeflateRaw stream x 10753.11 ops/sec ± 3124.50 (4.523 MB/s)
InflateRaw stream x 28415.98 ops/sec ± 9431.34 (6.916 MB/s)
Sampled 44270 chunks (18.618 MB) in 10.012 seconds
Average compression ratio: 57.86%
Average memory usage: 42.01 MB

23. minizlib - gzip stream
Gzip stream x 12632.33 ops/sec ± 932.77 (5.319 MB/s)
Gunzip stream x 33586.29 ops/sec ± 1743.34 (8.186 MB/s)
Sampled 52193 chunks (21.975 MB) in 10.010 seconds
Average compression ratio: 57.89%
Average memory usage: 43.20 MB

24. minizlib - brotli stream
BrotliCompress stream x 432.58 ops/sec ± 60.64 (0.182 MB/s)
BrotliDecompress stream x 13985.84 ops/sec ± 4486.16 (3.155 MB/s)
Sampled 3980 chunks (1.670 MB) in 10.033 seconds
Average compression ratio: 53.77%
Average memory usage: 47.55 MB
```

## Notes

* Each test is run in a dedicated child process
* Each test does a 2 second warmup run before starting
* The test fires 10 runs of 1 second each in order to obtain an average and a standard deviation
* Average memory usage measures `process.memoryUsage.rss()` in the child process at the end of the test. This is only a rough estimate and may not reflect real world memory usage
* Streams are difficult to benchmark correctly, especially async streams. Their results may be less accurate than sync methods
* The tested data consists of fields from the supplied json file with randomized values on each sample in order to make a real world usage approximation.
* I have attempted to use the well known benchmark.js library but was not able to obtain good results with it. The current manual benchmark produces more consistent results


## Findings

* Brotli is extremely slow at compressing, maybe i missed something or there is something wrong with node's implementation.
* Standalone sync is the best at compressing large amounts of data
* Shared context sync is the best at decompressing small amounts of data
* Compressing data below a certain size can make the compressed data larger than the actual data
* The chunkSize option can have a substantial effect on decompression performance. The best results were obtained when chunkSize was equal or slightly larger than the data size