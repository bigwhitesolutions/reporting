import { AggregationType } from "flowerbi";
import { AdventureWorks2019Schema } from "../AdventureWorks2019Schema";

const QueryColumns = Object.values(AdventureWorks2019Schema).flatMap((x) =>
  Object.values(x)
);

export const TableDefinitions = QueryColumns.map((x) => {
  var nameSplit = x.name.split(".");
  return { name: x.name, table: nameSplit[0], field: nameSplit[1], column: x };
});

export const AggregationTypes: Record<AggregationType, string> = {
  Avg: "Average",
  Count: "Count",
  Max: "Maximum",
  Min: "Minimum",
  Sum: "Sum",
};
