# Amélie la vie website

Build by forking Gatsby + Netlify CMS Starter, using [Gatsby v2](https://www.gatsbyjs.org/blog/2018-09-17-gatsby-v2/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/37c0461c-22b9-48de-a2a4-17e6f6bc6ee7/deploy-status)](https://app.netlify.com/sites/amelielavie/deploys)

This repo contains all the source code of the **Amélie la vie** association.

It follows the [JAMstack architecture](https://jamstack.org) by using Git as a single source of truth, and [Netlify](https://www.netlify.com) for continuous deployment, and CDN distribution.

### Prerequisites

- Node (I recommend using v8.2.0 or higher)
- [Gatsby CLI](https://www.gatsbyjs.org/docs/)
- [Netlify CLI](https://github.com/netlify/cli)

### Access Locally

Pulldown a local copy of the Github repository Netlify created for you, with the name you specified in the previous step

```
$ git clone https://github.com/VictorGiroud/AmelieLaVie.git
$ cd AmelieLaVie
$ yarn
$ netlify dev # or ntl dev
```

This uses the new [Netlify Dev](https://www.netlify.com/products/dev/?utm_source=blog&utm_medium=netlifycms&utm_campaign=devex) CLI feature to serve any functions you have in the `lambda` folder.

To test the CMS locally, you'll need to run a production build of the site:

```
$ npm run build
$ netlify dev # or ntl dev
```

### Debugging

Windows users might encounter `node-gyp` errors when trying to npm install.
To resolve, make sure that you have both Python 2.7 and the Visual C++ build environment installed.

```
npm config set python python2.7
npm install --global --production windows-build-tools
```

[Full details here](https://www.npmjs.com/package/node-gyp "NPM node-gyp page")

MacOS users might also encounter some errors, for more info check [node-gyp](https://github.com/nodejs/node-gyp). We recommend using the latest stable node version.
