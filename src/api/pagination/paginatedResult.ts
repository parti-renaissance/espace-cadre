export default class PaginatedResult<Data> {
  constructor(
    public data: Data,
    public total: number,
    public pageSize: number,
    public currentPageCount: number,
    public currentPage: number,
    public lastPage: boolean
  ) {
    this.data = data
    this.total = total
    this.pageSize = pageSize
    this.currentPageCount = currentPageCount
    this.currentPage = currentPage
    this.lastPage = lastPage
  }
}

export const newPaginatedResult = <Data>(
  data: Data,
  {
    total_items: total,
    items_per_page: pageSize,
    count: currentPageCount,
    current_page: currentPage,
    last_page: lastPage,
  }: {
    total_items: number
    items_per_page: number
    count: number
    current_page: number
    last_page: boolean
  }
) => new PaginatedResult(data, total, pageSize, currentPageCount, currentPage, lastPage)
