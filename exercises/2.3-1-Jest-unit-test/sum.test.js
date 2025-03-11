// sum.test.js
const sum = require('./sum');

// npm i --save-dev @types/jest
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 2 + 3 to equal 5', () => {
    expect(sum(2, 3)).toBe(5);
});
  
