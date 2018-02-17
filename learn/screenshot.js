const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false, // 可以让他打开网页
    executablePath:'/private/var/folders/0c/r32jpgps1q31hmn8r4lb_r080000gn/T/AppTranslocation/E200E596-4D1F-4F19-A27F-E9DBB971A2E2/d/Chromium.app/Contents/MacOS/Chromium',
    args: ['--allow-no-sandbox-job'], // --allow-no-sandbox-job:这个标志可以减少的安全沙箱进程和允许他们做某些API调用关闭窗口或访问剪贴板。我们也失去了机会杀死一些过程,直到外拥有他们完成的工作
    dumpio: false // 浏览器是否管过程stdout和stderr进的过程。stdout和process.stderr。默认值为false
  })
  const page = await browser.newPage(); 
  // 打开页面
  await page.goto('https://github.com');
  // 截图然后放在screenshots文件夹下
  await page.screenshot({path: 'screenshots/github.png'});

  browser.close();
}

run();