# ar-inspector

Tool to monitor and inspect transactions on the Arweave Blockchain 

Intented mostly as a developer aid, but curious people can use to watch the content on the blockchain.

Simple usage: 

- Create a filter that matches your apps data tx (for example, maching your `App-Name` tag ) 
- Apply filter in TX list , see TXs in the last ~1.5hours that match, click to inspect transaction
- Optionally enable desktop notifications to get notified when new data matching your filter gets mined. 
- JSON content in your data txs will be displayed in a friendly tree-view in the inspect tx page. 

 
 You can also add filters for things like `page:title` contains `Syria` for example to see when people are archiving
 web pages with Syria in the title


Uses: https://github.com/aokisok/ar-block-sync to synchronize the last 40 blocks to your browser storage and get 
notified of new blocks & txs. 


Current deployed version at: https://as7abt56xnbr.arweave.net/TAGTPXwZeja4g8ND6r8Qv77Of6G8yUqzv5ZS5cdqN74




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

