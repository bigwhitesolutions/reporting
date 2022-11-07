import { useEffect, useState } from "react";
import { QueryResultJson, Query, QuerySelect, jsonifyQuery } from "flowerbi";
import { Product } from "../AdventureWorks2019Schema";
import "./App.css";
import { localFetch } from "./api-helpers";
import { Columns } from "./Components/Columns";
import { TableDefinitions } from "./schema-helpers";

function App() {
  const [data, setData] = useState<QueryResultJson | undefined>(undefined);
  const [query, setQuery] = useState<Query<QuerySelect>>({
    select: {
      productCount: Product.ProductId.count(),
    },
    totals: false,
  });

  useEffect(() => {
    localFetch(jsonifyQuery(query)).then((x) => {
      setData(x);
    });
  }, [query]);

  if (!data || !data.records) return <>Loading</>;

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-4">
          <div className="sticky top-0 p-4 w-full h-full">
            <Columns setQuery={setQuery} />
          </div>
        </div>
        <main role="main" className="w-full flex-grow pt-1 px-3 mb-auto">
          {data.totals
            ? `Total: ${JSON.stringify(data.totals?.aggregated[0])}`
            : undefined}
          <table>
            <thead>
              <tr>
                {Object.keys(query.select).map((selectKeys) => (
                  <th>
                    {TableDefinitions.filter(
                      (tableDefinitions) => tableDefinitions.name === selectKeys
                    )[0]?.field ?? selectKeys}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.records.length > 0
                ? data.records?.map((records) => {
                    return (
                      <tr>
                        {records.aggregated?.map((selectedRecords) => (
                          <td key={selectedRecords?.toString() ?? -1}>
                            {selectedRecords}
                          </td>
                        ))}
                        {records.selected?.map((selectedRecords) => (
                          <td key={selectedRecords?.toString() ?? -1}>
                            <>{selectedRecords}</>
                          </td>
                        ))}
                      </tr>
                    );
                  })
                : undefined}
            </tbody>
          </table>
        </main>
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
          <div className="flex sm:flex-col px-2"></div>
        </div>
      </div>
      <footer className="mt-auto left-0 bottom-0 absolute">
        <textarea
          readOnly={true}
          cols={100}
          rows={4}
          value={JSON.stringify(jsonifyQuery(query))}
        ></textarea>
      </footer>
    </div>
  );
}

export default App;
