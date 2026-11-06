
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import assert from 'node:assert/strict'

const BASE_URL = 'http://localhost:5173'

const protectedRoutes = [
  '/requests',
  '/requests/new',
  '/profile',
  '/preferences',
  '/support',
  '/admin',
  '/admin/requests',
  '/admin/support',
]

async function runTests() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build()

  let passed = 0
  let failed = 0

  try {
    for (const route of protectedRoutes) {
      console.log(`\nTEST: Unauthenticated access to ${route}`)

      try {
        await driver.get(`${BASE_URL}${route}`)

        await driver.wait(
          until.urlContains('/login'),
          10000
        )

        const currentUrl = await driver.getCurrentUrl()

        assert.ok(
          currentUrl.includes('/login'),
          `Expected login redirect, received: ${currentUrl}`
        )

        console.log(`PASS: ${route} redirected to login`)
        passed++
      } catch (error) {
        console.error(`FAIL: ${route} - ${error.message}`)
        failed++
      }
    }
  } finally {
    console.log('\n--------------------------------')
    console.log(`RESULT: ${passed}/${protectedRoutes.length} passed`)
    console.log(`FAILED: ${failed}`)
    console.log('--------------------------------')

    await driver.quit()

    if (failed > 0) {
      process.exitCode = 1
    }
  }
}

runTests()
