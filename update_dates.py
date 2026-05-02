#!/usr/bin/env python3
"""
update_dates.py
---------------
Regenerates the 14-day availability cards in index.html.
Run locally or automatically via GitHub Actions every week.
"""

import re
from datetime import date, timedelta

# ── Date helpers ──────────────────────────────────────────────────────────────
DOW    = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']  # weekday() 0=Mon
MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec']

def build_card(d: date, is_today: bool) -> str:
    dow       = d.weekday()          # 0=Mon … 6=Sun
    is_eve    = dow < 3              # Mon/Tue/Wed → evenings only
    tag_text  = 'Evenings<br>5pm–8pm' if is_eve else 'All Day<br>8am–8pm'
    tag_class = 'tw-tag-eve'         if is_eve else 'tw-tag-full'
    today_cls = ' tw-today'          if is_today else ''
    tip       = 'Available 5pm–8pm'  if is_eve else 'Available 8am–8pm'

    return (
        f'<div class="tw-day tw-available{today_cls}" title="{tip}">\n'
        f'          <div class="tw-dow">{DOW[dow]}</div>\n'
        f'          <div class="tw-date">{d.day}</div>\n'
        f'          <div class="tw-month">{MONTHS[d.month - 1]}</div>\n'
        f'          <div class="tw-tag {tag_class}">{tag_text}</div>\n'
        f'        </div>'
    )

# ── Generate cards ────────────────────────────────────────────────────────────
today  = date.today()
week1  = '\n        '.join(build_card(today + timedelta(days=i), i == 0) for i in range(7))
week2  = '\n        '.join(build_card(today + timedelta(days=i), False)  for i in range(7, 14))

# ── Patch index.html ──────────────────────────────────────────────────────────
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace contents of grid-week1
html = re.sub(
    r'(<div class="two-week-grid" id="grid-week1">).*?(\n      </div>)',
    lambda m: m.group(1) + '\n        ' + week1 + m.group(2),
    html, flags=re.DOTALL, count=1
)

# Replace contents of grid-week2
html = re.sub(
    r'(<div class="two-week-grid" id="grid-week2">).*?(\n      </div>)',
    lambda m: m.group(1) + '\n        ' + week2 + m.group(2),
    html, flags=re.DOTALL, count=1
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Dates updated — week starting {today.strftime('%d %b %Y')}")
