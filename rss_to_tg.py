import feedparser
import requests
from telegram import Bot
from telegram.constants import ParseMode
import xml.etree.ElementTree as ET
import json
import os
import time

# 配置（从环境变量获取）
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
CHANNEL_ID = os.getenv('CHANNEL_ID')  # 例如: '@your_rss_channel' 或 '-1001234567890'
OPML_URL = 'https://raw.githubusercontent.com/mofelo/BestBlogs/my-rss-tg/BestBlogs_RSS_ALL.opml'  # 您的分支 OPML
STATE_FILE = 'rss_state.json'  # 持久化文件

bot = Bot(token=TELEGRAM_TOKEN)

def parse_opml(url):
    """解析 OPML 文件获取 RSS 源列表"""
    response = requests.get(url)
    root = ET.fromstring(response.content)
    rss_feeds = []
    for outline in root.findall('.//outline'):
        if 'xmlUrl' in outline.attrib:
            rss_feeds.append(outline.attrib['xmlUrl'])
    return rss_feeds

def load_state():
    """加载最后更新状态"""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_state(state):
    """保存状态"""
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

def check_and_send_updates(rss_url, last_id):
    """检查 RSS 更新并发送到 TG"""
    feed = feedparser.parse(rss_url)
    if not feed.entries:
        return last_id
    
    new_entries = []
    for entry in feed.entries:
        entry_id = entry.get('id', entry.link)  # 使用 ID 或链接作为唯一标识
        if entry_id != last_id:
            new_entries.append(entry)
    
    for entry in reversed(new_entries):  # 最新先发
        title = entry.get('title', '无标题')
        summary = entry.get('summary', '')[:200] + '...' if entry.get('summary') else ''
        link = entry.get('link', '')
        message = f"<b>{title}</b>\n{summary}\n<a href='{link}'>阅读原文</a>"
        try:
            bot.send_message(chat_id=CHANNEL_ID, text=message, parse_mode=ParseMode.HTML, disable_web_page_preview=False)
        except Exception as e:
            print(f"发送消息失败: {e}")
    
    return feed.entries[0].get('id', feed.entries[0].link) if feed.entries else last_id

def main():
    feeds = parse_opml(OPML_URL)
    state = load_state()
    updated = False
    
    for feed_url in feeds[:10]:  # 限前 10 个源，避免初始过载；后续可调整
        last_id = state.get(feed_url, '')
        new_id = check_and_send_updates(feed_url, last_id)
        if new_id != last_id:
            state[feed_url] = new_id
            updated = True
        time.sleep(1)  # 避免 API 限速
    
    if updated:
        save_state(state)
    print("RSS 检查完成")

if __name__ == '__main__':
    main()
