const fs = require('fs');
const pup = require('puppeteer');

async function SerchNotices() {

    let c = 1;
    const list = [];
    const url = 'https://olhardigital.com.br/'

    try {
        const browser = await pup.launch({headless : false});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
    console.log('initial');
    
        await page.goto(url);
    console.log('go to url');
        
        const noticias = await page.$$eval('a.cardV2.cardV2-incover', el => el.map(noticia => noticia.href));
        
        for(const noticia of noticias) {
            if(c === 5) continue;
            console.log('page: ' + c);
            await page.goto(noticia);
            await page.waitForSelector('.banner.banner-noticia-destaque h1');
            await page.waitForSelector('.banner.banner-noticia-destaque .banner-excerpt');

        const title = await page.$eval('.banner.banner-noticia-destaque h1', element => element.innerText);
        const subject = await page.$eval('.banner.banner-noticia-destaque .banner-excerpt', element => element.innerText);
        const src = await page.evaluate(() => {
            const imageElement = document.querySelector('img.attachment-post-thumbnail.size-post-thumbnail.wp-post-image');
        
            return imageElement && imageElement.tagName === 'IMG' ? imageElement.src : null;
          });

            const obj = {};
            obj.title = title;
            obj.subject = subject;
            obj.src = src;
            obj.noticia = noticia;
            
            list.push(obj);
            
            c++;
    }
        await browser.close();
        const listJSON = await JSON.stringify(list, null, 2);
            await fs.writeFileSync('notice.json', listJSON);
            console.log('file create sucessfully');
            return
            
        } catch (error) {
            console.log('Algo errado aconteceu, verifique com o suporte. Erro: '+error + '\n Prosseguimos tentando...');
            SerchNotices();
        }
}

SerchNotices();





// await browser.close();
    


