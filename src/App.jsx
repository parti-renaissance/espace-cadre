import { Switch, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Contacts from './components/Contacts/Contacts';
import Sidebar from './components/Sidebar/Sidebar';

import './App.scss';

const App = () => {
  return (
    <>
      <Sidebar />
      <div className="page-content p-3" id="content">
        <button
          id="sidebarCollapse"
          type="button"
          className="btn btn-light bg-white rounded-pill shadow-sm mb-4"
        >
          <i className="fa fa-bars"></i>
        </button>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/contacts" component={Contacts} />
        </Switch>
      </div>
    </>
  )
}
export default App;