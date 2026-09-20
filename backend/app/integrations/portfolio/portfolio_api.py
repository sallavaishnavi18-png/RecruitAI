import requests
from bs4 import BeautifulSoup


def get_portfolio_data(url):

    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        raise ValueError("Unable to access portfolio website.")

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.title.string if soup.title else ""

    text = soup.get_text(separator=" ", strip=True)

    return {
        "url": url,
        "title": title,
        "content": text
    }