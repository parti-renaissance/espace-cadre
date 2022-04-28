export default lastFetchedPage =>
  lastFetchedPage.currentPage < lastFetchedPage.lastPage ? lastFetchedPage.currentPage + 1 : undefined
