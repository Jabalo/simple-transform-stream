const { performance } = require('perf_hooks');
const { Transform } = require('stream');

/**
 GetMetricsStream
 */
module.exports = class GetMetricsStream extends Transform {
    constructor () {
        super();
        this.totalLengthInBytes = 0;
        this.totalLines = 0;
        this.startTime = performance.now();
    }

    getTotalLines = () => {
        return this.totalLines;
    }

    getTotalLengthInBytes = () => {
        return this.totalLengthInBytes;
    }

    getElapsedTime = () => {
        return (performance.now() - this.startTime) * 0.001;
    }

    _transform = (chunk, encoding, callback) => {
        this.totalLines++;
        this.totalLengthInBytes += Buffer.byteLength(chunk, 'utf8');

        callback();
    }

    _flush = (callback) => {
        const elapsedTime = this.getElapsedTime();

        const metrics = {
            totalLines: this.totalLines,
            totalLengthInBytes: this.totalLengthInBytes,
            elapsedTime
        };

        callback(null, JSON.stringify(metrics));
    }
};