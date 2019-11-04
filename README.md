# ar-inspector

Tool to monitor and inspect transactions on the Arweave Blockchain 

Intented mostly as a developer aid, but curious people can use to watch the content on the blockchain.

Simple usage: 

- Create a filter that matches your apps data tx (for example, maching your `App-Name` tag ) 
- Apply filter in TX list , see TXs in the last ~1.5hours that match, click to inspect transaction
- Optionally enable desktop notifications to get notified when new data matching your filter gets mined. 
- JSON content in your data txs will be displayed in a friendly tree-view in the inspect tx page. 

Uses: https://github.com/aokisok/ar-block-sync to synchronize the last 40 blocks to your browser storage and get 
notified of new blocks & txs. 


Current deployed version at: https://aokisok.github.io/ar-inspector/latest.html 

You can use the above url and append #tx/TX_ID to jump to view transaction page directly. 


# Contributing 

This is a pretty standard Vue 2.x project, created with vue-cli. One slight divergence from standard Vue is we use 
stand-alone CSS files, under public/css, so they can be live edited and saved from chrome dev-tools.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

