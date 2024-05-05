// sum.js
// Exporting test
module.exports = { sum, myFunction, fetchData, fetchPromise };

// Tests
function sum(a, b) {
    return a + b;
}

function myFunction(input) {
    if (typeof input !== 'number') {
        throw new Error('Invalid input')
    }
}

function fetchData(callback){
    setTimeout(() =>{
        callback('oreo');
    }, 1000);
}

function fetchPromise(isComplete) {
    return new Promise((resolve, reject) => {
        if (isComplete) {
            setTimeout(() => resolve('Hi'), 1000)
        }
        else {
            setTimeout(() => reject(new Error('error')), 1000)
        }
    })
}