import Sidebar from '../Sidebar/Sidebar';

const Root = ({children}) => (
    <div>
        <Sidebar/>

        <div className="page-content p-3" id="content">
            <button
                id="sidebarCollapse"
                type="button"
                className="btn btn-light bg-white rounded-pill shadow-sm mb-4"
            >
                <i className="fa fa-bars"/>
            </button>
            {children}
        </div>
    </div>
)

export default Root;
