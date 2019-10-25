import { Observable } from 'rxjs';
import { BlockTransaction } from 'ar-block-sync/dist-types/types';
import { UserFilters } from './filters';
import VueRouter from 'vue-router';

export class Notifications {
  
  seenTxs = [] as string[];
  started = false; 

  constructor(private transactions: Observable<BlockTransaction[]>, private userFilters: UserFilters, private $router: VueRouter) {
    try {
      this.seenTxs = JSON.parse(localStorage.getItem('notificationsSeenTxs')!)
    } catch (e) {

    }
    if (!Array.isArray(this.seenTxs)) {
      this.seenTxs = [];
    }
    
    transactions.subscribe(x => this.onTransactions(x))
  }

  onTransactions(inTransactions: BlockTransaction[]) {

    const toNotify = {} as Record<string, BlockTransaction[]>;

    // Search for txs we haven't seen yet. 
    inTransactions.forEach(tx => {
      if (this.seenTxs.indexOf(tx.id) === -1) {
        const filterIdx = this.userFilters.checkTxNotification(tx);
        if (filterIdx !== undefined) {
          this.seenTxs.push(tx.id);
          if (!toNotify[filterIdx]) {
            toNotify[filterIdx] = [ tx ];
          } else { 
            toNotify[filterIdx].push(tx);
          }
        }
      }
    })
    // Remove TXs that are gone
    this.seenTxs = this.seenTxs.filter(seen => inTransactions.findIndex(tx => tx.id === seen) !== -1);
    // save seen list. 
    localStorage.setItem('notificationsSeenTxs', JSON.stringify(this.seenTxs));

    Object.entries(toNotify)
      .forEach(kv => this.sendNotification(kv[0], kv[1]));

  }

  sendNotification(filterIdx: string | number, txs: BlockTransaction[]) {
    filterIdx = parseInt(filterIdx.toString());

    console.log(`Sending notification for ${txs.map(tx => tx.id.substr(0, 5)).join(',')}`);

    // TODO: multiple txs, just get the last one for now. 
    txs = txs.splice(-1);

    if (txs.length === 1) {
      const tx = txs[0];
      // Single TX. 
      const filter = this.userFilters.filters[filterIdx];
      const n = new Notification('TX notification', { tag: filter.filterName, body: `A transaction matched your filter - ${filter.filterName}` })
      n.onclick = (e) => {
        console.log('Got OnClick');
        window.focus();
        this.$router.push(`/transaction/${tx.id}`);
      }
    }
  }
}