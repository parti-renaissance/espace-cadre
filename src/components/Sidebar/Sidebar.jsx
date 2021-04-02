import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import $ from 'jquery';


const Sidebar = () => {

    useEffect(() => {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar, #content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div className="vertical-nav bg-white" id="sidebar">
                <div className="py-4 px-3 mb-4 bg-light">
                    <div className="media d-flex align-items-center">
                        <h4 className="m-0">CRM</h4>
                    </div>
                </div>

                <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Stratégie</p>

                <ul className="nav flex-column bg-white mb-0">
                    <li className="nav-item">
                        <Link
                            to="/"
                            exact
                            className="nav-link text-dark"
                        >
                            <i className="fas fa-th-large mr-2 text-grey fa-fw"></i>
                            {' '}Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-dark">
                            <i className="far fa-chart-bar mr-2 text-grey fa-fw"></i>
                            {' '}Analyse
                        </a>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/contacts"
                            className="nav-link text-dark"
                        >
                            <i className="far fa-address-book mr-2 text-grey fa-fw"></i>
                            {' '}Contacts
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Sidebar;
