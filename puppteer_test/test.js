const puppeteer = require('puppeteer');
const fs = require('fs/promises');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto('https://baidu.com');

  const $input = await page.$('#kw');
  await $input.type('11111');

  const $button = await page.$('#su');
  await $button.click();

  await page.waitForSelector('#container');
  const screenshot = await page.screenshot();
  await fs.writeFile('./screenshot.png', screenshot);

  await browser.close();
})();