import Arweave from 'arweave/web';

/**
 * Uses GraphQL endpoint to read tags & metadata for a TX. 
 * 
 * @param id 
 */
export const readTxMetadata = async (id: string) => {
  
  const qlQuery = `query {
    transaction(id: "${id}") {
      id,
      tags {
        name,
        value
      }
    }
  }`
  
  const data = await 
    fetch(`https://arweave.net/arql`, { method: 'POST', body: JSON.stringify({ query: qlQuery }) })
    .then(resp => resp.json());
  

  if (data.data.transaction.id !== id || !Array.isArray(data.data.transaction.tags)) {
    console.error(data);
    throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
  }
  
  return data.data.transaction.tags as { name: string, value: string }[];
}

export const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443
})


/*const tx = await arweave.transactions.get(id);
const tags = tx.get('tags') as any;

this.tags.push({ name: 'from', value: await arweave.wallets.ownerToAddress(tx.from) })
this.tags.push({ name: 'target', value: tx.target })
this.tags.push({ name: 'quantity', value: tx.quantity })
this.tags.push({ name: 'reward', value: tx.reward });

tags.forEach((tag:any) => {
  const name = tag.get('name', { decode: true, string: true });
  const value = tag.get('value', { decode: true, string: true });
  this.tags.push({name, value});
})
*/