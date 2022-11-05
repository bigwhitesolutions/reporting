import { useEffect, useState } from 'react'
import { QueryResultJson, Query, QuerySelect, jsonifyQuery } from "flowerbi";
import { Product, ProductSubcategory } from '../AdventureWorks2019Schema';
import './App.css'
import { localFetch, query } from './api-helpers';

const nameOf = (f: any) => (f).toString().replace(/[ |\(\)=>]/g,'');

const Tables: string[] = [ nameOf(() => Product), nameOf(() => ProductSubcategory) ]


function App() {
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
    {Tables.map(x=> (<div>{x}</div>))}
    {data.records.map((x, i)=> (
      <div key={i}><>Item:{x.selected[0]}({x.aggregated[0]})</></div>
    ))}
    </div>)
}

export default App
