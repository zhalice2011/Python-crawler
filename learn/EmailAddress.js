

const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false, // 可以让他打开网页
    executablePath:'/private/var/folders/0c/r32jpgps1q31hmn8r4lb_r080000gn/T/AppTranslocation/E200E596-4D1F-4F19-A27F-E9DBB971A2E2/d/Chromium.app/Contents/MacOS/Chromium',
    args: ['--allow-no-sandbox-job'], // --allow-no-sandbox-job:这个标志可以减少的安全沙箱进程和允许他们做某些API调用关闭窗口或访问剪贴板。我们也失去了机会杀死一些过程,直到外拥有他们完成的工作
    dumpio: false // 浏览器是否管过程stdout和stderr进的过程。stdout和process.stderr。默认值为false
  })
  const page = await browser.newPage();
  // 搜索john的用户
  const userToSearch = 'john';
  const searchUrl = 'https://github.com/search?q=' + userToSearch + '&type=Users&utf8=%E2%9C%93';
  await page.goto(searchUrl);
  await page.waitFor(2*1000);

  // 每个包裹用户信息的item
  const USER_LIST_INFO_SELECTOR = '.user-list-item';
  // 用户名的em标签
  const USER_LIST_USERNAME_SELECTOR = '.user-list-info>a:nth-child(1)';
  // 用户名的em标签
  const USER_LIST_EMAIL_SELECTOR = '.user-list-info>.user-list-meta .muted-link';

  const users = await page.evaluate((sInfo, sName, sEmail) => {
    const $els = document.querySelectorAll(sInfo); // 获取所有的user-list-item
    // 遍历所有的item



  },USER_LIST_INFO_SELECTOR, USER_LIST_USERNAME_SELECTOR, USER_LIST_EMAIL_SELECTOR)

}

run();





