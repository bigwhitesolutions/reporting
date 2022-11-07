import { useEffect, useRef, useState } from 'react'
import { QueryResultJson, jsonifyQuery, QueryJson } from 'flowerbi'
import { Product } from '../AdventureWorks2019Schema'
import './App.css'
import { Columns } from './Components/Columns'
import { TableDefinitions } from './schema-helpers'
import localFetch from './api-helpers'

function localStorageItems(): Array<{
  key: string
  value: QueryJson | null
}> {
  const elements = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key?.startsWith('query-') === true) {
      const item = localStorage.getItem(key)
      if (item != null) {
        const obj = JSON.parse(item)
        elements.push({
          key: key?.substring(6),
          value: obj,
        })
      }
    }
  }
  return elements
}

function App(): JSX.Element {
  const [data, setData] = useState<QueryResultJson | undefined>(undefined)
  const [query, setQuery] = useState<QueryJson>(
    jsonifyQuery({
      select: { productCount: Product.ProductId.count() },
      totals: false,
    })
  )

  const saveNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log('fetch', query)
    localFetch(query)
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
            <h2>Saved Queries</h2>
            {localStorageItems().map((x) => (
              <div key={x.key}>
                {x.key}{' '}
                <button
                  id="queryLoad"
                  type="button"
                  onClick={() =>
                    x.value != null ? setQuery(x.value) : undefined
                  }
                >
                  Hi
                </button>
              </div>
            ))}
            <label htmlFor="SaveName">
              {'Label '}
              <input type="text" id="SaveName" ref={saveNameRef} />
            </label>
            <br />
            <button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              type="button"
              onClick={() =>
                localStorage.setItem(
                  `query-${saveNameRef.current?.value ?? 'Not Named'}`,
                  JSON.stringify(query)
                )
              }
            >
              Save Current Query
            </button>
          </div>
        </div>
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
                {query.select?.map((selectKeys) => (
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
        <textarea readOnly cols={100} rows={4} value={JSON.stringify(query)} />
      </footer>
    </div>
  )
}

export default App
