// asyncFunction.test.js
const fetchData = require('./asyncFunction');

test('fetchData returns "data"', async () => {
  await expect(fetchData()).resolves.toBe('data');
});


// TypeError: Failed to parse URL from /api/user
// test('fetches user data from API', async () => {
//     const response = await fetch('/api/user');
//     expect(response.status).toBe(200);
// });

test('fetches user data from API', async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto'); // Replace with your actual API URL
  expect(response.status).toBe(200);
  console.log(JSON.stringify(response))
});


  // test('fetchData resolves after 1 second', async () => {
  //   const start = Date.now();
  //   await fetchData();
  //   const duration = Date.now() - start;
  //   expect(duration).toBeGreaterThanOrEqual(1000);
  //   expect(duration).toBeLessThan(1100);
  // });

// Mocking Functions
// const fetchData = jest.fn(() => 'mocked data');

// console.log(fetchData()); // 'mocked data'
// expect(fetchData).toHaveBeenCalled();

  