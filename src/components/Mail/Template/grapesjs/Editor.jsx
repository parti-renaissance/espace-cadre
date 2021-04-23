/* eslint-disable react/destructuring-assignment */
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import fr from 'grapesjs/locale/fr';
import nlPluginGrapesjs from 'grapesjs-preset-newsletter';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import setConfig from './Config';
import './Editor.scss';

const Editor = (props) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(props.loadingContent);
    }, [props.loadingContent]);

    useEffect(() => {
        grapesjs.plugins.add(nlPluginGrapesjs);

        const editor = grapesjs.init({
            i18n: {
                locale: 'fr',
                messages: { fr },
            },
            clearOnRender: true,
            container: '#gjs',
            fromElement: true,
            mediaCondition: 'min-width',
            height: '100%',
            width: '100%',
            storageManager: false,
            blockManager: {},
            plugins: ['gjs-preset-newsletter'],
            pluginsOpts: {
                'gjs-preset-newsletter': {
                    cellStyle: {
                        'font-size': '12px',
                        'font-weight': 300,
                        'vertical-align': 'top',
                        color: 'rgb(111, 119, 125)',
                        margin: 0,
                        padding: 0,
                    },
                },
            },
        });

        if (props.loadingContent !== '' && props.loadingContent !== 'clear') {
            editor.setComponents(props.loadingContent);
        } else if (props.loadingContent === 'clear') {
            editor.DomComponents.clear();
        }

        setConfig(editor);

        editor
            .on('storage:start', () => {
                // props.onChange(templateSave);
            });
    }, [content]);

    return (
        <>
            <div className="panel__top">
                <div className="panel__basic-actions" />
            </div>
            <div id="gjs" className="editor" />
        </>
    );
};

export default Editor;

Editor.propTypes = {
    onChange: PropTypes.func.isRequired,
    loadingContent: PropTypes.string.isRequired,
};
