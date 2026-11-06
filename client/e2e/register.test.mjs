
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const BASE_URL = 'http://localhost:5173'

async function clickSubmit(driver) {
  const button = await driver.wait(
    until.elementLocated(By.css('button[type="submit"]')),
    10000
  )

  await driver.wait(until.elementIsEnabled(button), 5000)

  await driver.executeScript(
    'arguments[0].scrollIntoView({ block: "center" })',
    button
  )

  await driver.sleep(300)

  // Trigger the form's normal submit-button click event.
  await driver.executeScript(
    'arguments[0].click()',
    button
  )
}

async function runTests() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build()

  let passed = 0
  let failed = 0

  try {
    // TEST 1: Registration page loads
    console.log('\nTEST 1: Registration page loads')

    await driver.get(`${BASE_URL}/register`)

    await driver.wait(
      until.elementLocated(By.id('name')),
      10000
    )

    await driver.findElement(By.id('email'))
    await driver.findElement(By.id('password'))
    await driver.findElement(By.id('confirmPassword'))

    console.log('PASS: Registration form loaded')
    passed++

    // TEST 2: Password mismatch validation
    console.log('\nTEST 2: Password mismatch validation')

    await driver.findElement(By.id('name'))
      .sendKeys('Selenium Tester')

    await driver.findElement(By.id('email'))
      .sendKeys(`selenium.${Date.now()}@example.com`)

    await driver.findElement(By.id('password'))
      .sendKeys('TestPass123')

    await driver.findElement(By.id('confirmPassword'))
      .sendKeys('Different123')

    await clickSubmit(driver)

    const mismatchError = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Passwords do not match.')]")
      ),
      10000
    )

    assert.ok(await mismatchError.isDisplayed())

    console.log('PASS: Password mismatch was rejected')
    passed++

    // TEST 3: Invalid email validation
    console.log('\nTEST 3: Invalid email validation')

    const emailInput = await driver.findElement(By.id('email'))

    await emailInput.clear()
    await emailInput.sendKeys('invalid-email')

    await clickSubmit(driver)

    const emailError = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Enter a valid email address.')]")
      ),
      10000
    )

    assert.ok(await emailError.isDisplayed())

    console.log('PASS: Invalid email was rejected')
    passed++

    // TEST 4: Password minimum length validation
    console.log('\nTEST 4: Password minimum length validation')

    await driver.findElement(By.id('email')).clear()
    await driver.findElement(By.id('email'))
      .sendKeys(`selenium.${Date.now()}@example.com`)

    const passwordInput = await driver.findElement(By.id('password'))
    await passwordInput.clear()
    await passwordInput.sendKeys('Ab1')

    const confirmInput = await driver.findElement(
      By.id('confirmPassword')
    )
    await confirmInput.clear()
    await confirmInput.sendKeys('Ab1')

    await clickSubmit(driver)

    const passwordError = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Password must contain at least 8 characters.')]")
      ),
      10000
    )

    assert.ok(await passwordError.isDisplayed())

    console.log('PASS: Short password was rejected')
    passed++

    console.log('\n--------------------------------')
    console.log(`RESULT: ${passed}/4 tests passed`)
    console.log(`FAILED: ${failed}`)
    console.log('--------------------------------')
  } catch (error) {
    failed++
    console.error('\nTEST FAILED:', error.message)
    process.exitCode = 1
  } finally {
    await driver.quit()
  }
}

runTests()
