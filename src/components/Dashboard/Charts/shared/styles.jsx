export const chartAxisStyle = {
  color: '#717BA0',
  fontFamily: 'roboto',
  fontSize: '12px',
}

export const tooltipStyle = {
  fontSize: '14px',
  fontFamily: 'Poppins',
  padding: '2px 5px',
  textAlign: 'left',
}

export const areaMargin = {
  top: 5,
  right: 20,
  bottom: 5,
  left: 0,
}

export const tooltipContentStyle = theme => ({
  background: '#fff',
  borderColor: theme.palette.grayCornerBg,
  borderRadius: '6px',
})

export const tooltipLabelStyle = theme => ({
  color: theme.palette.blackCorner,
  fontWeight: 'bold',
  ...tooltipStyle,
})
export const tooltipCursorStyle = theme => ({
  stroke: theme.palette.blueCorner,
  strokeWidth: 0.5,
})
