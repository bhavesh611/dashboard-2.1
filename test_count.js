const mockData = require('./data/mockTests.json');

function countTestCases(node) {
  if (node.type === 'file' && node.content) {
    const matches = node.content.match(/def test_\w+/g);
    return matches ? matches.length : 0;
  }
  if (node.type === 'folder' && node.children) {
    return Object.values(node.children).reduce((sum, child) => sum + countTestCases(child), 0);
  }
  return 0;
}

const total = Object.values(mockData.tests).reduce((sum, node) => sum + countTestCases(node), 0);
console.log(`TOTAL TEST CASES: ${total}`);

// Also show breakdown
Object.entries(mockData.tests).forEach(([folderName, folder]) => {
  const count = countTestCases(folder);
  console.log(`${folderName}: ${count} test cases`);
});
