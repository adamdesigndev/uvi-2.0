// sum.test.js

// Running tests example
// First: Import test
const { sum, myFunction, fetchData, fetchPromise } = require('./sum');

// Second: Run the test
// Takes the test description and test function
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// On .toBe
// Used with primative values
test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

// On .toEqaul
// Used when comparing values of object or arrays
test('object asignment', () => {
const data = { one: 1 };
data ['two'] = 2;
expect(data).toEqual({
    one: 1,
    two: 2
});
});

// On .toBeFalsy
// Used check if value is null, undefined, false, 0, blank, NaN
test('null is falsy', () => {
    const n = null;
    expect(n).toBeFalsy();
});

test('0 is falsy', () => {
        const n = 0;
        expect(n).toBeFalsy();
});

// More on .toBeTruthy
// Used check if value is 1, true
test('1 is truthy', () => {
    const n = 1;
    expect(n).toBeTruthy();
});

test('true is truthy', () => {
    const n = true;
    expect(n).toBeTruthy();
});

// On .toThrow
// Used to check error handling
test('throws on invalid input', () => {
    expect(() =>{
        myFunction('sdfsdf');
    }).toThrow();
})

// On async operations: callback
test('the data is oreo', done => {
    function callback(data) {
        try {
            expect(data).toBe('oreo');
            done();
        } catch (error) {
            done(error);
        }
    }

    fetchData(callback);
});

// On async operations: promise
// To resolve
test("fetchPromise is 'Hi'", () => {
    return expect(fetchPromise(true)).resolves.toBe("Hi")
})


test("fetchPromise throws", () => {
    return expect(fetchPromise(false)).rejects.toThrow("error")
})

// With await
test('the data is Hi', async () => {
    const data = await fetchPromise(true); // Ensure the promise resolves
    expect(data).toBe('Hi');
});

// Mock function
test('mock imlementation of a basic function', () => {
    const mock = jest.fn(x => 42 + x);
    expect(mock(1)).toBe(43);
    expect(mock).toHaveBeenCalledWith(1);
});

// Mock function with spies
test('spying on a method of an object', () => {
   const video = {
    play() {
        return true;
    },
   };

   const spy = jest.spyOn(video, 'play');
   video.play();

   // validates spy functionality
   expect(spy).toHaveBeenCalled();
   // reverts function back to original implementation
   spy.mockRestore();
})