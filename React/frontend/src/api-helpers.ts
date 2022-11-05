import { Query, QueryJson, QueryResultJson, QuerySelect } from "flowerbi";
import { ProductSubcategory, Product } from "../AdventureWorks2019Schema";

export async function localFetch(queryJson: QueryJson): Promise<QueryResultJson> {

    const response = await fetch("/api/QueryDatabase", {
        method: "POST",
        cache: "no-cache",
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryJson),
    });
    return !response.ok ? [] : JSON.parse(await response.text());
  }
  
  export const query: Query<QuerySelect> = {
    select: {
      name: ProductSubcategory.Name,
      productCount:Product.ProductId.count()
    },  
    totals: true
  
  }