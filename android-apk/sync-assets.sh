#!/bin/bash
# Sync web assets from project root to android-apk/www/
# This ensures the APK bundles the latest web application

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")"
WWW_DIR="$SCRIPT_DIR/www"

echo "Syncing web assets..."
echo "Source: $SOURCE_DIR"
echo "Dest:   $WWW_DIR"

# Create www directory if needed
mkdir -p "$WWW_DIR"

# Copy all web assets (excluding android-apk itself and git)
rsync -av --delete \
  --exclude='android-apk' \
  --exclude='.git' \
  --exclude='node_modules' \
  "$SOURCE_DIR/" "$WWW_DIR/"

echo ""
echo "Sync complete. Files in www/:"
find "$WWW_DIR" -type f | wc -l
echo "files synced."
