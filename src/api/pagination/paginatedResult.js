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
