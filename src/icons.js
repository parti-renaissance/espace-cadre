import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import TelegramIcon from '@material-ui/icons/Telegram';
import MapRoundedIcon from '@material-ui/icons/MapRounded';
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';

const Dashboard = 'dashboard';
const Adherents = 'contacts';
const Messagerie = 'messages';
const Elections = 'elections';
const Ripostes = 'ripostes';
const Teams = 'team';

export default {
  [Dashboard]: DashboardRoundedIcon,
  [Adherents]: PeopleRoundedIcon,
  [Messagerie]: TelegramIcon,
  [Elections]: MapRoundedIcon,
  [Ripostes]: PostAddRoundedIcon,
  [Teams]: StarRoundedIcon,
};
