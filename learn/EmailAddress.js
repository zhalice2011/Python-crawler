

const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false, // 可以让他打开网页
    executablePath:'/private/var/folders/0c/r32jpgps1q31hmn8r4lb_r080000gn/T/AppTranslocation/C90DA25B-E966-4BD6-9B41-3F5FAE03BC74/d/Chromium.app/Contents/MacOS/Chromium',
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
  // 用户头像
  const USER_LIST_AVATAR_SELECTOR = '.d-flex>.avatar.position-relative';

  const users = await page.evaluate((sInfo, sName, sEmail) => {
    var $els = document.querySelectorAll(sInfo); // 获取所有的user-list-item
    var values = Array.prototype.map.call($els, function(obj) {
      // 用户名
      var username = obj.querySelector(sName).innerText;
      // 用户头像
      //var userAvatar = document.querySelector(".avatar.position-relative").src;
      var userAvatar = document.querySelector(".avatar.position-relative").getAttribute("src");
      return {
        username: username,
        userAvatar: userAvatar
      }
    })
    return values
    // Array.prototype.map.call
    // var values = Array.prototype.map.call(elems, function(obj) {
    //   return {
    //     title:obj.innerHTML,
    //     href:obj.href
    //   }
    // });
    // 遍历所有的item
    // return Array.prototype.slice.apply($els)
    // .map($userListItem => {
    //   // 用户名
    //   var username = $userListItem.querySelector(sName).innerText;

    //   // 邮箱
    //   var $email = $userListItem.querySelector(sEmail);
    //   var email = $email ? $email.innerText : undefined;
    //   return {
    //     username,
    //     email,
    //   };
    // })
    // // 过滤: 不是所有用户都显示邮箱
    // .filter(u => !!u.email);
  },USER_LIST_INFO_SELECTOR, USER_LIST_USERNAME_SELECTOR, USER_LIST_AVATAR_SELECTOR)
  console.log('users', users)
}

async function getNumPages(page) {
  const NUM_USER_SELECTOR = '#js-pjax-container > div.container > div > div.column.three-fourths.codesearch-results.pr-6 > div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';

  let inner = await page.evaluate((sel) => {
    return document.querySelector(sel).innerHTML;
  }, NUM_USER_SELECTOR);

  // 格式是: "69,803 users"
  inner = inner.replace(',', '').replace(' users', '');
  const numUsers = parseInt(inner);
  console.log('numUsers: ', numUsers);

  /*
   * GitHub 每页显示 10 个结果
   */
  const numPages = Math.ceil(numUsers / 10);
  return numPages;
}

run();





