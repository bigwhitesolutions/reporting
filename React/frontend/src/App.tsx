import { useEffect, useRef, useState } from "react";
import { QueryResultJson, Query, QuerySelect, jsonifyQuery } from "flowerbi";
import { Product, ProductSubcategory } from "../AdventureWorks2019Schema";
import "./App.css";
import { localFetch } from "./api-helpers";

const TableValues = [
  ...Object.values(Product),
  ...Object.values(ProductSubcategory),
];

const TableDefinitions = TableValues.map((x) => {
  var nameSplit = x.name.split(".");
  return { name: x.name, table: nameSplit[0], field: nameSplit[1] };
});

function App() {
  const [data, setData] = useState<QueryResultJson | undefined>(undefined);
  const [query, setQuery] = useState<Query<QuerySelect>>({
    select: {
      name: ProductSubcategory.Name,
      productCount: Product.ProductId.count(),
    },
    totals: true,
  });

  const getData = () =>
    localFetch(jsonifyQuery(query)).then((x) => {
      setData(x);
    });

  useEffect(() => {
    getData();
  }, []);

  if (!data || !data.records) return <>Loading</>;

  return (
    <div className="min-h-screen flex">
      <nav className="w-56 flex-none px-2">
        Tables
        {TableDefinitions.map((x) => (
          <div key={x.name}>{x.name}</div>
        ))}
      </nav>

      <main className="flex-1 min-w-0 overflow-auto px-2">
        {data.records.map((x, i) => (
          <div key={i}>
            <>
              Item:{x.selected[0]}({x.aggregated[0]})
            </>
          </div>
        ))}
      </main>
      <textarea
        readOnly={true}
        rows={10}
        defaultValue={JSON.stringify(jsonifyQuery(query))}
      ></textarea>
    </div>
  );
}

export default App;
