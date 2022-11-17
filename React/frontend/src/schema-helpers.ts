import { AdventureWorks2019Schema } from '../AdventureWorks2019Schema'

const QueryColumns = Object.values(AdventureWorks2019Schema).flatMap((x) =>
  Object.values(x)
)

// eslint-disable-next-line import/prefer-default-export
export const TableDefinitions = QueryColumns.map((x) => {
  const nameSplit = x.name.split('.')
  return { name: x.name, table: nameSplit[0], field: nameSplit[1], column: x }
})
