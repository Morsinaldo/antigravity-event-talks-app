import time
import xml.etree.ElementTree as ET
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# In-memory cache for release notes
# Structure: { "data": [...], "timestamp": float }
FEED_CACHE = {
    "data": None,
    "timestamp": 0
}
CACHE_DURATION_SECS = 300  # 5 minutes cache
FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def create_sub_item(item_type, elements, entry_title, entry_link):
    """
    Creates a parsed sub-item dictionary from a collection of BeautifulSoup elements.
    """
    html_content = "".join(str(el) for el in elements)
    text_soup = BeautifulSoup(html_content, 'html.parser')
    
    # Format links nicely for plain text sharing
    for a in text_soup.find_all('a'):
        href = a.get('href')
        link_text = a.get_text()
        if href:
            if link_text.strip().lower() in href.lower() or href.lower() in link_text.strip().lower():
                a.replace_with(href)
            else:
                a.replace_with(f"{link_text} ({href})")
                
    plain_text = text_soup.get_text(separator=' ', strip=True)
    
    # Determine badge styling class
    badge_class = "badge-info"
    type_lower = item_type.lower()
    if "feature" in type_lower:
        badge_class = "badge-feature"
    elif "issue" in type_lower or "bug" in type_lower:
        badge_class = "badge-issue"
    elif "deprecation" in type_lower or "removed" in type_lower:
        badge_class = "badge-deprecation"
    elif "fixed" in type_lower or "resolved" in type_lower:
        badge_class = "badge-fixed"
        
    return {
        "type": item_type,
        "badge_class": badge_class,
        "html": html_content,
        "text": plain_text,
        "entry_title": entry_title,
        "entry_link": entry_link
    }

def parse_html_content(html_str, entry_title, entry_link):
    """
    Parses the CDATA HTML content of a feed entry and splits it into discrete sub-items.
    """
    if not html_str:
        return []
    soup = BeautifulSoup(html_str, 'html.parser')
    sub_items = []
    
    current_type = "Update"
    current_content_elements = []
    
    # Iterate through sibling elements to group them under their respective <h3> header.
    for element in soup.contents:
        if element.name == 'h3':
            if current_content_elements:
                sub_items.append(create_sub_item(current_type, current_content_elements, entry_title, entry_link))
                current_content_elements = []
            current_type = element.get_text(strip=True)
        elif element.name:
            current_content_elements.append(element)
        elif isinstance(element, str) and element.strip():
            current_content_elements.append(element)
            
    if current_content_elements:
        sub_items.append(create_sub_item(current_type, current_content_elements, entry_title, entry_link))
        
    return sub_items

def fetch_and_parse_feed():
    """
    Fetches the BigQuery Atom feed, parses it, and structures the entries.
    """
    try:
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
        
        root = ET.fromstring(response.content)
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        entries = root.findall('atom:entry', ns)
        parsed_entries = []
        
        for entry in entries:
            title = entry.find('atom:title', ns)
            title_text = title.text if title is not None else "Unknown Date"
            
            updated = entry.find('atom:updated', ns)
            updated_text = updated.text if updated is not None else ""
            
            link_el = entry.find('atom:link[@rel="alternate"]', ns)
            link_href = link_el.attrib['href'] if link_el is not None else ""
            
            content_el = entry.find('atom:content', ns)
            content_html = content_el.text if content_el is not None else ""
            
            sub_items = parse_html_content(content_html, title_text, link_href)
            
            parsed_entries.append({
                "title": title_text,
                "updated": updated_text,
                "link": link_href,
                "sub_items": sub_items
            })
            
        return parsed_entries
    except Exception as e:
        print(f"Error parsing feed: {e}")
        raise e

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/releases')
def get_releases():
    force_refresh = request.args.get('refresh', 'false').lower() == 'true'
    current_time = time.time()
    
    # Check cache validity
    if (FEED_CACHE["data"] is None or 
        force_refresh or 
        (current_time - FEED_CACHE["timestamp"]) > CACHE_DURATION_SECS):
        try:
            releases = fetch_and_parse_feed()
            FEED_CACHE["data"] = releases
            FEED_CACHE["timestamp"] = current_time
            source = "network"
        except Exception as e:
            # Fallback to cache if network call fails
            if FEED_CACHE["data"] is not None:
                return jsonify({
                    "success": True,
                    "releases": FEED_CACHE["data"],
                    "source": "cache_fallback",
                    "error": str(e),
                    "last_updated": FEED_CACHE["timestamp"]
                })
            return jsonify({
                "success": False,
                "error": f"Failed to fetch feed: {str(e)}"
            }), 500
    else:
        releases = FEED_CACHE["data"]
        source = "cache"
        
    return jsonify({
        "success": True,
        "releases": releases,
        "source": source,
        "last_updated": FEED_CACHE["timestamp"]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
