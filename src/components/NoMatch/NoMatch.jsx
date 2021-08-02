import React from 'react';
import {
    useLocation, Link,
} from 'react-router-dom';

function NoMatch() {
    const location = useLocation();

    return (
        <div className="with-background dc-container text-center p-3">
            <span>
                L&apos;URL recherchée {location.pathname} n&apos;existe pas ou vous n&apos;avez pas les droits pour y accéder
            </span>
            <Link to="/" className="btn btn-primary mt-3">Retournez à l&apos;accueil</Link>
        </div>
    );
}

export default NoMatch;
