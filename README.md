# single-market-robot-simulator-db-studyfolder
![Build Status](https://github.com/DrPaulBrewer/single-market-robot-simulator-db-studyfolder/actions/workflows/node.js.yml/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/DrPaulBrewer/single-market-robot-simulator-db-studyfolder/badge.svg)](https://snyk.io/test/github/DrPaulBrewer/single-market-robot-simulator-db-studyfolder)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/DrPaulBrewer/single-market-robot-simulator-db-studyfolder.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/DrPaulBrewer/single-market-robot-simulator-db-studyfolder/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/DrPaulBrewer/single-market-robot-simulator-db-studyfolder.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/DrPaulBrewer/single-market-robot-simulator-db-studyfolder/alerts/)

Base class for study folders

## Breaking Changes for v3

* no longer compiled with Babel
* removed code that kept description and name synchronized between folders and files
* removed code for checking readOnly as upload/update are to be implemented in subclasses
* .getConfig() returns a Promise of the config.json contents, not `{config, folder:this}`
