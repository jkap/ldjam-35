#!/bin/sh
gulp build
git add dist
git commit -m "Deploying to gh-pages"
git subtree push --prefix dist origin gh-pages
