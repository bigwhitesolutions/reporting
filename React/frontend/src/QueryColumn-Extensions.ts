/* eslint-disable max-classes-per-file */
import {
  AggregationJson,
  AggregationType,
  FilterJson,
  FilterOperator,
  FilterValue,
  OrderingJson,
} from 'flowerbi'

export interface AggregationTypeDescription {
  aggregation: AggregationType
  text: string
}

type AggregationTypeRecord = {
  [key in AggregationType]: AggregationTypeDescription
}

export const AggregationTypes: AggregationTypeRecord = {
  Avg: { aggregation: 'Avg', text: 'Average' },
  Count: { aggregation: 'Count', text: 'Count' },
  Max: { aggregation: 'Max', text: 'Maximum' },
  Min: { aggregation: 'Min', text: 'Minimum' },
  Sum: { aggregation: 'Sum', text: 'Sum' },
}

export interface FilterTypeDescription {
  operator: FilterOperator
  text: string
}

type FilterTypeRecord = {
  [key in FilterOperator]: FilterTypeDescription
}

export const FilterTypes: FilterTypeRecord = {
  '<': { operator: '<', text: 'Less than' },
  '<=': { operator: '<=', text: 'Less than or equal to' },
  '<>': { operator: '<>', text: 'Not equal' },
  '=': { operator: '=', text: 'Equal' },
  '>': { operator: '>', text: 'Greater than' },
  '>=': { operator: '>=', text: 'Greater than or equal to' },
  IN: { operator: 'IN', text: 'In' },
}

export class BasicQueryColumn<T extends FilterValue> {
  constructor(public readonly name: string) {
    this.aggregations.push(AggregationTypes.Count)
    this.filters.push(FilterTypes['='])
    this.filters.push(FilterTypes['<>'])
  }

  aggregations: AggregationTypeDescription[] = []

  protected aggregation(
    aggregationType: AggregationType,
    filters?: FilterJson[]
  ): AggregationJson {
    return {
      column: this.name,
      function: aggregationType,
      filters,
    }
  }

  filters: FilterTypeDescription[] = []

  protected filter(operator: FilterOperator, value: T): FilterJson {
    return {
      column: this.name,
      operator,
      value,
    }
  }

  /**
   * Aggregates the column by counting values.
   */
  count(filters?: FilterJson[]): AggregationJson {
    return this.aggregation('Count', filters)
  }

  /**
   * Produces a filter that requires this column to be equal to some value.
   */
  equalTo(value: T): FilterJson {
    return this.filter('=', value)
  }

  /**
   * Produces a filter that requires this column to be not equal to some value.
   */
  notEqualTo(value: T): FilterJson {
    return this.filter('<>', value)
  }

  /**
   * Sorts by the column in ascending order.
   */
  ascending(): OrderingJson {
    return { column: this.name, descending: false }
  }

  /**
   * Sorts by the column in descending order.
   */
  descending(): OrderingJson {
    return { column: this.name, descending: true }
  }
}

export class ArrayQueryColumn<
  T extends string[] | number[]
> extends BasicQueryColumn<T> {
  constructor(public readonly name: string) {
    super(name)
    this.filters.push(FilterTypes.IN)
  }

  /**
   * Produces a filter that requires this column's value to appear in the list.
   * Only supported for number or string columns.
   */
  in(value: T): FilterJson {
    return super.filter('IN', value)
  }
}

export class DateQueryColumn<
  T extends Date | number
> extends BasicQueryColumn<T> {
  constructor(public readonly name: string) {
    super(name)
    this.aggregations.push(AggregationTypes.Min)
    this.aggregations.push(AggregationTypes.Max)
    this.filters.push(FilterTypes['<'])
    this.filters.push(FilterTypes['<='])
    this.filters.push(FilterTypes['>'])
    this.filters.push(FilterTypes['>='])
  }

  /**
   * Aggregates the column by selecting the minimum value.
   * @param filters Optional filters to apply.
   */
  min(filters?: FilterJson[]): AggregationJson {
    return super.aggregation('Min', filters)
  }

  /**
   * Aggregates the column by selecting the maximum value.
   * @param filters Optional filters to apply.
   */
  max(filters?: FilterJson[]): AggregationJson {
    return super.aggregation('Max', filters)
  }

  /**
   * Produces a filter that requires this column to be greater than to some
   * value.
   */
  greaterThan(value: T): FilterJson {
    return super.filter('>', value)
  }

  /**
   * Produces a filter that requires this column to be less than to some value.
   */
  lessThan(value: T): FilterJson {
    return super.filter('<', value)
  }

  /**
   * Produces a filter that requires this column to be greater than or equal to
   * some value.
   */
  greaterThanOrEqualTo(value: T): FilterJson {
    return super.filter('>=', value)
  }

  /**
   * Produces a filter that requires this column to be less than or equal to
   * some value.
   */
  lessThanOrEqualTo(value: T): FilterJson {
    return super.filter('<=', value)
  }
}

export class NumberQueryColumn<T extends number> extends DateQueryColumn<T> {
  constructor(public readonly name: string) {
    super(name)
    this.aggregations.push(AggregationTypes.Sum)
    this.aggregations.push(AggregationTypes.Avg)
  }

  /**
   * Aggregates the column by summing values.
   * @param filters Optional filters to apply.
   */
  sum(filters?: FilterJson[]): AggregationJson {
    return super.aggregation('Sum', filters)
  }

  /**
   * Aggregates the column by averaging values.
   * @param filters Optional filters to apply.
   */
  avg(filters?: FilterJson[]): AggregationJson {
    return super.aggregation('Avg', filters)
  }
}
