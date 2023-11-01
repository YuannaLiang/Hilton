const { Given, When, Then, AfterAll } = require('@cucumber/cucumber')
const { Builder, By, Capabilities } = require('selenium-webdriver')
const { expect } = require('chai')
const _ = require('lodash')
require('dotenv').config()
require('chromedriver')
const capabilities = Capabilities.chrome()
capabilities.set('chromeOptions', { w3c: false })
const driver = new Builder().withCapabilities(capabilities).build()
const webUrl = process.env.WEB_URL
Given('I am on the webapp', async () => {
	await driver.manage().setTimeouts({ implicit: 2000 })
	await driver.get(webUrl)
})

Then('The title should be {string}', {timeout: 60 * 1000}, async (titleText) => {
	const title = await driver.getTitle()
	expect(title).to.equal(titleText)
})
AfterAll(async () => {
	await driver.quit()
})
