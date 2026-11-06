
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const email =
  process.env.VISIONROOT_ADMIN_EMAIL || 'shagysilva501@gmail.com'

const password = process.env.VISIONROOT_ADMIN_PASSWORD

// Search by the unique number in the request title.
const uniqueTitle = '1793946285757'

if (!password) {
  throw new Error('VISIONROOT_ADMIN_PASSWORD is required.')
}

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options())
  .build()

async function clickElement(element) {
  await driver.executeScript(
    'arguments[0].scrollIntoView({ block: "center" });',
    element
  )

  await driver.executeScript(
    'arguments[0].click();',
    element
  )
}

async function searchTestRequest() {
  const search = await driver.findElement(
    By.css('input[placeholder="Search by request title or description..."]')
  )

  await search.clear()
  await search.sendKeys(uniqueTitle)

  const rowLocator = By.xpath(
    `//tr[contains(., "${uniqueTitle}")]`
  )

  await driver.wait(
    until.elementLocated(rowLocator),
    15000,
    'Could not find the Selenium test request using its title.'
  )

  return await driver.findElement(rowLocator)
}

async function waitForStatus(expectedStatus) {
  await driver.wait(async () => {
    try {
      const row = await searchTestRequest()
      const rowText = await row.getText()

      return rowText.includes(expectedStatus)
    } catch {
      return false
    }
  }, 20000, `Expected status "${expectedStatus}" was not displayed.`)
}

async function test(name, action) {
  try {
    await action()
    console.log(`PASS: ${name}`)
  } catch (error) {
    console.error(`FAIL: ${name}`)
    throw error
  }
}

try {
  await driver.manage().window().maximize()

  await test('1. Admin login', async () => {
    await driver.get('http://localhost:5173/login')

    await driver.wait(
      until.elementLocated(By.id('email')),
      15000
    )

    await driver.findElement(By.id('email')).sendKeys(email)
    await driver.findElement(By.id('password')).sendKeys(password)

    await clickElement(
      await driver.findElement(
        By.css('button[type="submit"]')
      )
    )

    await driver.wait(
      until.urlContains('/admin'),
      20000
    )
  })

  await test('2. Open Admin Service Requests', async () => {
    await driver.get('http://localhost:5173/admin/requests')

    await driver.wait(
      until.elementLocated(
        By.css('input[placeholder="Search by request title or description..."]')
      ),
      15000
    )
  })

  await test('3. Find Selenium test request by title', async () => {
    const row = await searchTestRequest()
    const rowText = await row.getText()

    assert.ok(rowText.includes(uniqueTitle))
    console.log('Found:', rowText.split('\n')[0])
  })

  await test('4. Verify current In Progress status', async () => {
    const row = await searchTestRequest()
    const rowText = await row.getText()

    assert.ok(
      rowText.includes('In Progress'),
      `Expected In Progress. Actual row:\n${rowText}`
    )
  })

  await test('5. Change status to Resolved', async () => {
    const row = await searchTestRequest()

    const statusSelect = await row.findElement(
      By.css('select[aria-label^="Update status for"]')
    )

    // Use Selenium keyboard interaction to trigger the select change.
    await statusSelect.sendKeys('Resolved')

    await waitForStatus('Resolved')
  })

  await test('6. Verify Resolved status after page refresh', async () => {
    await driver.navigate().refresh()

    await driver.wait(
      until.elementLocated(
        By.css('input[placeholder="Search by request title or description..."]')
      ),
      15000
    )

    await waitForStatus('Resolved')
  })

  console.log('\nRESULT: 6/6 admin status tests passed.')
  console.log('Verified final status: RESOLVED')
} catch (error) {
  console.error('\nADMIN STATUS TEST FAILED:', error.message)
  process.exitCode = 1
} finally {
  await driver.quit()
}
