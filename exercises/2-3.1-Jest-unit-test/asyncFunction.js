// asyncFunction.js
function fetchData() {
    return new Promise((resolve) => setTimeout(() => resolve('data'), 1000));
  }
  module.exports = fetchData;
  