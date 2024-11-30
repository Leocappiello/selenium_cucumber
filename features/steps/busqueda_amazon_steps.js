const { Given, When, Then } = require('@cucumber/cucumber');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

const initDriver = async () => {
//   driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
    driver = await new Builder().forBrowser('chrome').build();
};

const closeDriver = async () => {
  await driver.quit();
};

Given('I open the Amazon homepage', async function () {
  await initDriver();
  await driver.get('https://www.amazon.com');
});

When('I search for {string}', async function (searchTerm) {
  const searchBox = await driver.findElement(By.id('twotabsearchtextbox'));
  await searchBox.sendKeys(searchTerm, Key.RETURN);
});

Then('I should see search results related to {string}', async function (searchTerm) {
  await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item')), 10000);
  const results = await driver.findElements(By.css('.s-main-slot .s-result-item'));

  if (results.length === 0) {
    throw new Error('No search results found');
  }

  const isRelevant = await Promise.all(
    results.map(async (result) => {
      const text = await result.getText();
      return text.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  if (!isRelevant.includes(true)) {
    throw new Error(`No results found for "${searchTerm}"`);
  }

  await closeDriver();
});
