const app = require('../app');
const fs = require('fs');
const { Stream, pipeline } = require('stream');
const readline = require('readline');

const GetMetricsStream = require('../streams/getMetricsStream');
const DisplayMetricsDuplex = require('../streams/displayMetricsStream');
const { expect } = require('chai');

describe('Test: Streams', () => {

    const mockRun = (filePath) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
        });
        
        const readlineStream = new Stream.Readable({
            read: () => {}
        });
        
        rl.on('line', (line) => {
            readlineStream.push(line);
        })
        .on('close', () => {
            readlineStream.push(null);
        })

        const getMetricsStream = new GetMetricsStream();
        const displayMetricsStream = new DisplayMetricsDuplex();

        return { readlineStream, getMetricsStream, displayMetricsStream };
    }

    it('GetMetricsStream should return the correct total number of lines, total length of bytes and elapsed time', () => {
        const { readlineStream, getMetricsStream } = mockRun('./test.log');

        pipeline(
            readlineStream,
            getMetricsStream
            .on('finish', () => {
                expect(getMetricsStream.getTotalLines()).to.equal(89);
                expect(getMetricsStream.getTotalLengthInBytes()).to.be.gt(0);
                expect(getMetricsStream.getElapsedTime()).to.be.gt(0);
            }),
            err => {}
        );
      });

    it('DisplayMetricsStream should return the correct total number of lines and throughput', () => {
        const { readlineStream, getMetricsStream, displayMetricsStream } = mockRun('./test.log');

        pipeline(
            readlineStream,
            getMetricsStream,
            displayMetricsStream
            .on('finish', () => {
                expect(displayMetricsStream.getThroughput()).to.be.gt(0);
                expect(displayMetricsStream.getTotalLines()).to.equal(89);
            }),
            err => {}
        );
      });

})