import {
  AggregationJson,
  AggregationType,
  FilterJson,
  FilterOperator,
  jsonifyQuery,
  Query,
  QueryJson,
  QuerySelect,
} from 'flowerbi'
import React, { Dispatch, SetStateAction, useState } from 'react'

import { Product } from '../../AdventureWorks2019Schema'
import {
  AggregationTypes,
  BasicQueryColumn,
  FilterTypes,
  NumberQueryColumn,
} from '../QueryColumn-Extensions'
import { TableDefinitions } from '../schema-helpers'

export interface ColumnProps {
  setQuery: Dispatch<SetStateAction<QueryJson>>
}
export function QueryBuilder({ setQuery }: ColumnProps): JSX.Element {
  const aggregationColumnRef = React.useRef<HTMLSelectElement>(null)
  const aggregationFunctionRef = React.useRef<HTMLSelectElement>(null)
  const filterFunctionRef = React.useRef<HTMLSelectElement>(null)
  const filterTableRef = React.useRef<HTMLSelectElement>(null)
  const filterInputRef = React.useRef<HTMLInputElement>(null)
  const totalsRef = React.useRef<HTMLInputElement>(null)
  const [checkedState, setCheckedState] = useState<
    Array<{
      key: NumberQueryColumn<number> | BasicQueryColumn<string>
      value: boolean
    }>
  >(TableDefinitions.map((x) => ({ key: x.column, value: false })))

  console.log(TableDefinitions)
  const applyQuery: () => void = () => {
    const aggregation: AggregationJson = {
      column: aggregationColumnRef.current?.value ?? Product.ProductId.name,
      function:
        (aggregationFunctionRef.current?.value as any as AggregationType) ??
        'Sum',
    }
    const dictionary: QuerySelect = Object.assign(
      { aggregation },
      ...checkedState
        .filter((x) => x.value)
        .map((x) => ({ [x.key.name]: x.key }))
    )

    let filters: FilterJson[] | undefined
    const totals = !!(totalsRef.current?.checked ?? false)
    if (
      filterTableRef.current != null &&
      filterTableRef.current.value !== '' &&
      filterFunctionRef.current != null &&
      filterInputRef.current != null &&
      filterInputRef.current.value !== ''
    ) {
      filters = filters ?? []
      filters.push({
        column: filterTableRef.current.value,
        operator: filterFunctionRef.current.value as FilterOperator,
        value: filterInputRef.current.value,
      })
    }

    const updatedQuerySelect: Query<QuerySelect> = {
      select: dictionary,
      filters,
      totals,
    }

    setQuery(jsonifyQuery(updatedQuerySelect))
  }

  const handleOnChange: (key: string) => void = (key: string) => {
    const updatedCheckedState = checkedState.map((item) =>
      item.key.name === key ? { key: item.key, value: !item.value } : item
    )

    setCheckedState(updatedCheckedState)
  }
  return (
    <>
      <h2>Columns</h2>
      {TableDefinitions.map((x) => (
        <div className="flex items-center mb-1" key={x.name}>
          <input
            onChange={() => handleOnChange(x.name)}
            id={x.name}
            type="checkbox"
            checked={checkedState.filter((f) => f.key.name === x.name)[0].value}
            value={x.name}
            name={x.name}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={x.name}
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {x.name}
          </label>
        </div>
      ))}
      <h2>Aggregation</h2>
      <select ref={aggregationColumnRef} name="aggregation" id="aggregations">
        {TableDefinitions.map((x) => (
          <option key={x.name} value={x.name}>
            {x.name}
          </option>
        ))}
      </select>
      <br />
      <select ref={aggregationFunctionRef} name="aggregation" id="aggregations">
        {Object.entries(AggregationTypes).map((x) => (
          <option key={x[0]} value={x[0]}>
            {x[1].text}
          </option>
        ))}
      </select>
      <h2>Filters</h2>
      <select ref={filterTableRef} name="filter" id="filter">
        {Object.entries(TableDefinitions).map((x) => (
          <option key={x[0]} value={x[1].name}>
            {x[1].name}
          </option>
        ))}
      </select>
      <br />
      <select ref={filterFunctionRef} name="filter" id="filter">
        {Object.entries(FilterTypes).map((x) => (
          <option key={x[0]} value={x[0]}>
            {x[1].text}
          </option>
        ))}
      </select>
      <br />
      <input ref={filterInputRef} />
      <h2>Totals</h2>
      <input ref={totalsRef} type="checkbox" id="totals" />
      <h2>Actions</h2>
      <button type="button" onClick={applyQuery}>
        Go
      </button>
    </>
  )
}
