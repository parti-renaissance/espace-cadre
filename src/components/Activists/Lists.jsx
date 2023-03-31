import PropTypes from 'prop-types'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import FmdGoodIcon from '@mui/icons-material/FmdGood'
import { differenceInDays } from 'date-fns'
import Activist from 'domain/activist'
import BadgeNew, { MemberBadge } from './BadgeNew'

const Lists = ({ members, onMemberClick }) => (
  <Paper className="divider">
    {members.map((member, index) => (
      <Button
        key={index}
        onClick={e => onMemberClick(e, member)}
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
          textTransform: 'none',
          borderRadius: '0px',
        }}
        disableRipple
      >
        <Box display="flex" alignItems="center" width="100%" p={1.5}>
          <Grid container sx={{ display: 'flex', flex: '1 1 0%', minWidth: '0px', textAlign: 'left' }} spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography component="p" sx={{ color: 'colors.gray.700' }}>
                {member.firstname} <span className="font-medium">{member.lastname}</span>
              </Typography>
              <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '14px', mt: 1 }}>
                {member.raw.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ color: 'colors.gray.700', mb: 1 }}>
                <MemberBadge membership={member.raw.renaissance_membership} labelStyle={{ fontSize: '12px' }} />
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FmdGoodIcon sx={{ color: 'colors.gray.400', fontSize: '22px', mr: 0.5 }} />
                  <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '14px' }}>
                    {member.city} ({member.cityId ?? '!'})
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {member.joinedDate && (
              <Grid item xs={12} sm={2}>
                {differenceInDays(new Date(), member.joinedDate) <= 15 && <BadgeNew />}
              </Grid>
            )}
          </Grid>
          <KeyboardArrowRightIcon sx={{ color: 'colors.gray.400', fontSize: '20px' }} />
        </Box>
      </Button>
    ))}
  </Paper>
)

export default Lists

Lists.propTypes = {
  members: PropTypes.arrayOf(Activist.propTypes).isRequired,
  onMemberClick: PropTypes.func.isRequired,
}