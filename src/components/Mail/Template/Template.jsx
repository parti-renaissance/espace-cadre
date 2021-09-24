import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import SendForm from './SendForm';
import TemplateSelect from './TemplateSelect';
import Editor from './Editor';
import DynamicFilters from '../../Filters/DynamicFilters';
import { FEATURE_MESSAGES } from '../../Feature/FeatureCode';

const Template = () => {
    const [filters, setFilters] = useState({});

    return (
        <Container maxWidth="xl">
            <DynamicFilters
                feature={FEATURE_MESSAGES}
                values={filters}
                onSubmit={(newFilters) => setFilters({ ...newFilters, ...{ page: 1 } })}
                onReset={() => { setFilters({ page: 1 }); }}
            />
            <SendForm />
            <TemplateSelect />
            <Editor />
        </Container>
    );
};

export default Template;
