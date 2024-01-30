import pluralize from '~/components/shared/pluralize/pluralize'
import PropTypes from 'prop-types'
import { UIChip } from '~/ui/Card'
import { styled } from '@mui/system'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const messages = {
  member: 'militant',
}

const Header = ({ groupCount }) => (
  <HorizontalContainer>
    <UIChip
      color="gray700"
      bgcolor="rgba(55, 65, 81, 0.08)"
      label={`${groupCount} ${pluralize(groupCount, messages.member)}`}
    />
  </HorizontalContainer>
)

Header.propTypes = {
  groupCount: PropTypes.number.isRequired,
}

export default Header
