import { useEffect, useState } from 'react'
import { QueryResultJson, Query, QuerySelect, jsonifyQuery } from 'flowerbi'
import { Product } from '../AdventureWorks2019Schema'
import './App.css'
import { Columns } from './Components/Columns'
import { TableDefinitions } from './schema-helpers'
import localFetch from './api-helpers'

function App(): JSX.Element {
  const [data, setData] = useState<QueryResultJson | undefined>(undefined)
  const [query, setQuery] = useState<Query<QuerySelect>>({
    select: { productCount: Product.ProductId.count() },
    totals: false,
  })

  useEffect(() => {
    localFetch(jsonifyQuery(query))
      .then((x) => {
        setData(x)
      })
      // eslint-disable-next-line no-console
      .catch((x) => console.log(x))
  }, [query])

  if (data == null || data.records == null) return <>Loading</>

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-4">
          <div className="sticky top-0 p-4 w-full h-full">
            <Columns setQuery={setQuery} />
          </div>
        </div>
        <main role="main" className="w-full flex-grow pt-1 px-3 mb-auto">
          {data.totals != null
            ? `Total: ${JSON.stringify(data.totals?.aggregated[0])}`
            : undefined}
          <table>
            <thead>
              <tr>
                {Object.keys(query.select).map((selectKeys) => (
                  <th key={selectKeys}>
                    {TableDefinitions.filter(
                      (tableDefinitions) => tableDefinitions.name === selectKeys
                    )[0]?.field ?? selectKeys}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.records.length > 0
                ? data.records?.map((records, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={i}>
                      {records.aggregated?.map((selectedRecords) => (
                        <td key={selectedRecords?.toString() ?? -1}>
                          {selectedRecords}
                        </td>
                      ))}
                      {records.selected?.map((selectedRecords) => (
                        <td key={selectedRecords?.toString() ?? -1}>
                          {selectedRecords.toString()}
                        </td>
                      ))}
                    </tr>
                  ))
                : undefined}
            </tbody>
          </table>
        </main>
      </div>
      <footer className="mt-auto left-0 bottom-0 absolute">
        <textarea
          readOnly
          cols={100}
          rows={4}
          value={JSON.stringify(jsonifyQuery(query))}
        />
      </footer>
    </div>
  )
}

export default App
