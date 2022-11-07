import { QueryJson, QueryResultJson } from 'flowerbi'

export default async function localFetch(
  queryJson: QueryJson
): Promise<QueryResultJson> {
  const response = await fetch('/api/QueryDatabase', {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queryJson),
  })
  return !response.ok ? [] : JSON.parse(await response.text())
}
