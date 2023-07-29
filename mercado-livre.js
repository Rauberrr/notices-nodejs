const fs = require('fs');
const pup = require('puppeteer');

async function SerchProducts() {


    let c = 1
    const list = [];
    const url = 'https://www.mercadolivre.com.br/'
    const searchFor = 'mouse'

        const browser = await pup.launch({headless : false});
        const page = await browser.newPage();
    console.log('initial');

        await page.goto(url);
    console.log('go to url');


        await page.waitForSelector('#cb1-edit');
        await page.type('#cb1-edit', searchFor);

    await Promise.all([
        page.waitForNavigation(),
        page.click('.nav-icon-search')
    ]);

    const links = await page.$$eval('.ui-search-item__group__element.shops__items-group-details.ui-search-link', el => el.map(link => link.href));

    for(const link of links) {
        if(c === 5) continue;
    console.log('page: ' + c);
        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title')

        const title = await page.$eval('.ui-pdp-title', element => element.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

        const obj = {};
            obj.title = title;
            obj.price = price;
            obj.link = link;

        list.push(obj);

        c++;
    }

    await browser.close();
    
    try {
        const listJSON = await JSON.stringify(list, null, 2);
        await fs.writeFileSync('mercado-livre.json', listJSON);
        console.log('file create sucessfully')
    } catch(err) {
        console.log('err to create file: ' + err);
    }
}

SerchProducts();