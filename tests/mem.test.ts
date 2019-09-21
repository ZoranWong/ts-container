
setInterval(() => {
    let {heapUsed, heapTotal} = process.memoryUsage();
    console.log('----- free3 memory ---', heapUsed / heapTotal);
}, 500)

// test('free mem', function () {
//     expect(free1 !== free3).toBe(true);
// });