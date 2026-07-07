const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Capture console errors
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type().toUpperCase()}]:`, msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  await page.goto('http://localhost:3000/login/citizen', { waitUntil: 'networkidle2' });
  console.log("Loaded login page. URL:", page.url());
  
  try {
    const buttons = await page.$$('button');
    for (let btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Bypass Auth')) {
        await btn.click();
        console.log("Clicked bypass auth");
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Current URL after redirect:", page.url());

    await page.goto('http://localhost:3000/citizen/newsubmit', { waitUntil: 'networkidle2' });

    console.log("Loaded page. URL:", page.url());
    const storagePhone = await page.evaluate(() => localStorage.getItem("civicpulse_citizen_phone"));
    console.log("LocalStorage phone:", storagePhone);
    console.log("Body HTML:", await page.evaluate(() => document.body.innerHTML));

    const buttons2 = await page.$$('button');
    let recordBtn = null;
    for (let btn of buttons2) {
      const text = await page.evaluate(el => el.textContent, btn);
      console.log("Button text:", text);
      if (text.includes('Record')) {
        recordBtn = btn;
        break;
      }
    }
    
    if (recordBtn) {
      console.log("Found Record button! Clicking...");
      await recordBtn.click();
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("Record button not found.");
    }
  } catch (err) {
    console.log("Script error:", err);
  }
  
  await browser.close();
})();
