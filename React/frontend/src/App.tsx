import { useEffect, useRef, useState } from "react";
import {
  QueryResultJson,
  Query,
  QuerySelect,
  jsonifyQuery,
  AggregationType,
  QueryColumn,
} from "flowerbi";
import { Product, ProductSubcategory } from "../AdventureWorks2019Schema";
import "./App.css";
import { localFetch } from "./api-helpers";
import { TableDefinitions } from "./schema-helpers";

const AggregationTypes: Record<AggregationType, string> = {
  Avg: "Average",
  Count: "Count",
  Max: "Maximum",
  Min: "Minimum",
  Sum: "Sum",
};

function App() {
  const [data, setData] = useState<QueryResultJson | undefined>(undefined);
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

  const getData = () =>
    localFetch(jsonifyQuery(query)).then((x) => {
      setData(x);
    });

  useEffect(() => {
    getData();
  }, [query]);

  useEffect(() => {
    let dictionary: QuerySelect = Object.assign(
      { productCount: Product.ProductId.count() },
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
        Columns
        <fieldset id="checkboxes">
          {TableDefinitions.map((x) => (
            <div className="flex items-center mb-1">
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
        </fieldset>
      </nav>

      <main className="flex-1 min-w-0 overflow-auto px-2">
        {data.records.map((x, i) => (
          <div key={x.selected == null ? -1 : x.selected[0].toString()}>
            <>{JSON.stringify(x)}</>
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
