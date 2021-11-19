import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import RssFeedIcon from '@mui/icons-material/RssFeed'
import { Dashboard, Adherents, Messagerie, Elections, Ripostes, Teams, News } from '../../route'

export default {
  [Dashboard]: DashboardRoundedIcon,
  [Adherents]: PeopleRoundedIcon,
  [Messagerie]: EmailRoundedIcon,
  [Elections]: MapRoundedIcon,
  [Ripostes]: PostAddRoundedIcon,
  [Teams]: StarRoundedIcon,
  [News]: RssFeedIcon,
}
