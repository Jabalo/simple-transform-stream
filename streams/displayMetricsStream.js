const { Transform } = require('stream');

/**
 DisplayMetricsDuplex
 */
module.exports = class DisplayMetricsDuplex extends Transform {
    constructor () {
        super();
        this.throughput = 0;
        this.totalLines = 0;
    }

    getThroughput = () => {
        return this.throughput;
    }

    getTotalLines = () => {
        return this.totalLines;
    }

    createReadableSummary = () => {
        return '[Total Lines]: ' + this.totalLines +
        ' [Throughput]: ' + this.throughput + ' bytes/sec.';
    }

    _transform = (chunk, encoding, callback) => {
        const metrics = JSON.parse(chunk);

        this.throughput  = metrics.elapsedTime / metrics.totalLengthInBytes;
        this.totalLines = metrics.totalLines;

        callback(null, this.createReadableSummary());
    }
};