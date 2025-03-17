import time
import sys

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common import service
from webdriver_manager.chrome import ChromeDriverManager


chrome_options = Options()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

url = sys.argv[1]

driver.get(url)

soup = BeautifulSoup(driver.page_source, features='lxml')

divs = soup.find_all("div")
for div in divs:
    print(div.get_text())

time.sleep(20)
driver.quit()

sys.stdout.flush()
