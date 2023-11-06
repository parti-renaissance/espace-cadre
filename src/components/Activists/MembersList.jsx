import PropTypes from 'prop-types'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import FmdGoodIcon from '@mui/icons-material/FmdGood'
import Activist from 'domain/activist'
import { UIChip } from 'ui/Card'
import Badges, { MemberBadge } from './Badges'
import BadgesList from 'ui/Badge/BadgesList'
import { parseMandates } from 'components/Activists/helper'

const MembersList = ({ members, onMemberClick }) => (
  <Paper className="divider" data-cy="contacts-list">
    {members.map((member, index) => (
      <Button
        key={index}
        onClick={() => onMemberClick(member)}
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
          textTransform: 'none',
          borderRadius: '0px',
        }}
        disableRipple
        data-cy="contact-card-button"
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
            <Grid item xs={12} sm={3}>
              <Box sx={{ color: 'colors.gray.700', mb: 1 }}>
                <MemberBadge membership={member.raw.renaissance_membership} labelStyle={{ fontSize: '12px' }} />
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FmdGoodIcon sx={{ color: 'colors.gray.400', fontSize: '22px', mr: 0.5 }} />
                  <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '14px' }}>
                    {`${member.city} ${member.cityId ? ` (${member.cityId})` : ''}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
              <BadgesList badges={parseMandates(member.raw.mandates, member.raw.declared_mandates)} />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {member.raw.additional_tags.length > 0 && <Badges tags={member.raw.additional_tags} />}
              <UIChip
                label={member.raw.campus_registered_at ? 'Inscrit au Campus' : 'Non inscrit au Campus'}
                color={member.raw.campus_registered_at ? 'colors.green.800' : 'colors.gray.800'}
                bgcolor={member.raw.campus_registered_at ? 'colors.green.100' : 'colors.gray.100'}
                labelStyle={{ fontSize: '12px', fontWeight: '500' }}
              />
            </Grid>
          </Grid>
          <KeyboardArrowRightIcon sx={{ color: 'colors.gray.400', fontSize: '20px' }} />
        </Box>
      </Button>
    ))}
  </Paper>
)

export default MembersList

MembersList.propTypes = {
  members: PropTypes.arrayOf(Activist.propTypes).isRequired,
  onMemberClick: PropTypes.func.isRequired,
}
