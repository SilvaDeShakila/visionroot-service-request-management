
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const BASE_URL = 'http://localhost:5173'
const EMAIL =
  process.env.VISIONROOT_ADMIN_EMAIL || 'shagysilva501@gmail.com'
const PASSWORD = process.env.VISIONROOT_ADMIN_PASSWORD

const pendingTitle = process.env.VISIONROOT_PENDING_TITLE
const inProgressTitle = process.env.VISIONROOT_INPROGRESS_TITLE

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options())
  .build()

let passed = 0

async function test(name, action) {
  try {
    await action()
    console.log(`PASS: ${name}`)
    passed++
  } catch (error) {
    console.error(`FAIL: ${name}`)
    throw error
  }
}

async function searchRequest(title) {
  const search = await driver.wait(
    until.elementLocated(
      By.css('input[placeholder="Search by request title or description..."]')
    ),
    15000
  )

  await search.clear()
  await search.sendKeys(title)

  await driver.wait(
    async () => (await search.getAttribute('value')) === title,
    10000,
    'Search input did not update.'
  )

  const rowLocator = By.xpath(
    `//tbody/tr[contains(., "${title}")]`
  )

  await driver.wait(
    until.elementLocated(rowLocator),
    20000,
    `Request not found after search: ${title}`
  )

  return await driver.findElement(rowLocator)
}

async function getRequestStatus(title) {
  const row = await searchRequest(title)
  const select = await row.findElement(
    By.css('select[aria-label^="Update status for"]')
  )

  return await driver.executeScript('return arguments[0].value;', select)
}
async function changeStatus(title, value) {
  const row = await searchRequest(title)
  const select = await row.findElement(
    By.css('select[aria-label^="Update status for"]')
  )

  await driver.executeScript(
    `
      const select = arguments[0]
      const value = arguments[1]
      const setter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        'value'
      ).set

      setter.call(select, value)
      select.dispatchEvent(new Event('change', { bubbles: true }))
    `,
    select,
    value
  )

  await driver.wait(async () => {
    try {
      return (await getRequestStatus(title)) === value
    } catch {
      return false
    }
  }, 20000, `Status did not update to ${value}`)
}
try {
  if (!PASSWORD) {
    throw new Error('VISIONROOT_ADMIN_PASSWORD is required.')
  }

  await driver.manage().window().maximize()

  await test('1. Admin login', async () => {
    await driver.get(`${BASE_URL}/login`)

    await driver.wait(until.elementLocated(By.id('email')), 15000)

    await driver.findElement(By.id('email')).sendKeys(EMAIL)
    await driver.findElement(By.id('password')).sendKeys(PASSWORD)

    const loginButton = await driver.findElement(
      By.css('button[type="submit"]')
    )

    await driver.executeScript(
      'arguments[0].scrollIntoView({ block: "center" });',
      loginButton
    )
    await driver.executeScript('arguments[0].click();', loginButton)

    try {
      await driver.wait(until.urlContains('/admin'), 20000)
    } catch (error) {
      console.error('LOGIN DEBUG URL:', await driver.getCurrentUrl())
      console.error(
        'LOGIN DEBUG PAGE:',
        (await driver.findElement(By.css('body')).getText()).slice(0, 2000)
      )
      throw error
    }
  })

  await test('2. Open Admin Service Requests', async () => {
    await driver.get(`${BASE_URL}/admin/requests`)

    await driver.wait(
      until.elementLocated(
        By.css('input[placeholder="Search by request title or description..."]')
      ),
      15000
    )
  })

  await test('3. Find PENDING cancellation request', async () => {
    const status = await getRequestStatus(pendingTitle)
    assert.equal(status, 'PENDING')
  })

  await test('4. Change PENDING to CANCELLED', async () => {
    await changeStatus(pendingTitle, 'CANCELLED', 'Cancelled')
  })

  await test('5. Verify first request is CANCELLED', async () => {
    const status = await getRequestStatus(pendingTitle)
    assert.equal(status, 'CANCELLED')
  })

  await test('6. Find second PENDING request', async () => {
    const status = await getRequestStatus(inProgressTitle)
    assert.equal(status, 'PENDING')
  })

  await test('7. Change second request PENDING to IN_PROGRESS', async () => {
    await changeStatus(inProgressTitle, 'IN_PROGRESS', 'In Progress')
  })

  await test('8. Verify second request is IN_PROGRESS', async () => {
    const status = await getRequestStatus(inProgressTitle)
    assert.equal(status, 'IN_PROGRESS')
  })

  await test('9. Change IN_PROGRESS to CANCELLED', async () => {
    await changeStatus(inProgressTitle, 'CANCELLED', 'Cancelled')
  })

  await test('10. Verify second request is CANCELLED', async () => {
    const status = await getRequestStatus(inProgressTitle)
    assert.equal(status, 'CANCELLED')
  })

  await test('11. Verify both cancellations after refresh', async () => {
    await driver.navigate().refresh()

    const firstStatus = await getRequestStatus(pendingTitle)
    const secondStatus = await getRequestStatus(inProgressTitle)

    assert.equal(firstStatus, 'CANCELLED')
    assert.equal(secondStatus, 'CANCELLED')
  })

  console.log(`\nRESULT: ${passed}/11 admin cancellation tests passed.`)
  console.log('Both test requests have final status CANCELLED.')

} catch (error) {
  console.error('\nADMIN CANCELLATION TEST FAILED:', error.message)
  process.exitCode = 1
} finally {
  await driver.quit()
}






