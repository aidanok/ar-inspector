<template>
  <div>
    
    <div v-if="txDetectedContentType === 'json'">
      <json-tree :raw="txDataString" level=2></json-tree>
    </div>

    <div v-if="txDetectedContentType === 'string'">
      {{ txDataString }}
    </div>

    <div v-if="txDetectedContentType === 'web'">
      <iframe style="width: 100%; height: 60em;" :src="`https://arweave.net/${tx.id}`">
      </iframe>
    </div>

    <div v-if="txDetectedContentType === 'unknown'">
      Unable to detect or display content.
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Transaction from 'arweave/web/lib/transaction';
import JsonTree from 'vue-json-tree';
 
export default Vue.extend({
  
  components: { JsonTree },

  props: {
    tx: {
      type: Object as () => Transaction,
      required: true, 
    }
  },

  data: () => ({
    txDetectedContentType: 'unknown' as ('unknown' | 'json' | 'string' | 'web'),
    txDataString: '',
    txDataJson: null as any, 
    isValidJson: false, 
  }),

  created() {
    this.detectContent();
  },

  methods: {
    detectContent: function(): void {
      const tarray = this.tx.get('tags') as any as any[];
    
      let contentType = '';
      
      tarray.forEach((tag: any) => {
        let key = tag.get('name', {decode: true, string: true}) as string;
        let value = tag.get('value', {decode: true, string: true}) as string;
        if (key.toLowerCase() === 'content-type') {
          contentType = value;
        }
      });

      if (contentType && contentType.toLowerCase().indexOf('json') === -1) {
        this.txDetectedContentType = 'web';
        return; 
      }

      // If encoded data is < 1mb, try decode as string, then as json. 
      if (this.tx.data.length < 1024*1024) {
        try {
          const str = this.tx.get('data', { decode: true, string: true });
          this.txDetectedContentType = 'string'
          this.txDataString = str;
          const parsed = JSON.parse(str);
          this.txDetectedContentType = 'json'
        }
        catch (e) {
          
        }
      }

      if (this.txDetectedContentType === 'json') {
        return; 
      }

      if (contentType) {
        this.txDetectedContentType = 'web';
      }

    }
  },



})
</script>