import sys, requests

url = sys.argv[1]
response = requests.get(url)

print(response.text)
sys.stdout.flush()
