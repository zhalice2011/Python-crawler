import requests,urllib.request
import re
import sys ,os
import time
import multiprocessing
from bs4 import BeautifulSoup

headers = {
'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
}
proxies = {
'http':'127.0.0.1:1080'
}

pic_path = r"D://gmb_pic//"
global flag

def get_page(url):
global flag
try:
wb_data = requests.get(url,headers=headers,timeout=60,proxies=proxies)
status = wb_data.status_code
if status == 200 or status == 302:
wb_data.encoding = wb_data.apparent_encoding
html = wb_data.text
maxpage = re.findall('html">(\d+)</a> <a class="a1" ', html)[1]
maxpage = (int(maxpage) + 1) * 2
soup = BeautifulSoup(html,'lxml')
title = soup.select('div.main > div > a > img')[0].get('alt')
title = title.strip()
img = soup.select('div.main > div > a > img')[0].get('src')
imgurl = img.split('01.jpg')[0]
if maxpage:
flag = 1
allimg = [imgurl + str(num).zfill(2) + '.jpg' for num in range(1,int(maxpage))]
for link in allimg:
if not os.path.exists(pic_path + title):
os.mkdir(pic_path + title)
print('目录已创建:' + str(title))
download(link,title)
print('正在下载' + str(title) +'图集下第' + str(flag) + '张图片！')
else:
download(link,title)
print('正在下载' + str(title) + '图集下第' + str(flag) + '张图片！')
flag = flag + 1
else:
x = 1
while x <= 3:
get_page(url)
print(str(status) + ' 当前url： ' + str(url))
x += 1
print('已重试三次，无法获取链接，跳过此链接' + str(url))
pass
except TimeoutError as e:
y = 1
while y <= 3:
get_page(url)
y += 1
print('已重试三次，无法获取链接，跳过此链接' + str(url))
pass

def download(url,title):
filename = pic_path + str(title) + '/' + str(title) + str(flag) + '.jpg'
try:
response = requests.get(url,headers=headers,timeout=60)
status = response.status_code
if status == 200 or status == 302:
# urllib.request.urlretrieve(url,filename)
with open(filename,'wb') as f:
f.write(response.content)
f.close()
else:
# print(str(url) + str(status))
# pass
download(url,title)
except TimeoutError as e:
x = 1
while x <= 3:
print('当前错误为' + str(e) + '正在重试！\n')
download(url,title)
x += 1
print(str(url) + ' 重试三次后无响应，已跳过此链接！ \n')
pass

def get_urls():
urls = []
with open(pic_path + '/allurl.txt') as url:
for line in url.readlines():
line = line.strip('\n')
urls.append(line)
return urls

if __name__ == '__main__':
urls = get_urls()
pool = multiprocessing.Pool(processes=4)
r = pool.map(get_page,urls)
pool.close()
time.sleep(3)
pool.join()
