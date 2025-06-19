import os
import re
import json
from pathlib import Path

def extract_title_from_content(html_content):
    """Extracts the title from a string of HTML content."""
    match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def main():
    """Scans for HTML files, extracts titles, and prints a JSON report."""
    base_dir = Path("/Users/gaia/FUSE/")
    html_files_data = []
    
    print(f"Scanning for HTML files in: {base_dir}\n")
    
    # First, get a list of all html files to provide a complete picture
    all_html_paths = sorted(list(base_dir.glob("*.html")))
    
    file_titles = {}

    for file_path in all_html_paths:
        filename = file_path.name
        title = "Error: Could not read title"
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                # Read a limited amount of the file, as title is usually near the top
                content_chunk = f.read(8192) # Read first 8KB
            extracted = extract_title_from_content(content_chunk)
            if extracted:
                title = extracted
                print(f"Successfully processed: {filename} - Title: {title}")
            else:
                title = "Title tag not found or empty"
                print(f"Processed (no title tag): {filename}")
        except FileNotFoundError:
            title = "Error: File not found during processing"
            print(f"Error: File not found - {filename}")
        except Exception as e:
            title = f"Error: {str(e)}"
            print(f"Error processing {filename}: {e}")
        file_titles[filename] = title

    output_file_path = base_dir / "file_titles.json"
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(file_titles, f, indent=2, ensure_ascii=False)
        print(f"\nSuccessfully wrote titles to: {output_file_path}")
    except Exception as e:
        print(f"\nError writing JSON to file: {e}")

if __name__ == "__main__":
    main()
