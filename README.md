# zlib-benchmark

Benchmarking zlib compression in node.js and comparing various methods and libraries.

**Tested Libraries**

* [zlib](https://nodejs.org/docs/latest-v12.x/api/zlib.html)
* [fast-zlib](https://github.com/timotejroiko/fast-zlib)
* [zlib-sync](https://github.com/abalabahaha/zlib-sync)
* [pako](https://github.com/nodeca/pako)



**Test List** (see `tests` folder)

-- standalone sync compression --
* 1 zlib deflateSync - tests `zlib.deflateSync()` and `zlib.inflateSync()`
* 2 zlib deflateRawSync - tests `zlib.deflateRawSync()` and `zlib.inflateRawSync()`
* 3 zlib gzipSync - tests `zlib.gzipSync()` and `zlib.gunzipSync()`
* 4 zlib brotliSync - tests `zlib.brotliCompressSync()` and `zlib.brotliDecompressSync()`
* 15 pako deflate - tests `pako.inflate()` and `pako.deflate()`
* 16 pako deflateRaw - tests `pako.inflateRaw()` and `pako.deflateRaw()`
* 17 pako gzip - tests `pako.gzip()` and `pako.ungzip()`

-- shared context async compression --
* 5 zlib deflate stream - tests `new zlib.Deflate()` and `new zlib.Inflate()`
* 6 zlib deflateRaw stream - tests `new zlib.DeflateRaw()` and `new zlib.InflateRaw()`
* 7 zlib gzip stream - tests `new zlib.Gzip()` and `new zlib.Gunzip()`
* 8 zlib brotli stream - tests `new zlib.BrotliCompress()` and `new zlib.BrotliDecompress()`

-- shared context sync compression --
* 9 fast-zlib deflate - tests `fastzlib("deflate")` and `fastzlib("inflate")`
* 10 fast-zlib deflateRaw - tests `fastzlib("deflateRaw")` and `fastzlib("inflateRaw")`
* 11 fast-zlib deflate unsafe - tests `fastzlib("deflate")` and `fastzlib("inflate")` both in unsafe mode
* 12 fast-zlib gzip - tests `fastzlib("gzip")` and `fastzlib("gunzip")`
* 13 fast-zlib brotliCompress - tests `fastzlib("brotliCompress")` and `fastzlib("brotliDecompress")`
* 14 zlib-sync inflate - tests `new zlibsync.Inflate()`
* 18 pako deflate stream - tests `new pako.Inflate()` and `new pako.Deflate()`
* 19 pako deflateRaw stream - tests `new pako.Inflate({raw:true})` and `new pako.Deflate({raw:true})`
* 20 pako gzip stream - tests `new pako.Inflate({gzip:true})` and `new pako.Deflate()`
* 21 minizlib deflate stream - tests `new minizlib.Inflate()` and `new minizlib.Deflate()`
* 22 minizlib deflateRaw stream - tests `new minizlib.InflateRaw()` and `new minizlib.DeflateRaw()`
* 23 minizlib gzip stream - tests `new minizlib.Gzip()` and `new minizlib.Gunzip()`
* 24 minizlib brotli stream - tests `new minizlib.BrotliCompress()` and `new minizlib.BrotliDecompress()`



## Usage

Install or clone this repo, cd into its folder and run:

`node benchmark.js [options]`

**data** - Name of a json file placed in the `data` folder. All values will be randomized on each sample but the keys remain intact (defaults to `medium.json`)

**tests** - Comma-delimited filter of tests. Tests can be filtered by their number or file name (See the `tests` folder)

**[zlib option]** - Any other standard zlib option


Example:

`node benchmark.js --data=small.json --chunkSize=128 --tests=1,2,3,4`

(run tests 1 2 3 and 4 on small.json with a chunkSize of 128)



## Notes

* Each test is run in a dedicated child process
* Each test does a 2 second warmup run before starting
* The test consists of 10 runs of 1 second each in order to obtain an average and a standard deviation
* Average memory usage is obtained from `process.memoryUsage.rss()` in the child process at the end of the test. This is only a rough estimate and may not reflect real world memory usage
* Streams are difficult to benchmark correctly, especially async streams. Their results may be less accurate than other methods
* The tested data consists of a supplied json file with randomized values on each chunk in order to approximate real world usage.



## Sample Results

Tested on an i5 7300HQ 2.5ghz running Node.js v12.16.1

```
Benchmarking small.json

1. zlib - deflateSync
DeflateSync x 10968.89 ops/sec ± 796.26 (4.610 MB/s)
InflateSync x 26211.44 ops/sec ± 2986.66 (8.375 MB/s)
Sampled 47028 chunks (19.767 MB) in 10.013 seconds
Average compression ratio: 76.02%
Average memory usage: 79.29 MB

2. zlib - deflateRawSync
DeflateRawSync x 10960.82 ops/sec ± 753.67 (4.610 MB/s)
InflateRawSync x 24143.13 ops/sec ± 3384.77 (7.581 MB/s)
Sampled 45987 chunks (19.344 MB) in 10.038 seconds
Average compression ratio: 74.65%
Average memory usage: 71.79 MB

3. zlib - gzipSync
GzipSync x 10628.02 ops/sec ± 329.51 (4.469 MB/s)
GunzipSync x 21188.36 ops/sec ± 970.31 (7.014 MB/s)
Sampled 44441 chunks (18.686 MB) in 10.009 seconds
Average compression ratio: 78.73%
Average memory usage: 76.68 MB

4. zlib - brotliSync
BrotliCompress x 439.51 ops/sec ± 12.41 (0.185 MB/s)
BrotliDecompress x 10523.37 ops/sec ± 2197.02 (3.207 MB/s)
Sampled 4012 chunks (1.689 MB) in 10.017 seconds
Average compression ratio: 72.41%
Average memory usage: 82.09 MB

5. zlib - deflate stream
Deflate Stream x 7841.97 ops/sec ± 189.92 (3.300 MB/s)
Inflate Stream x 11958.65 ops/sec ± 409.98 (2.912 MB/s)
Sampled 33407 chunks (14.058 MB) in 10.015 seconds
Average compression ratio: 57.87%
Average memory usage: 41.09 MB

6. zlib - deflateRaw stream
DeflateRaw Stream x 8077.28 ops/sec ± 179.42 (3.397 MB/s)
InflateRaw Stream x 12363.92 ops/sec ± 488.99 (3.009 MB/s)
Sampled 34326 chunks (14.436 MB) in 10.009 seconds
Average compression ratio: 57.86%
Average memory usage: 41.39 MB

7. zlib - gzip stream
Gzip Stream x 7834.07 ops/sec ± 592.74 (3.292 MB/s)
Gunzip Stream x 11909.33 ops/sec ± 853.15 (2.895 MB/s)
Sampled 33528 chunks (14.087 MB) in 10.011 seconds
Average compression ratio: 57.84%
Average memory usage: 41.11 MB

8. zlib - brotli stream
BrotliCompress Stream x 476.38 ops/sec ± 13.69 (0.200 MB/s)
BrotliDecompress Stream x 6956.44 ops/sec ± 924.68 (1.600 MB/s)
Sampled 4237 chunks (1.782 MB) in 10.015 seconds
Average compression ratio: 54.70%
Average memory usage: 48.35 MB

9. fast-zlib - deflate
Deflate x 14328.70 ops/sec ± 749.38 (6.027 MB/s)
Inflate x 45263.89 ops/sec ± 2054.89 (11.017 MB/s)
Sampled 57985 chunks (24.393 MB) in 10.011 seconds
Average compression ratio: 57.86%
Average memory usage: 42.39 MB

10. fast-zlib - deflateRaw
DeflateRaw x 14637.64 ops/sec ± 312.55 (6.157 MB/s)
InflateRaw x 47182.48 ops/sec ± 1241.05 (11.482 MB/s)
Sampled 58887 chunks (24.769 MB) in 10.010 seconds
Average compression ratio: 57.86%
Average memory usage: 42.76 MB

11. fast-zlib - deflate unsafe
Deflate (unsafe) x 15846.46 ops/sec ± 259.28 (6.660 MB/s)
Inflate (unsafe) x 48774.89 ops/sec ± 1338.21 (11.692 MB/s)
Sampled 62275 chunks (26.173 MB) in 10.010 seconds
Average compression ratio: 57.04%
Average memory usage: 42.31 MB

12. fast-zlib - gzip
Gzip x 14455.17 ops/sec ± 339.74 (6.084 MB/s)
Gunzip x 43610.31 ops/sec ± 1297.90 (10.623 MB/s)
Sampled 58496 chunks (24.620 MB) in 10.011 seconds
Average compression ratio: 57.88%
Average memory usage: 42.88 MB

13. fast-zlib - brotli
BrotliCompress x 497.11 ops/sec ± 13.07 (0.209 MB/s)
BrotliDecompress x 26388.45 ops/sec ± 2009.81 (5.978 MB/s)
Sampled 4631 chunks (1.949 MB) in 10.015 seconds
Average compression ratio: 53.82%
Average memory usage: 50.06 MB

14. zlib-sync - deflate
Inflate x 40773.15 ops/sec ± 1000.03 (9.925 MB/s)
Sampled 59958 chunks (25.223 MB) in 10.004 seconds
Average memory usage: 41.56 MB

15. pako - deflate
Deflate x 3711.99 ops/sec ± 391.06 (1.561 MB/s)
Inflate x 15191.23 ops/sec ± 2641.48 (4.857 MB/s)
Sampled 22832 chunks (9.602 MB) in 10.010 seconds
Average compression ratio: 76.02%
Average memory usage: 87.19 MB

16. pako - deflateRaw
DeflateRaw x 3879.65 ops/sec ± 413.75 (1.633 MB/s)
InflateRaw x 13243.61 ops/sec ± 1994.89 (4.161 MB/s)
Sampled 23190 chunks (9.757 MB) in 10.010 seconds
Average compression ratio: 74.66%
Average memory usage: 86.30 MB

17. pako - gzip
Gzip x 3747.84 ops/sec ± 305.38 (1.577 MB/s)
Ungzip x 15947.79 ops/sec ± 1957.70 (5.283 MB/s)
Sampled 23227 chunks (9.773 MB) in 10.010 seconds
Average compression ratio: 78.74%
Average memory usage: 84.73 MB

18. pako - deflate stream
Deflate stream x 8040.89 ops/sec ± 204.37 (3.382 MB/s)
Inflate stream x 22794.94 ops/sec ± 272.99 (5.547 MB/s)
Sampled 38272 chunks (16.094 MB) in 10.010 seconds
Average compression ratio: 57.86%
Average memory usage: 51.82 MB

19. pako - deflateRaw stream
DeflateRaw stream x 8199.24 ops/sec ± 230.43 (3.451 MB/s)
InflateRaw stream x 23560.38 ops/sec ± 1093.83 (5.739 MB/s)
Sampled 38731 chunks (16.302 MB) in 10.012 seconds
Average compression ratio: 57.87%
Average memory usage: 55.06 MB

20. pako - gzip stream
Gzip stream x 8001.61 ops/sec ± 124.87 (3.366 MB/s)
Inflate stream x 21674.04 ops/sec ± 647.87 (5.276 MB/s)
Sampled 38010 chunks (15.991 MB) in 10.030 seconds
Average compression ratio: 57.86%
Average memory usage: 52.78 MB

21. minizlib - deflate stream
Deflate stream x 13325.03 ops/sec ± 215.99 (5.604 MB/s)
Inflate stream x 34143.60 ops/sec ± 1123.13 (8.308 MB/s)
Sampled 54542 chunks (22.938 MB) in 10.009 seconds
Average compression ratio: 57.86%
Average memory usage: 43.30 MB

22. minizlib - deflateRaw stream
DeflateRaw stream x 13636.91 ops/sec ± 198.48 (5.731 MB/s)
InflateRaw stream x 35254.97 ops/sec ± 853.22 (8.570 MB/s)
Sampled 55789 chunks (23.447 MB) in 10.011 seconds
Average compression ratio: 57.84%
Average memory usage: 43.49 MB

23. minizlib - gzip stream
Gzip stream x 12779.88 ops/sec ± 365.44 (5.371 MB/s)
Gunzip stream x 32603.19 ops/sec ± 1272.12 (7.925 MB/s)
Sampled 53075 chunks (22.305 MB) in 10.031 seconds
Average compression ratio: 57.84%
Average memory usage: 43.41 MB

24. minizlib - brotli stream
BrotliCompress stream x 492.25 ops/sec ± 13.17 (0.207 MB/s)
BrotliDecompress stream x 16250.46 ops/sec ± 1800.75 (3.680 MB/s)
Sampled 4538 chunks (1.910 MB) in 10.018 seconds
Average compression ratio: 53.79%
Average memory usage: 50.20 MB
```



## Findings

* Brotli is extremely slow at compressing, maybe i missed something or there is something wrong with node's implementation.
* Standalone sync is the best at compressing large amounts of data
* Shared context sync is the best at decompressing small amounts of data
* Compressing data below a certain size can make the compressed data larger than the actual data
* The chunkSize option can have a substantial effect on decompression performance. Best results were obtained when chunkSize was equal or slightly larger than the compressed data size