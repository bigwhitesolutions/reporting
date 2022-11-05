import { Product, ProductSubcategory } from "../AdventureWorks2019Schema";

const SchemaValues = [
  ...Object.values(Product),
  ...Object.values(ProductSubcategory),
];

export const TableDefinitions = SchemaValues.map((x) => {
  var nameSplit = x.name.split(".");
  return { name: x.name, table: nameSplit[0], field: nameSplit[1], column: x };
});
