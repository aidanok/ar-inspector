
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { arBlocks, BlockWatcherOptions, SyncResult } from 'ar-block-sync';
import { BlockTransaction } from 'ar-block-sync/dist-types/types';
import { UserFilters } from './filters';
import { Notifications } from './notifications';

import VueRouter from 'vue-router';

import $router from '../router';


const blockWatcherOptions: Partial<BlockWatcherOptions>  = {
  startupDelay: 0.5,
  minPollTime: 46,
  maxPollTime: 110,
  blocksToSync: 40,
  persist: true,
  retrieveTags: true,
}

export interface SharedState {
  userFilters: UserFilters
  blocks: Observable<SyncResult>
  transactions: Observable<BlockTransaction[]>
  notifications: Notifications,
}

export function getSharedState(): SharedState {
  
  const blocks = arBlocks(blockWatcherOptions);
  console.info(`Creating shared state`);

  const transactions = blocks.pipe(
    map(sync => {

      const txs = [] as BlockTransaction[];
      sync.list.forEach(b => {
        b.transactions.forEach(tx => {
          const t = { id: tx.id, tags: tx.tags || [] }
          txs.push(t);
          // Add some extra tags if they dont already exist: 
          if (!t.tags.find(x => x.name === 'block_height')) {
            t.tags.push({ name: 'block_height', value: b.info.height.toString() }) 
          }
          if (!t.tags.find(x => x.name === 'block_timestamp')) {
            t.tags.push({ name: 'block_timestamp', value: b.info.timestamp.toString() }) 
          }
        })
      })

      return txs;
    })
  )

  const userFilters = new UserFilters();
  const notifications = new Notifications(transactions, userFilters, $router);

  return {
    userFilters,
    blocks,
    transactions,
    notifications
  }
}