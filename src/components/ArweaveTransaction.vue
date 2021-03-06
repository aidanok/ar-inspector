<template>
  <div class="arweave-transaction">
    <div> {{ block_height }} </div>
    <time-ago  class="arweave-transaction-time-ago" prefix="" :datetime="block_timestamp * 1000"></time-ago> 
    <router-link class="arweave-transaction-id-link" :to="`/tx/${transaction.id}`">{{ transaction.id }} </router-link>
    <router-link 
      class="arweave-transaction-tags" 
      v-tooltip="{ delay: 650, content: tagsTooltip }"
      :to="`/tx/${transaction.id}`"
    >
      {{ user_tags.map(tag => tag.name).slice(0, 8).join(',  ') || 'No Tags' }}
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BlockTransaction } from 'ar-block-sync/dist-types/types';
import { encodeTextForHtml } from '@/ui-lib/escape-html';

import TimeAgo from 'vue2-timeago';

export default Vue.extend({

  components: { TimeAgo },

  props: {
    transaction: {
      type: Object as () => BlockTransaction,
      required: true, 
    }
  },

  computed: {
    block_height: function(): string {
      const tag = this.transaction.tags && this.transaction.tags.find(x => x.name === 'block_height');
      return tag ? tag.value : ''
    },
    block_timestamp: function(): string {
      const tag = this.transaction.tags && this.transaction.tags.find(x => x.name === 'block_timestamp');
      return tag ? tag.value : ''
    },
    datetime: function() : string {
      return new Date(parseInt(this.block_timestamp) * 1000).toISOString();
    },
    user_tags: function(): { name: string, value: string }[] {
      return this.transaction.tags ? this.transaction.tags.filter(x => !x.name.startsWith('block_')) : [];
    },
    tagsTooltip: function(): string {
      return !this.transaction.tags ? 
          'No tags retrieved' 
          : 
          this.transaction.tags.map(tag => 
            `${encodeTextForHtml(tag.name)} : ${encodeTextForHtml(tag.value)}`).join('<br>')
    }
  }
})
</script>