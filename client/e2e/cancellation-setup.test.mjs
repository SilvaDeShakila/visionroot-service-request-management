
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const BASE_URL = 'http://localhost:5173'
const EMAIL = process.env.VISIONROOT_USER_EMAIL || 'shaggydion3@gmail.com'
const PASSWORD = process.env.VISIONROOT_USER_PASSWORD

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options())
  .build()

async function clickElement(element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({ block: 'center' });",
    element
  )
  await driver.wait(until.elementIsVisible(element), 5000)
  await driver.executeScript('arguments[0].click();', element)
}

async function createRequest(title, description) {
  await driver.get(`${BASE_URL}/requests/new`)

  const titleInput = await driver.wait(
    until.elementLocated(By.id('title')),
    10000
  )

  await titleInput.sendKeys(title)

  await driver.findElement(By.id('description')).sendKeys(description)

  await clickElement(
    await driver.findElement(By.css('button[type="submit"]'))
  )

  await driver.wait(until.urlIs(`${BASE_URL}/requests`), 15000)

  console.log(`PASS: Created request: ${title}`)
}

try {
  if (!PASSWORD) {
    throw new Error('VISIONROOT_USER_PASSWORD is required.')
  }

  await driver.manage().window().maximize()

  console.log('TEST 1: Customer login')

  await driver.get(`${BASE_URL}/login`)

  await driver.wait(until.elementLocated(By.id('email')), 10000)

  await driver.findElement(By.id('email')).sendKeys(EMAIL)
  await driver.findElement(By.id('password')).sendKeys(PASSWORD)

  await clickElement(
    await driver.findElement(By.css('button[type="submit"]'))
  )

  await driver.wait(until.urlContains('/requests'), 15000)

  console.log('PASS: Customer login')

  const uniqueId = Date.now()

  const pendingTitle = `Selenium Cancel Pending ${uniqueId}`
  const inProgressTitle = `Selenium Cancel InProgress ${uniqueId}`

  console.log('\nTEST 2: Create PENDING cancellation request')

  await createRequest(
    pendingTitle,
    'Automated test request for PENDING to CANCELLED status transition.'
  )

  console.log('\nTEST 3: Create IN_PROGRESS cancellation request')

  await createRequest(
    inProgressTitle,
    'Automated test request for IN_PROGRESS to CANCELLED status transition.'
  )

  console.log('\nRESULT: Cancellation test requests created successfully.')
  console.log(`PENDING TEST TITLE: ${pendingTitle}`)
  console.log(`IN_PROGRESS TEST TITLE: ${inProgressTitle}`)
  console.log('Both requests should initially have PENDING status.')

} catch (error) {
  console.error('\nCANCELLATION SETUP FAILED:', error.message)
  process.exitCode = 1
} finally {
  await driver.quit()
}
