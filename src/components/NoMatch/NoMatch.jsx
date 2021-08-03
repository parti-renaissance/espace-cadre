import React from 'react';
import {
    useLocation, Link,
} from 'react-router-dom';

function NoMatch() {
    const location = useLocation();

    return (
        <div className="container">
            <div className="row with-background dc-container text-center p-3 ">
                <div className="col-12">
                    L&apos;URL recherchée <strong>{location.pathname}</strong> n&apos;existe pas ou vous n&apos;avez pas les droits pour y accéder
                </div>
                <div className="col-12">
                    <Link to="/" className="btn btn-primary mt-3">Retournez à l&apos;accueil</Link>
                </div>
            </div>
        </div>

    );
}

export default NoMatch;
