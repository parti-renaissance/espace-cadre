import { toolTipStyle } from 'components/Dashboard/Charts/shared/styles'
import { Tooltip as TooltipRecharts } from 'recharts'
import { useTheme } from '@mui/material'

const Tooltip = () => {
  const theme = useTheme()

  return (
    <TooltipRecharts
      contentStyle={{
        background: '#fff',
        borderColor: theme.palette.grayCornerBg,
        borderRadius: '6px',
      }}
      labelStyle={{
        color: theme.palette.blackCorner,
        fontWeight: 'bold',
        ...toolTipStyle,
      }}
      itemStyle={toolTipStyle}
      cursor={{
        stroke: theme.palette.blueCorner,
        strokeWidth: 0.5,
      }}
    />
  )
}

export default Tooltip
