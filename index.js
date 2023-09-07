import puppeteer from "puppeteer";

async function scrapeQuotes(page) {
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll(".quote");
    return Array.from(quoteList).map((quote) => {
      const text = quote.querySelector(".text").innerText;
      const author = quote.querySelector(".author").innerText;
      return { text, author };
    });
  });

  console.log(quotes);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  let hasNextPage = true;
  while (hasNextPage) {
    await scrapeQuotes(page);
    const nextButton = await page.$(".next>a");
    //console.log(nextButton);
    if (nextButton) {
      //console.log(nextButton);
      await nextButton.click();
      await new Promise(function (resolve) {
        setTimeout(resolve, 1000);
      });
      //await page.waitForSelector(".next>a")
      //await delay(1000);
    } else {
      hasNextPage = false;
    }
  }

  await browser.close();
}

main();
