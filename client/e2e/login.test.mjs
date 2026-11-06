
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const BASE_URL = 'http://localhost:5173'

const options = new chrome.Options()

async function runTests() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()

  let passed = 0

  try {
    // Test 1: Login page loads correctly
    console.log('\nTEST 1: Login page loads')

    await driver.get(`${BASE_URL}/login`)

    await driver.wait(until.elementLocated(By.id('email')), 10000)
    await driver.wait(until.elementLocated(By.id('password')), 10000)

    const loginButton = await driver.findElement(
      By.css('button[type="submit"]')
    )

    assert.equal(await loginButton.getText(), 'Sign in')

    console.log('PASS: Login page loaded correctly')
    passed++

    // Test 2: Protected admin page redirects unauthenticated users
    console.log('\nTEST 2: Protected admin route')

    await driver.get(`${BASE_URL}/admin`)

    await driver.wait(
      until.urlContains('/login'),
      10000
    )

    assert.ok(
      (await driver.getCurrentUrl()).includes('/login')
    )

    console.log('PASS: Unauthenticated user redirected to login')
    passed++

    // Test 3: Invalid login displays an error
    console.log('\nTEST 3: Invalid login validation')

    await driver.get(`${BASE_URL}/login`)

    await driver.findElement(By.id('email')).sendKeys(
      `selenium.invalid.${Date.now()}@example.com`
    )

    await driver.findElement(By.id('password')).sendKeys(
      'WrongPassword123!'
    )

    await driver.findElement(
      By.css('button[type="submit"]')
    ).click()

    const errorMessage = await driver.wait(
      until.elementLocated(By.css('[role="alert"]')),
      15000
    )

    await driver.wait(until.elementIsVisible(errorMessage), 5000)

    assert.ok((await errorMessage.getText()).length > 0)

    console.log('PASS: Invalid login displays an error')
    passed++

    console.log(`\nRESULT: ${passed}/3 tests passed`)
  } catch (error) {
    console.error('\nTEST FAILED:', error.message)
    process.exitCode = 1
  } finally {
    await driver.quit()
  }
}

runTests()
