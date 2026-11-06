
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const BASE_URL = 'http://localhost:5173'
const EMAIL = process.env.VISIONROOT_USER_EMAIL || 'shaggydion3@gmail.com'
const PASSWORD = process.env.VISIONROOT_USER_PASSWORD

const options = new chrome.Options()

async function clickElement(driver, element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({ block: 'center' });",
    element
  )

  await driver.wait(until.elementIsVisible(element), 5000)

  await driver.executeScript(
    "arguments[0].click();",
    element
  )
}

async function runTests() {
  if (!PASSWORD) {
    throw new Error(
      'VISIONROOT_USER_PASSWORD environment variable is required.'
    )
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()

  let passed = 0

  const originalTitle = `Selenium E2E Request ${Date.now()}`
  const updatedTitle = `${originalTitle} - Updated`

  const originalDescription =
    'This request was created automatically to test the customer workflow.'

  const updatedDescription =
    'This description was updated automatically by the Selenium browser test.'

  try {
    // TEST 1: Customer login
    console.log('\nTEST 1: Customer login')

    await driver.get(`${BASE_URL}/login`)

    await driver.findElement(By.id('email')).sendKeys(EMAIL)
    await driver.findElement(By.id('password')).sendKeys(PASSWORD)

    await clickElement(
      driver,
      await driver.findElement(By.css('button[type="submit"]'))
    )

    await driver.wait(until.urlContains('/requests'), 15000)

    assert.ok((await driver.getCurrentUrl()).includes('/requests'))

    console.log('PASS: Customer login successful')
    passed++

    // TEST 2: Open create request page
    console.log('\nTEST 2: Open create request page')

    await driver.get(`${BASE_URL}/requests/new`)

    await driver.wait(until.elementLocated(By.id('title')), 10000)
    await driver.wait(until.elementLocated(By.id('description')), 10000)

    const pageHeading = await driver.findElement(By.css('h1')).getText()

    assert.ok(pageHeading.includes('Create a service request'))

    console.log('PASS: Create request page loaded')
    passed++

    // TEST 3: Create a new request
    console.log('\nTEST 3: Create service request')

    await driver.findElement(By.id('title')).sendKeys(originalTitle)

    await driver.findElement(By.id('description')).sendKeys(
      originalDescription
    )

    const createButton = await driver.findElement(
      By.css('button[type="submit"]')
    )

    await clickElement(driver, createButton)

    await driver.wait(
      until.urlIs(`${BASE_URL}/requests`),
      15000
    )

    console.log('PASS: Request submitted')
    passed++

    // TEST 4: Search for the newly created request
    console.log('\nTEST 4: Search created request')

    const searchInput = await driver.wait(
      until.elementLocated(
        By.css('input[placeholder="Search your requests..."]')
      ),
      10000
    )

    await searchInput.sendKeys(originalTitle)

    const requestArticle = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//article[.//h3[normalize-space()="${originalTitle}"]]`
        )
      ),
      10000
    )

    assert.ok(await requestArticle.isDisplayed())

    console.log('PASS: Newly created request found in search')
    passed++

    // TEST 5: Open request details
    console.log('\nTEST 5: Open request details')

    const detailsLink = await requestArticle.findElement(
      By.xpath(".//a[normalize-space()='View details']")
    )

    await clickElement(driver, detailsLink)

    await driver.wait(
      until.elementLocated(
        By.xpath(`//h2[normalize-space()="${originalTitle}"]`)
      ),
      10000
    )

    console.log('PASS: Request details opened')
    passed++

    // TEST 6: Open edit page
    console.log('\nTEST 6: Open edit request page')

    const editLink = await driver.findElement(
      By.xpath("//a[normalize-space()='Edit request']")
    )

    await clickElement(driver, editLink)

    await driver.wait(until.urlContains('/edit'), 10000)

    const editTitleInput = await driver.wait(
      until.elementLocated(By.id('title')),
      10000
    )

    assert.equal(
      await editTitleInput.getAttribute('value'),
      originalTitle
    )

    console.log('PASS: Edit page loaded with existing request data')
    passed++

    // TEST 7: Update request
    console.log('\nTEST 7: Update request information')

    await editTitleInput.clear()
    await editTitleInput.sendKeys(updatedTitle)

    const descriptionInput = await driver.findElement(
      By.id('description')
    )

    await descriptionInput.clear()
    await descriptionInput.sendKeys(updatedDescription)

    const saveButton = await driver.findElement(
      By.xpath("//button[normalize-space()='Save changes']")
    )

    await clickElement(driver, saveButton)

    await driver.wait(
      until.elementLocated(
        By.xpath(`//h2[normalize-space()="${updatedTitle}"]`)
      ),
      15000
    )

    console.log('PASS: Request updated successfully')
    passed++

    // TEST 8: Verify updated request details
    console.log('\nTEST 8: Verify updated information')

    const displayedDescription = await driver.wait(
      until.elementLocated(
        By.xpath(`//p[normalize-space()="${updatedDescription}"]`)
      ),
      10000
    )

    assert.ok(await displayedDescription.isDisplayed())

    console.log('PASS: Updated title and description are displayed')
    passed++

    console.log(`\nRESULT: ${passed}/8 tests passed`)
    console.log('The test request remains in PENDING status.')

  } catch (error) {
    console.error('\nTEST FAILED:', error.message)
    process.exitCode = 1
  } finally {
    await driver.quit()
  }
}

runTests().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
