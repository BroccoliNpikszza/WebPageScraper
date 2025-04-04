import time
import json
import argparse
import sys
sys.stdout.reconfigure(encoding='utf-8') #ignore if not windows (added this line cause win powershell ass and doesn't use utf-8 encoding by default)
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common import service
from webdriver_manager.chrome import ChromeDriverManager
from fake_useragent import UserAgent


chrome_options = Options()
# chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--headless')
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--nogpu")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1280,1280")
chrome_options.add_argument("--enable-javascript")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)
chrome_options.add_argument('--disable-blink-features=AutomationControlled')

ua = UserAgent()
userAgent = ua.random
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": userAgent})

url = ""
tagName = ""
className = ""
idName = ""

def parseArgs():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--tag", default="")
    parser.add_argument("--classes", default="")
    parser.add_argument("--id", default="")

    args = parser.parse_args()

    return args

args = parseArgs()

url = args.url
tagName = args.tag
className = args.classes
idName = args.id



driver.get(url)
time.sleep(10)


soup = BeautifulSoup(driver.page_source)

website = {
    "url": url,
    "body": soup.get_text(separator="\n", strip=True),
    "tag_content": str(soup.find_all(tagName)) if tagName else "",
    "class_content": str(soup.find_all(class_=className)) if className else "",
    "id_content": str(soup.find(id=idName)) if idName else ""
}

print (json.dumps(website))

driver.quit()

sys.stdout.flush()
