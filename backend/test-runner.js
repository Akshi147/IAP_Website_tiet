#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting IAP Website Test Suite...\n');

// Test configuration
const testConfig = {
  unit: {
    name: 'Unit Tests',
    pattern: 'tests/**/*.test.js --testPathIgnorePatterns=integration.test.js',
    description: 'Testing individual components and functions'
  },
  integration: {
    name: 'Integration Tests',
    pattern: 'tests/integration.test.js',
    description: 'Testing API endpoints and component interactions'
  },
  coverage: {
    name: 'Coverage Report',
    pattern: 'tests/**/*.test.js --coverage',
    description: 'Generating code coverage report'
  }
};

// Helper function to run tests
function runTest(testType) {
  try {
    console.log(`📋 Running ${testConfig[testType].name}...`);
    console.log(`   ${testConfig[testType].description}\n`);
    
    const command = `npx jest ${testConfig[testType].pattern}`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ ${testConfig[testType].name} completed successfully!\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${testConfig[testType].name} failed!\n`);
    return false;
  }
}

// Helper function to check test files
function checkTestFiles() {
  const testFiles = [
    'tests/auth.test.js',
    'tests/user-management.test.js',
    'tests/document-management.test.js',
    'tests/admin-operations.test.js',
    'tests/mentor-operations.test.js',
    'tests/notification-system.test.js',
    'tests/chatbot-system.test.js',
    'tests/integration-workflows.test.js',
    'tests/failure-recovery.test.js',
    'tests/student.controller.test.js',
    'tests/admin.controller.test.js',
    'tests/mentor.controller.test.js',
    'tests/integration.test.js',
    'tests/models.test.js',
    'tests/middleware.test.js'
  ];

  console.log('🔍 Checking test files...');
  
  const missingFiles = testFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));
  
  if (missingFiles.length > 0) {
    console.log('❌ Missing test files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    return false;
  }
  
  console.log('✅ All test files found!\n');
  return true;
}

// Main test runner
async function runAllTests() {
  console.log('=' .repeat(60));
  console.log('🧪 IAP WEBSITE BACKEND TEST SUITE');
  console.log('=' .repeat(60));
  console.log();

  // Check if all test files exist
  if (!checkTestFiles()) {
    console.log('Please ensure all test files are present before running tests.');
    process.exit(1);
  }

  const results = {
    unit: false,
    integration: false,
    coverage: false
  };

  // Get command line arguments
  const args = process.argv.slice(2);
  const testType = args[0];

  if (testType && testConfig[testType]) {
    // Run specific test type
    results[testType] = runTest(testType);
  } else if (testType === 'all' || !testType) {
    // Run all tests
    results.unit = runTest('unit');
    results.integration = runTest('integration');
    results.coverage = runTest('coverage');
  } else {
    console.log('❌ Invalid test type. Available options:');
    Object.keys(testConfig).forEach(key => {
      console.log(`   - ${key}: ${testConfig[key].description}`);
    });
    console.log('   - all: Run all tests');
    process.exit(1);
  }

  // Summary
  console.log('=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  Object.keys(results).forEach(key => {
    if (results[key] !== false) {
      const status = results[key] ? '✅ PASSED' : '❌ FAILED';
      console.log(`${testConfig[key].name}: ${status}`);
    }
  });

  const allPassed = Object.values(results).every(result => result === true || result === false);
  const anyFailed = Object.values(results).some(result => result === false);

  if (anyFailed) {
    console.log('\n❌ Some tests failed. Please check the output above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed successfully!');
    process.exit(0);
  }
}

// Handle different commands
const command = process.argv[2];

switch (command) {
  case 'unit':
    runTest('unit');
    break;
  case 'integration':
    runTest('integration');
    break;
  case 'coverage':
    runTest('coverage');
    break;
  case 'all':
  case undefined:
    runAllTests();
    break;
  case 'help':
  case '--help':
  case '-h':
    console.log('IAP Website Test Runner\n');
    console.log('Usage: node test-runner.js [command]\n');
    console.log('Commands:');
    console.log('  unit        Run unit tests only');
    console.log('  integration Run integration tests only');
    console.log('  coverage    Run tests with coverage report');
    console.log('  all         Run all tests (default)');
    console.log('  help        Show this help message\n');
    console.log('Examples:');
    console.log('  node test-runner.js unit');
    console.log('  node test-runner.js coverage');
    console.log('  npm test');
    break;
  default:
    console.log(`❌ Unknown command: ${command}`);
    console.log('Run "node test-runner.js help" for available commands.');
    process.exit(1);
}