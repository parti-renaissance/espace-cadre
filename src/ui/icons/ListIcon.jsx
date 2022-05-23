import { SvgIcon } from '@mui/material'

const ListIcon = props => (
  <SvgIcon {...props}>
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18L20 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </SvgIcon>
)

export default ListIcon
