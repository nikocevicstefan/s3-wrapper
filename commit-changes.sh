#!/bin/bash

# Set git user configuration
git config --global user.name 'github-actions[bot]'
git config --global user.email 'github-actions[bot]@users.noreply.github.com'

# Add changes
git add .

# Commit changes with the correct message
git commit -m "chore(release): version packages" --no-verify
