import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'

const DelegationsMock = [
  {
    id: 'a1b2c3',
    firstName: 'Victor',
    lastName: 'Fortest',
    role: 'Responsable mobilisation',
    accessCount: 2,
  },
  {
    id: 'd4e5f6',
    firstName: 'Charlie',
    lastName: 'Cox',
    role: 'Responsable élus',
    accessCount: 0,
  },
  {
    id: 'g7h8i9',
    firstName: 'Nicolas',
    lastName: 'Zil',
    role: 'Responsable mobilisation',
    accessCount: 4,
  },
  {
    id: 'j1k2l3',
    firstName: 'Laila',
    lastName: 'Belarbi',
    role: 'Responsable élus',
    accessCount: 11,
  },
]

export const getDelegationsQuery = async ({ pageParam: page = 1 }) => {
  const data = {
    metadata: {
      count: 4,
      current_page: 1,
      items_per_page: 20,
      last_page: 1,
      total_items: 4,
    },
  }
  const delegations = DelegationsMock

  return newPaginatedResult(delegations, data.metadata)
}
