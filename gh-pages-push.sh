#!/bin/sh
gulp build
git add dist
git commit -m "Deploying to gh-pages"
git push origin `git subtree split --prefix dist gh-pages`:gh-pages --force
