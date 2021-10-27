import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import MapRoundedIcon from '@material-ui/icons/MapRounded';
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import {
  Dashboard,
  Adherents,
  Messagerie,
  Elections,
  Ripostes,
  Teams,
} from './routes';

export default {
  [Dashboard]: DashboardRoundedIcon,
  [Adherents]: PeopleRoundedIcon,
  [Messagerie]: EmailRoundedIcon,
  [Elections]: MapRoundedIcon,
  [Ripostes]: PostAddRoundedIcon,
  [Teams]: StarRoundedIcon,
};
