const puppeteer = require('puppeteer')

//  老司机的地址
const url = `https://lao4g.win/`

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
    // 获取所有的图片的dom元素
    var elems = document.querySelectorAll('.fit a')
    console.log('elems', elems)
    
    var values = Array.prototype.map.call(elems, function(obj) {
      console.log('obj', obj)
      return {
        title:obj.innerHTML,
        href:obj.href
      }
    });
    console.log('values', values)
    return values
  })
  console.log('所有的标题', title)


  // 5.触发点击
  await page.click('.fit a')
  console.log('测试一下')
  // 



  // 4.做个延时 等待1000毫秒
  // await sleep(1000)

  // 5.分析网页结构 获取封面图
  const result = await page.evaluate(() => {
    var $ = window.$   // 获取全局对象$ 其实就是jq  ps:这个页面有jq才能拿到没有的话就无法拿到
    var it = $('.related-pic-video') // 找到这个对象dom
    if ( it && it.length > 0) {
      var link = it.attr('href')   // 获取dom元素上面的跳转地址
      var cover = it.find('img').attr('src')   // 获取封面图
      return {
        link,
        cover
      }
    }
    return {}
  })
  console.log('result=',result)
  
  // 6.分析网页结构 爬取视频
  let video

  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'  // 考虑网络没有超过0时完成网络连接至少500 ms。      
    })
    await sleep(2000)

    // page.evaluate是在页面中执行的代码
    video = await page.evaluate(() => {
      var $ = window.$ // 拿到jquery
      var it = $('source')

      //判断dom节点是否存在
      if (it && it.length > 0) {
        return it.attr('src')
      }
      return ''      
    })
  }

  const data = {
    video,
    doubanId,
    cover:result.cover
  }
  console.log('data',data)


  // 6.关闭浏览器
  browser.close()

})()
