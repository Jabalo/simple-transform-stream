const { Stream, pipeline } = require('stream');
const readline = require('readline');
const GetMetricsStream  = require('./streams/getMetricsStream');
const DisplayMetricsStream  = require('./streams/displayMetricsStream');

const getMetricsStream = new GetMetricsStream();
const displayMetricsStream = new DisplayMetricsStream();

const rl = readline.createInterface({
    input: process.stdin,
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

const run = () => {
    pipeline(
        readlineStream,
        getMetricsStream,
        displayMetricsStream,
        process.stdout,
        err => {
            if (err) {
                console.log('Pipeline Failed: ', err);
              } else {
                console.log('Pipeline Succeeded!');
              }         
        }
    );
};

run();
