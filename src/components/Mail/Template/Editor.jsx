import React, {
    useCallback, useEffect, useRef, useState,
} from 'react';
import EmailEditor from 'react-email-editor';

import PropTypes from 'prop-types';

import { useTemplateContent } from '../../../redux/template/hooks';

const Editor = (props) => {
    const emailEditorRef = useRef(null);
    const [, setContent] = useTemplateContent();

    // Template chargé
    const [loaded, setLoaded] = useState('');

    const onLoadEditor = useCallback(() => {
        const timer = setInterval(() => {
            if (emailEditorRef && emailEditorRef.current && emailEditorRef.current.editor) {
                emailEditorRef.current.addEventListener(
                    'design:updated',
                    () => emailEditorRef.current.exportHtml(setContent),
                );

                clearInterval(timer);
            }
        }, 500);
    }, [emailEditorRef]);

    useEffect(() => {
        setContent();
        setLoaded(props.loadedT);
    }, []);

    // Chargement si un template existant est sélectionné
    useEffect(() => {
        if (Object.entries(loaded).length !== 0) console.log('CHARGER LES TEMPLATES');
    }, [loaded]);

    return (
        <EmailEditor
            minHeight="85vh"
            ref={emailEditorRef}
            projectId={18093}
            onLoad={onLoadEditor}
            options={{
                locale: 'fr-FR',
                safeHtml: true,
                templateId: 41208,
                tools: {
                    menu: {
                        enabled: false,
                    },
                },
                features: {
                    preheaderText: false,
                    textEditor: {
                        tables: true,
                        emojis: false,
                    },
                },
            }}
        />
    );
};

export default Editor;

Editor.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    loadedT: PropTypes.object.isRequired,
};
