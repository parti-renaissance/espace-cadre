/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Container, Grid, Box } from '@material-ui/core';
import { MENU } from '../../Routes';
import Scopes from '../Scopes';

const PageContent = ({ children }) => {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;
    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }

    return (
        <div id="page-content">
            <Container maxWidth="xl" disableGutters>
                <Grid container justifyContent="space-between">
                    <Box mb={1}>
                        <button
                            id="sidebar-collapse-button"
                            className="dc-container"
                            type="button"
                        >
                            <img src="images/list.svg" alt="Menu button" />
                        </button>
                        {pageTitle && pageTitle !== 'Messagerie' && <span className="page-title">{pageTitle}</span>}
                    </Box>
                    <Box mb={2}>
                        <Scopes />
                    </Box>
                </Grid>
                {children}
            </Container>
        </div>
    );
};

export default PageContent;

PageContent.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
};
