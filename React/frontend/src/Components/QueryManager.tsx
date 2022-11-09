import { QueryJson } from 'flowerbi'
import { Dispatch, SetStateAction, useRef } from 'react'

const prefix = 'query-'
interface localStorageItem {
  key: string
  value: QueryJson | null
}
function storageItems(): localStorageItem[] {
  const elements = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key?.startsWith(prefix) === true) {
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

export interface ColumnProps {
  setQuery: Dispatch<SetStateAction<QueryJson>>
  currentQuery: QueryJson
}
export function QueryManager({
  setQuery,
  currentQuery,
}: ColumnProps): JSX.Element {
  const saveNameRef = useRef<HTMLInputElement>(null)

  function loadItem(x: localStorageItem) {
    return () => (x.value != null ? setQuery(x.value) : undefined)
  }
  function saveItem() {
    return () =>
      localStorage.setItem(
        `${prefix}${saveNameRef.current?.value ?? 'Not Named'}`,
        JSON.stringify(currentQuery)
      )
  }
  function deleteItem(x: localStorageItem) {
    return () => localStorage.removeItem(`${prefix}${x.key}`)
  }

  return (
    <>
      <h2>Saved Queries</h2>
      {storageItems().map((storageItem) => (
        <div key={storageItem.key}>
          {storageItem.key}{' '}
          <button id="queryLoad" type="button" onClick={loadItem(storageItem)}>
            Load
          </button>
          <button
            id="queryDelete"
            type="button"
            onClick={deleteItem(storageItem)}
          >
            Delete
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
        onClick={saveItem()}
      >
        Save Current Query
      </button>
    </>
  )
}
