
import { QueryJson, QueryResultJson, Query, QuerySelect, jsonifyQuery } from "flowerbi";
import { Product, ProductSubcategory } from '../AdventureWorks2019Schema';
import { useEffect, useState } from 'react';

export async function localFetch(queryJson: QueryJson): Promise<QueryResultJson> {

  const response = await fetch("/api/QueryDatabase", {
      method: "POST",
      cache: "no-cache",
      mode: 'cors',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(queryJson),
  });
  return !response.ok ? [] : JSON.parse(await response.text());
}

const query: Query<QuerySelect> = {
  select: {
    name: ProductSubcategory.Name,
    productCount:Product.ProductId.count()
  },  
  totals: true

}

export default function Home() {
  var [ data, setData ] = useState<QueryResultJson | undefined>(undefined)
  
  useEffect(() => {
    localFetch(jsonifyQuery(query))
    .then(x => {
      setData(x)
    }
    );
  }, [])

  if (!data || !data.records) return <>Loading</>

  return (
    <div>
    {data.records.map((x, i)=> (
      <div key={i}><>Item:{x.selected[0]}({x.aggregated[0]})</></div>
    ))}
    </div>)
}
