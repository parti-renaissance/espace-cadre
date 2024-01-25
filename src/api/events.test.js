import { formatCategories } from 'api/events'
import { EventCategory, EventGroupCategory } from 'domain/event'

describe('Events', () => {
  const rawCategories = [
    {
      event_group_category: {
        name: 'Groupe 1',
        slug: 'group1',
      },
      name: 'category 1',
      slug: 'category1',
    },
    {
      event_group_category: {
        name: 'Groupe 1',
        slug: 'group1',
      },
      name: 'category 2',
      slug: 'category2',
    },
    {
      event_group_category: {
        name: 'Groupe 2',
        slug: 'group2',
      },
      name: 'category 3',
      slug: 'category3',
    },
  ]

  it('getCategories', () => {
    const result = formatCategories(rawCategories)

    expect(result).toEqual([
      new EventGroupCategory('group1', 'Groupe 1', [
        new EventCategory('category1', 'category 1', 'group1', 'Groupe 1'),
        new EventCategory('category2', 'category 2', 'group1', 'Groupe 1'),
      ]),
      new EventGroupCategory('group2', 'Groupe 2', [
        new EventCategory('category3', 'category 3', 'group2', 'Groupe 2'),
      ]),
    ])
  })
})
