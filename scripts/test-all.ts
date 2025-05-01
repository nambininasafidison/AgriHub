/**
 * Comprehensive testing script for the AgriCommerce platform
 * Run with: npx ts-node scripts/test-all.ts
 */

import fetch from "node-fetch";
import chalk from "chalk";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function runTests() {
  console.log(
    chalk.blue("🧪 Starting comprehensive tests for AgriCommerce platform")
  );
  console.log(chalk.blue(`🌐 Testing against: ${BASE_URL}`));

  let passedTests = 0;
  let failedTests = 0;

  async function runTest(name: string, testFn: () => Promise<boolean>) {
    try {
      console.log(chalk.yellow(`Running test: ${name}`));
      const passed = await testFn();

      if (passed) {
        console.log(chalk.green(`✅ Test passed: ${name}`));
        passedTests++;
      } else {
        console.log(chalk.red(`❌ Test failed: ${name}`));
        failedTests++;
      }
    } catch (error) {
      console.error(chalk.red(`❌ Test error: ${name}`));
      console.error(error);
      failedTests++;
    }
  }

  await runTest("Homepage loads", async () => {
    const response = await fetch(`${BASE_URL}/`);
    return response.status === 200;
  });

  await runTest("Products page loads", async () => {
    const response = await fetch(`${BASE_URL}/products`);
    return response.status === 200;
  });

  await runTest("API health check", async () => {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = (await response.json()) as { status: string };
    return data.status === "ok";
  });

  await runTest("Authentication API", async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "invalidpassword",
      }),
    });

    return response.status === 401 || response.status === 400;
  });

  await runTest("Products API", async () => {
    const response = await fetch(`${BASE_URL}/api/products`);
    const data = (await response.json()) as { products: unknown };
    return Array.isArray(data.products);
  });

  console.log("\n" + chalk.blue("📊 Test Summary:"));
  console.log(chalk.green(`✅ Passed: ${passedTests}`));
  console.log(chalk.red(`❌ Failed: ${failedTests}`));

  if (failedTests > 0) {
    console.log(
      chalk.red("\n❌ Some tests failed. Please check the logs above.")
    );
    process.exit(1);
  } else {
    console.log(chalk.green("\n✅ All tests passed!"));
    process.exit(0);
  }
}

runTests().catch((error) => {
  console.error(chalk.red("Fatal error running tests:"));
  console.error(error);
  process.exit(1);
});
