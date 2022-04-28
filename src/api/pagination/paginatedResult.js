export default class PaginatedResult {
  constructor(data, total, pageSize, currentPageCount, currentPage, lastPage) {
    this.data = data
    this.total = total
    this.pageSize = pageSize
    this.currentPageCount = currentPageCount
    this.currentPage = currentPage
    this.lastPage = lastPage
  }
}

export const newPaginatedResult = (
  data,
  {
    total_items: total,
    items_per_page: pageSize,
    count: currentPageCount,
    current_page: currentPage,
    last_page: lastPage,
  }
) => new PaginatedResult(data, total, pageSize, currentPageCount, currentPage, lastPage)
