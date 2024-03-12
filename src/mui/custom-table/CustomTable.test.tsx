import { render } from '@testing-library/react'
import CustomTable, { TableExample } from '~/mui/custom-table/CustomTable'
import { expect } from 'vitest'
import { CustomTableColumnModel } from '~/mui/custom-table/CustomTable.model'

describe('Custom table', () => {
  interface IdTitle {
    id: number
    title: string
  }

  const columns: CustomTableColumnModel<IdTitle>[] = [
    {
      title: 'ID',
      index: 'id',
    },
    {
      title: 'Titre',
      index: 'title',
    },
  ]

  const sampleData: IdTitle[] = [
    {
      id: 1,
      title: 'title 1',
    },
    {
      id: 2,
      title: 'title 2',
    },
  ]

  it('Should render an example table', async () => {
    const tree = render(<TableExample />)

    expect(await tree.findAllByText('Line 1')).toBeTruthy()
    expect(await tree.findAllByText('Line 2')).toBeTruthy()
  })

  it('Should render a skeleton while loading', async () => {
    const tree = render(<CustomTable columns={columns} data={[]} isLoading />)

    expect(await tree.findAllByTestId('skeleton')).toBeTruthy()
  })

  it('Should not throw error at render time if column does not exist', async () => {
    const tree = render(<CustomTable columns={columns} data={sampleData} />)

    expect(await tree.findByText(sampleData[0].title)).toBeTruthy()
  })

  it('Should count results', async () => {
    const tree = render(
      <CustomTable
        columns={[
          {
            title: 'ID',
            index: 'id',
          },
          {
            title: 'title',
            index: 'title',
          },
          {
            title: 'Name',
            // @ts-expect-error test of render break
            index: 'name',
          },
        ]}
        data={sampleData}
      />
    )

    const elem = await tree.findByTestId('result-count')
    expect(Number(elem.innerHTML)).toBe(2)
  })
})
