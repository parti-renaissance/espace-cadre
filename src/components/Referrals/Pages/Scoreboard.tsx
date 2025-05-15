import { useErrorHandler } from '~/components/shared/error/hooks'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getReferralsScoreboard } from '~/api/referrals'
import CustomTable from '~/mui/custom-table/CustomTable'
import { useMemo, useState } from 'react'
import { ScoreboardReferrer } from '~/domain/referral'
import { CustomTableColumnModel, OrderEnum } from '~/mui/custom-table/CustomTable.model'
import Profile from '~/components/shared/adherent/Profile'
import { orderBy as _orderBy } from 'lodash'
import { MuiSpacing } from '~/theme/spacing'
import { Box, Card } from '@mui/material'

const Scoreboard = () => {
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.DESC)
  const [orderBy, setOrderBy] = useState<keyof ScoreboardReferrer>('countAdhesionFinished')

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === OrderEnum.DESC
    setOrder(isAsc ? OrderEnum.ASC : OrderEnum.DESC)
    setOrderBy(property as keyof ScoreboardReferrer)
  }

  const { handleError } = useErrorHandler()

  const { data, isFetching } = useQueryWithScope(
    ['paginated-referrals', { feature: 'Referrals', view: 'Scoreboard' }],
    getReferralsScoreboard,
    { onError: handleError }
  )

  const tableData = useMemo(
    () =>
      _orderBy((data as ScoreboardReferrer[]) || [], [orderBy], [order]).map((referrer: ScoreboardReferrer) => ({
        id: referrer.adherent.pid!,
        ...referrer,
      })),
    [order, orderBy, data]
  )

  return (
    <Box sx={{ mt: MuiSpacing.large }} className="space-y-4">
      <Card>
        <CustomTable
          headerSx={{ px: MuiSpacing.normal }}
          footerSx={{ px: MuiSpacing.normal }}
          data={tableData}
          total={tableData.length}
          isLoading={isFetching}
          columns={columnDefinition}
          rowsPerPageOptions={[]}
          onSort={handleSort}
          order={order}
          orderBy={orderBy}
        />
      </Card>
    </Box>
  )
}

const columnDefinition: CustomTableColumnModel<ScoreboardReferrer & { id: string }>[] = [
  {
    index: 'id',
    title: 'ID',
    hidden: true,
  },
  {
    index: 'adherent',
    title: 'Adhérent',
    subTitle: 'Civilité - numéro adhérent',
    render: ({ adherent }: ScoreboardReferrer) => <Profile adherent={adherent} />,
  },
  {
    index: 'countAdhesionFinished',
    title: "Nombre d'adhésions",
    sortable: true,
  },
  {
    index: 'countInvitations',
    title: "Nombre d'invitations",
    sortable: true,
  },
  {
    index: 'countReported',
    title: 'Nombre de signalements',
    sortable: true,
  },
]

export default Scoreboard
