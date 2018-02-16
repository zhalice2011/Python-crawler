const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

//  老司机的地址
const url = `https://lao4g.win/`

// 连接数据库
mongoose.connect('mongodb://localhost/lao4g',() => {
  console.log('Mongodb Connect to lao4g')
});

// 定义一个数据表
const Article = mongoose.model('Article', {
  href: String,
  title: String,
  time: String,
  content: String
});

// 定义一个promise的定时函数
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

// 自运行函数
;(async () => {
  console.log(`Start visit the target page`)
  // 1.配置浏览器参数
  const browser = await puppeteer.launch({
    headless: false, // 可以让他打开网页
    executablePath:'/private/var/folders/0c/r32jpgps1q31hmn8r4lb_r080000gn/T/AppTranslocation/E200E596-4D1F-4F19-A27F-E9DBB971A2E2/d/Chromium.app/Contents/MacOS/Chromium',
    args: ['--allow-no-sandbox-job'], // --allow-no-sandbox-job:这个标志可以减少的安全沙箱进程和允许他们做某些API调用关闭窗口或访问剪贴板。我们也失去了机会杀死一些过程,直到外拥有他们完成的工作
    dumpio: false // 浏览器是否管过程stdout和stderr进的过程。stdout和process.stderr。默认值为false
  })

  // 2.开启新的页面
  const page = await browser.newPage()
  // 3.打开要爬取的页面
  await page.goto(url, {
    waitUntil: 'networkidle2'  // 考虑网络没有超过0时完成网络连接至少500 ms。
  })
  // 4.获取所有的标题和对应的地址
  const title = await page.evaluate(() => {
    // 获取所有的a标签
    var elems = document.querySelectorAll('.torso .fit a')
    console.log('elems', elems)
    var values = Array.prototype.map.call(elems, function(obj) {
      return {
        title:obj.innerHTML,
        href:obj.href
      }
    });
    console.log('values', values)
    return values
  })
  console.log('所有的标题', title)

  for ( var i =0; i < title.length; i++) {
    // 3.打开要爬取的页面
    console.log('title[i].href', title[i].href)
    await page.goto(title[i].href, {
      waitUntil: 'networkidle2'  // 考虑网络没有超过0时完成网络连接至少500 ms。
    })
    // 4.抓取数据写入数据库
    const content = await page.evaluate(() => {
      // 获取内容的的标签
      var elem = document.querySelector('.content')
      // 获取时间的标签
      var time = document.querySelector('time')
      // 获取内容
      return {
        time:time.innerHTML,
        content:elem.innerHTML
      }
    })
    const newobj = Object.assign({
      href:title[i].href,
      title:title[i].title
    },content)
    // console.log('content',newobj)
    var kitty = new Article(newobj);
    // 调用 .save 方法后，mongoose 会去你的 mongodb 中的 test 数据库里，存入一条记录。
    kitty.save(function (err,doc) {
      if (err) console.log(err)
      console.log('保存成功',doc.title);
    });    
  }
  browser.close()
  // 5.触发点击

  // 4.做个延时 等待1000毫秒

  // await sleep(1000)

  // 5.分析网页结构 获取封面图

  // 6.我还是很喜欢你啊 

  // 7.关闭浏览器

  // browser.close()
  
})()
