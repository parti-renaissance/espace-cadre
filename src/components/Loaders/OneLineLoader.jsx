import React from 'react';
import ContentLoader from 'react-content-loader';

const OneLineLoader = (props) => {
    console.log(props);
    return (
        <ContentLoader
            speed={2}
            width={340}
            height={30}
            viewBox="0 0 340 30"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
            <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
            <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
            <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
            <rect x="18" y="23" rx="3" ry="3" width="561" height="24" />
            <rect x="28" y="33" rx="3" ry="3" width="200" height="11" />
            <rect x="38" y="43" rx="3" ry="3" width="200" height="11" />
            <rect x="28" y="33" rx="3" ry="3" width="561" height="24" />
        </ContentLoader>
    );
};

export default OneLineLoader;
