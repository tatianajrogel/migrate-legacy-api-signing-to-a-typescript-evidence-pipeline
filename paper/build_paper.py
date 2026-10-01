"""Builds paper.html from paper.md with the figures inlined, then paper.pdf.

Needs the `markdown` package (pip install markdown) and Microsoft Edge or
Google Chrome for the PDF. Run the figure generator first:

    node paper/figures/build_figures.mjs
    python paper/build_paper.py
"""
import re
import shutil
import subprocess
from pathlib import Path

import markdown

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "paper.md"
HTML = HERE / "paper.html"
PDF = HERE / "paper.pdf"

CSS = """
body{font-family:Georgia,'Times New Roman',serif;font-size:11pt;line-height:1.45;max-width:7in;margin:0.6in auto;color:#111}
h1{font-size:18pt;line-height:1.2;margin-top:0} h2{font-size:13.5pt;margin-top:1.4em} h3{font-size:11.5pt}
table{border-collapse:collapse;font-size:9pt;margin:0.6em 0;width:100%} th,td{border:1px solid #999;padding:3px 5px;vertical-align:top;text-align:left}
code{font-family:Consolas,Menlo,monospace;font-size:9.5pt} p{margin:0.45em 0;text-align:justify}
figure{margin:0.8em 0;page-break-inside:avoid} figure svg{max-width:100%;height:auto;display:block}
@page{size:Letter;margin:0.9in} @media print{body{margin:0;max-width:none}}
"""

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "msedge", "google-chrome", "chromium",
]


def main():
    body = markdown.markdown(SOURCE.read_text(encoding="utf-8"), extensions=["tables", "fenced_code"])
    # Inline every referenced SVG so the HTML and the PDF stand on their own.
    for ref in re.findall(r'src="(figures/[^"]+\.svg)"', body):
        svg = (HERE / ref).read_text(encoding="utf-8")
        body = re.sub(rf'<img alt="[^"]*" src="{re.escape(ref)}" ?/?>', lambda _m: f"<figure>{svg}</figure>", body)
    title = re.search(r"^# (.+)$", SOURCE.read_text(encoding="utf-8"), re.M).group(1)
    HTML.write_text(
        f"<!doctype html><html><head><meta charset='utf-8'><title>{title}</title><style>{CSS}</style></head><body>{body}</body></html>",
        encoding="utf-8",
    )
    print(f"wrote {HTML.name}")

    browser = next((b for b in BROWSERS if Path(b).exists() or shutil.which(b)), None)
    if browser is None:
        print("no Edge or Chrome found; open paper.html and print it to PDF")
        return
    profile = HERE / ".browser-profile"
    subprocess.run(
        [browser, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={profile}",
         "--no-pdf-header-footer", f"--print-to-pdf={PDF}", HTML.resolve().as_uri()],
        check=False, capture_output=True, timeout=120,
    )
    shutil.rmtree(profile, ignore_errors=True)
    if PDF.exists():
        pages = len(re.findall(rb"/Type\s*/Page[^s]", PDF.read_bytes()))
        print(f"wrote {PDF.name}, {pages} pages")
    else:
        print("the browser did not write the PDF; open paper.html and print it")


if __name__ == "__main__":
    main()
