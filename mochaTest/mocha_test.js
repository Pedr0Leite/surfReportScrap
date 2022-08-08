var assert = require('assert');
var surfApp = require('../surfInfoApp.js');
var fetchSurfInfo = surfApp.fetchSurfInfo;
var surfObj = surfApp.obj;
const puppeteer = require('puppeteer');
require("dotenv").config();
const localDir = process.env.CHROMIUM_LOCAL_DIR;

//Not done yet

describe('Chromium should open', () => {
        let browser
        let page
        
        before(async () => {
            browser = await puppeteer.launch({headless:true,  executablePath: localDir});
            page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.setDefaultTimeout(0);
            await page.goto('https://www.surfline.com/');
        })
      
        it('returns Chrome Puppeteer SurfLine website', async () => {

          const surfLineLink = page.url()
          expect(surfLineLink).toEqual('https://www.surfline.com/')
        //   await page.screenshot({ path: 'duckduckgo.png' })
        }).timeout(1000)
      
        after(async () => {
          await browser.close()
        })
      });