export default async (paginatedData, refetch, updatedId) => {
  const pageToReload = paginatedData.pages.find(page => page.data.some(item => item.id === updatedId))?.currentPage
  await refetch({
    refetchPage: (_, index) => index + 1 === pageToReload,
  })
}
