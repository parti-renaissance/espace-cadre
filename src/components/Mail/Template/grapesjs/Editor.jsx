import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import setConfig from './Config';
import './Editor.scss';

const juice = require('juice');

const Editor = (props) => {
    useEffect(() => {
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: true,
            height: '100%',
            width: '100%',
            storageManager: false,
            blockManager: {},
            styleManager: {
                sectors: [{
                    name: 'Typography',
                    open: false,
                    buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow'],
                }],
            },
            panels: {
                defaults: [],
            },
        });

        setConfig(editor);

        editor
            .on('storage:start', () => {
                const tmp = `${editor.getHtml()}<style>${editor.getCss()}</style>`;
                const templateSave = juice(tmp, []);
                props.onChange(templateSave);
            })
            .on('load', () => {
                editor.Panels.getButton('views', 'open-blocks').set('active', true);
            });
    }, []);

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
};
