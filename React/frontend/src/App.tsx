import { useEffect, useRef, useState } from "react";
import {
  QueryResultJson,
  Query,
  QuerySelect,
  jsonifyQuery,
  AggregationType,
  QueryColumn,
  AggregationJson,
} from "flowerbi";
import { Product } from "../AdventureWorks2019Schema";
import "./App.css";
import { localFetch } from "./api-helpers";
import { TableDefinitions } from "./schema-helpers";
import React from "react";

const AggregationTypes: Record<AggregationType, string> = {
  Avg: "Average",
  Count: "Count",
  Max: "Maximum",
  Min: "Minimum",
  Sum: "Sum",
};

function App() {
  const [data, setData] = useState<QueryResultJson | undefined>(undefined);
  const aggregationColumnRef = React.useRef<HTMLSelectElement>(null);
  const aggregationFunctionRef = React.useRef<HTMLSelectElement>(null);
  const [query, setQuery] = useState<Query<QuerySelect>>({
    select: {
      productCount: Product.ProductId.count(),
    },
    totals: true,
  });

  const [checkedState, setCheckedState] = useState<
    { key: QueryColumn<unknown>; value: boolean }[]
  >(
    TableDefinitions.map((x) => {
      return { key: x.column, value: false };
    })
  );

  useEffect(() => {
    localFetch(jsonifyQuery(query)).then((x) => {
      setData(x);
    });
  }, [query]);

  useEffect(() => {
    const aggregation: AggregationJson = {
      column: aggregationColumnRef.current?.value ?? Product.ProductId.name,
      function:
        (aggregationFunctionRef.current?.value as any as AggregationType) ??
        "Sum",
    };
    console.log(aggregation);
    const dictionary: QuerySelect = Object.assign(
      { aggregation },
      ...checkedState
        .filter((x) => x.value)
        .map((x) => ({ [x.key.name]: x.key }))
    );

    const updatedQuerySelect: Query<QuerySelect> = {
      select: dictionary,
    };

    setQuery(updatedQuerySelect);
  }, [checkedState]);

  const handleOnChange = (key: string) => {
    const updatedCheckedState = checkedState.map((item) =>
      item.key.name === key ? { key: item.key, value: !item.value } : item
    );

    setCheckedState(updatedCheckedState);
  };

  if (!data || !data.records) return <>Loading</>;

  return (
    <div className="min-h-screen flex">
      <nav className="w-112 flex-none px-2">
        <h2>Columns</h2>
        {TableDefinitions.map((x) => (
          <div className="flex items-center mb-1" key={x.name}>
            <input
              onChange={() => handleOnChange(x.name)}
              id={x.name}
              type="checkbox"
              checked={
                checkedState.filter((f) => f.key.name === x.name)[0].value
              }
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
        <select
          ref={aggregationFunctionRef}
          name="aggregation"
          id="aggregations"
        >
          {Object.entries(AggregationTypes).map((x) => (
            <option key={x[0]} value={x[0]}>
              {x[1]}
            </option>
          ))}
        </select>
      </nav>

      <main className="flex-1 min-w-0 overflow-auto px-2">
        {data.records.length > 0
          ? data.records?.map((records, i) =>
              records.selected?.map((selectedRecords, j) => (
                <div key={selectedRecords?.toString() ?? -1}>
                  <>{selectedRecords}</>
                </div>
              ))
            )
          : undefined}
      </main>
      <textarea
        readOnly={true}
        rows={10}
        value={JSON.stringify(jsonifyQuery(query))}
      ></textarea>
    </div>
  );
}

export default App;
