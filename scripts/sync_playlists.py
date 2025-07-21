#!/usr/bin/env python3
"""
Script to synchronize playlist URLs from English template to all other languages.
Only updates spotifyPlaylist, deezerPlaylist, and appleMusicPlaylist fields.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any

def load_json_file(file_path: str) -> List[Dict[str, Any]]:
    """Load JSON file and return the data."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return []

def save_json_file(file_path: str, data: List[Dict[str, Any]]) -> bool:
    """Save data to JSON file."""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {file_path}: {e}")
        return False

def sync_playlist_urls():
    """Synchronize playlist URLs from English template to all other languages."""
    
    # Define paths
    base_path = Path("public/json/playlist")
    english_file = base_path / "en_playlist.json"
    
    # Load English template
    english_data = load_json_file(str(english_file))
    if not english_data:
        print("Failed to load English template")
        return
    
    print(f"Loaded English template with {len(english_data)} entries")
    
    # Get all language files (excluding English)
    language_files = []
    for file_path in base_path.glob("*_playlist.json"):
        if file_path.name != "en_playlist.json":
            language_files.append(file_path)
    
    print(f"Found {len(language_files)} language files to update")
    
    # Fields to synchronize
    fields_to_sync = ["spotifyPlaylist", "deezerPlaylist", "appleMusicPlaylist"]
    
    # Process each language file
    for lang_file in language_files:
        print(f"\nProcessing: {lang_file.name}")
        
        # Load language data
        lang_data = load_json_file(str(lang_file))
        if not lang_data:
            print(f"  Skipping {lang_file.name} - failed to load")
            continue
        
        # Track changes
        changes_made = 0
        
        # Update playlist URLs
        for i, entry in enumerate(lang_data):
            if i < len(english_data):
                english_entry = english_data[i]
                
                # Update each field if it exists in English template
                for field in fields_to_sync:
                    if field in english_entry and english_entry[field]:
                        if field not in entry or entry[field] != english_entry[field]:
                            entry[field] = english_entry[field]
                            changes_made += 1
                            print(f"    Updated {field} for entry {i+1}")
        
        # Save updated file
        if save_json_file(str(lang_file), lang_data):
            print(f"  ✅ Updated {lang_file.name} with {changes_made} changes")
        else:
            print(f"  ❌ Failed to save {lang_file.name}")

def main():
    """Main function."""
    print("🎵 Playlist URL Synchronization Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("public/json/playlist").exists():
        print("Error: Please run this script from the project root directory")
        return
    
    sync_playlist_urls()
    
    print("\n" + "=" * 50)
    print("✅ Synchronization complete!")

if __name__ == "__main__":
    main() 