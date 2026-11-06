
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const email = process.env.VISIONROOT_ADMIN_EMAIL || 'shagysilva501@gmail.com'
const password = process.env.VISIONROOT_ADMIN_PASSWORD

if (!password) {
  throw new Error('VISIONROOT_ADMIN_PASSWORD environment variable is required.')
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
  await driver.wait(until.elementIsVisible(element), 10000)
  await driver.executeScript('arguments[0].click();', element)
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

    await driver.wait(until.elementLocated(By.id('email')), 15000)
    await driver.findElement(By.id('email')).sendKeys(email)
    await driver.findElement(By.id('password')).sendKeys(password)

    const button = await driver.findElement(By.css('button[type="submit"]'))
    await clickElement(button)

    await driver.wait(until.urlContains('/admin'), 15000)
  })

  await test('2. Admin dashboard loads', async () => {
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Service Request Overview')]")),
      15000
    )

    const body = await driver.findElement(By.tagName('body')).getText()
    assert.ok(body.includes('ADMINISTRATOR WORKSPACE'))
    assert.ok(body.includes('Welcome back'))
  })

  await test('3. Dashboard statistics load', async () => {
    await driver.wait(async () => {
      const body = await driver.findElement(By.tagName('body')).getText()
      return (
        body.includes('Total Requests') &&
        !body.includes('Loading platform statistics...')
      )
    }, 20000)

    const body = await driver.findElement(By.tagName('body')).getText()
    assert.ok(body.includes('Pending'))
    assert.ok(body.includes('In Progress'))
    assert.ok(body.includes('Resolved'))
    assert.ok(body.includes('Cancelled'))
  })

  await test('4. Recent requests section loads', async () => {
    const heading = await driver.findElement(
      By.xpath("//*[contains(text(),'Recent Service Requests')]")
    )
    assert.ok(await heading.isDisplayed())
  })

  await test('5. Dashboard search accepts input', async () => {
    const search = await driver.findElement(
      By.css('input[aria-label="Search service requests"]')
    )

    await search.sendKeys('Selenium')
    assert.equal(await search.getAttribute('value'), 'Selenium')

    await search.clear()
  })

  await test('6. Status filter works', async () => {
    const filter = await driver.findElement(
      By.css('select[aria-label="Filter requests by status"]')
    )

    await filter.sendKeys('PENDING')
    assert.equal(await filter.getAttribute('value'), 'PENDING')

    const rows = await driver.findElements(
      By.css('table tbody tr')
    )

    for (const row of rows) {
      const text = await row.getText()
      if (text.trim() && !text.includes('No matching requests found')) {
        assert.ok(text.includes('Pending'), `Unexpected row: ${text}`)
      }
    }

    await filter.sendKeys('ALL')
  })

  await test('7. View all service requests navigation', async () => {
    const button = await driver.findElement(
      By.xpath("//*[contains(text(),'View All Service Requests')]")
    )

    await clickElement(button)
    await driver.wait(until.urlContains('/admin/requests'), 10000)
  })

  await test('8. Admin logout', async () => {
    const signOut = await driver.findElement(
      By.xpath("//button[contains(.,'Sign out')]")
    )

    await clickElement(signOut)
    await driver.wait(until.urlContains('/login'), 10000)
  })

  console.log('\nRESULT: 8/8 admin workflow tests passed.')
} catch (error) {
  console.error('\nADMIN WORKFLOW TEST FAILED:', error.message)
  process.exitCode = 1
} finally {
  await driver.quit()
}
