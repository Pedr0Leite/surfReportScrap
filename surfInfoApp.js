const puppeteer = require('puppeteer');
require("dotenv").config();
const localDir = process.env.CHROMIUM_LOCAL_DIR;

process.stdout.write("Please write the name of the city you wish to know Surf Info... \n\n");

var surfHeightText = '';
var conditionText = '';
var windText = '';
var tideText = '';
var tidePeriodText = '';
var waterTempText = '';
var weatherText = '';
var swellText = '';

var obj = {
    'condition':'',
    'surf_height':'',
    'tide': '',
    'tide_period':'',
    'wind':'',
    'water_temp':'',
    'weather':'',
    'swell':''
}

async function getSurfInfo(input){
    let city = input + '' == '' ? 'Esmoriz' : input + '';

    try{
        // const browser = await puppeteer.launch({headless: false});
        const browser = await puppeteer.launch({headless:true,  executablePath: localDir});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
    await page.setDefaultTimeout(0);
    await page.goto('https://www.surfline.com/').then(()=>{console.log('Site loaded')});
    console.log(page.url());
    //wait for Search button to be available
    const waitSearchButton = await page.waitForSelector('.quiver-new-navigation-bar__site-search__button').then(()=>{console.log('Search Button Loaded')});
    // const [responseClickOption0] = await Promise.all([
        page.waitForNavigation(waitSearchButton),
        await page.click('.quiver-new-navigation-bar__site-search__button').then(()=>{console.log('Clicked the Search button')});
        await page.$('.quiver-site-search__top').then(()=>{console.log('Search Type loaded')});
        await page.waitForTimeout(5000);
        try{
            await page.waitForSelector('#downshift-0-input' , { timeout: 20000 }).then(()=>{console.log('Place to type loaded')});
        }catch(e){
            console.log("waitForSelector('#downshift-0-input') error: " + e);
        }
        await page.type('#downshift-0-input', city).then(()=>{console.log('Typed')});
        await page.waitForSelector('#downshift-0-menu').then(()=>{console.log('Options loaded')});
        await page.waitForSelector('div.quiver-site-search__section:nth-child(1)').then(()=>{console.log('Options Surf Spot loaded')});
    // ]);

    //in case of no results
    if (await page.$('div.quiver-site-search__section:nth-child(1) > div:nth-child(1) > span:nth-child(2)') !== null){
        console.log('No results Div Found');
        // await browser.close();
        return;
    }else{

    //Wait until page of option selected is loaded
    const waitOptions = await page.waitForSelector('#downshift-0-item-0').then(()=>{console.log('item Options loaded')});
    const [responseClickOption] = await Promise.all([
        page.waitForNavigation(waitOptions),
        page.click('#downshift-0-item-0').then(()=>{console.log('Option clicked')}),
        await page.waitForSelector('.quiver-colored-condition-bar').then(()=>{console.log('1 Conditions and info loaded')}),
        await page.waitForSelector('.quiver-spot-forecast-summary__stat-container--surf-height > span:nth-child(2)').then(()=>{console.log('2 Conditions and info loaded')})
        ]);
        
        const condition = await page.waitForSelector('.quiver-colored-condition-bar');
        conditionText = await condition.evaluate(el => el.textContent);

        const surfHeight = await page.waitForSelector('.quiver-spot-forecast-summary__stat-container--surf-height > span:nth-child(2)');
        surfHeightText = await surfHeight.evaluate(el => el.textContent);
        
        const wind = await page.waitForSelector('.quiver-spot-forecast-summary__stat-container--wind > div:nth-child(2)');
        windText = await wind.evaluate(el => el.textContent);
        
        const tide = await page.waitForSelector('.quiver-spot-forecast-summary__stat-container--tide > div:nth-child(2) > span:nth-child(1)');
        tideText = await tide.evaluate(el => el.textContent);
        
        const tidePeriod = await page.waitForSelector('.quiver-spot-forecast-summary__stat-container--tide > span:nth-child(3)');
        tidePeriodText = await tidePeriod.evaluate(el => el.textContent);
        
        const waterTemp = await page.waitForSelector('.quiver-water-temp > div:nth-child(2)');
        waterTempText = await waterTemp.evaluate(el => el.textContent);
        
        const weather = await page.waitForSelector('.quiver-weather-stats > div:nth-child(2)');
        weatherText = await weather.evaluate(el => el.textContent);
        
        const swell = await page.waitForSelector('.quiver-spot-forecast-summary__stat-container--swells');
        swellText = await swell.evaluate(el => el.textContent);
        
        
        await browser.close();
    }
    }catch(e){
        console.log('Inside Function Error! ' + e)
    }
    };
    
    let fetchSurfInfo = (userInput) =>{
        getSurfInfo(userInput).then(()=>{
            var regex = /(Swells)/gi;
            
            // var obj = {
            //     'condtion':'',
            //     'surf_height':'',
            //     'tide': '',
            //     'tide_period':'',
            //     'wind':'',
            //     'water_temp':'',
            //     'weather':'',
            //     'swell':''
            // }

            if(!conditionText && !surfHeightText && !tidePeriodText){
                console.log('No Results Found for the searched city/place.')
                process.exit(); 
            }


            
            obj.condition = conditionText;
            obj.surf_height = surfHeightText;
            obj.tide = tideText;
            obj.tide_period = tidePeriodText;
            obj.wind = windText;
            obj.water_temp = waterTempText;
            obj.weather = weatherText;
    
            swellText = swellText.replace(regex, '');
    
            obj.swell = swellText.trim();
            console.table(obj);
            process.exit();
        });
    }

    try{
        process.stdin.on('data',fetchSurfInfo)

    }catch(e){
        console.error('Error: ' + e);
    
    }
    
    module.exports = {fetchSurfInfo, obj};