from multiprocessing.pool import Pool
import requests,os
from bs4 import BeautifulSoup

def parse_page(url):
  r = requests.get(url)
  s = BeautifulSoup(r.content, 'lxml')
  return s

def get_title(url):
  temp=parse_page(url).select('#content > div.titlepic > h1')[0].get_text()
  title=temp[:temp.rfind('(')]
  return title

def get_page_count(url):
  temp = parse_page(url).select('#content > div.pages.listpage > a')[-1]['href']
  count = temp[temp.rfind('_')+1:temp.rfind('.')]
  return int(count)

def get__img_url(url):
  s=parse_page(url)
  temp=s.select('#content > div.bigpic.column_5_arc > a')

  urls=[]
  if temp:
    for i in temp:
      urls.append(i.img['src'])
  else:
    temp=s.select('#content > div.bigpic.column_1_arc > a')
    for i in temp:
      urls.append(i.img['src'])
  return urls

def write(img):
  name=img[img.rfind('/')+1:]
  with open(path+name,'wb') as f:
    f.write(requests.get(img).content)
    url='https://www.yaoraotu.com/meinv/siwa/8692.html'
    path='/Users/zhalice/Desktop/Python学习/妖娆网图片下载/'+get_title(url).strip()+'\\'



def main(img):
  write(img)

if __name__ == '__main__':
  if os.path.isdir(path):
    pass
  else:
    os.mkdir(path)
  print(path)
  imgs=[]
  for i in range(1,get_page_count(url)+1):
    page_url=url.replace('.html',"_"+str(i)+'.html')
    imgs.extend(get__img_url(page_url))
    if imgs:
      pool=Pool()
      pool.map(main,imgs)
