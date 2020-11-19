const puppeteer =require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
const scrapeImages=async (username)=>{
    const browser= await puppeteer.launch();
    const page =await browser.newPage();
    await page.goto('https://www.instagram.com/');
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', 'abcd');
    await page.type('input[name="password"]', 'abcd');
    await page.click('button[type="submit"]');
    await page.screenshot({path:'images/login.png',
    fullPage:true,
    omitBackground:true});
    await page.waitForSelector('img[alt="abcd\'s profile picture"]');
    await page.goto(`https://www.instagram.com/${username}`);

    await page.waitForSelector('h2 ',{visible:true,
    });
    const h2Text= await page.evaluate(()=>{
        return document.querySelector('h2').innerHTML;
    })

    if(h2Text==="Sorry, this page isn't available."){
        const data="Sorry, this user isn't available: "+ username;
        
        await browser.close();
        
        return data
    }

    await page.waitForSelector('img ',{visible:true,
    });
    await autoScroll(page);

    await page.screenshot({path:'images/postLogin.png',
    fullPage:true,
    omitBackground:true});

    const data = await page.evaluate( () => {

        const images = document.querySelectorAll('img');

        const urls = Array.from(images).map(v => v.src);

        return urls
    });
    

    await browser.close();

    return data;

}

    rl.question(`Enter the username: `, async (name) => {
        const data= await scrapeImages(name);
        console.log(await JSON.stringify(data));      
        rl.close();
        });






