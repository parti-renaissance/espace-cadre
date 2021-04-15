import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import React from 'react'
import { useEffect } from 'react';
import setConfig from './Config';
import "./Editor.scss";
import PropTypes from 'prop-types';

const Editor = (props) => {
    useEffect(() => {
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: true,
            plugins: ['gjs-preset-newsletter'],
            pluginsOpts: {
                'gjs-preset-newsletter': {
                    modalLabelExport: 'Copy the code and use it wherever you want',
                    codeViewerTheme: 'material',
                    cellStyle: {
                        'font-size': '12px',
                        'font-weight': 300,
                        'vertical-align': 'top',
                        color: 'rgb(111, 119, 125)',
                        margin: 0,
                        padding: 0,
                    }
                }
            },
            height: '100%',
            width: '100%',
            storageManager: false,
            blockManager: {
            },
            styleManager: {
                appendTo: '#style-manager-container',
                sectors: [{
                    name: 'Typography',
                    open: false,
                    buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow']
                }],
            },
            panels: {
                defaults: []
            }
        });
        editor.on('storage:start', () => {
            var inlinehtml = editor.getHtml();
            var inlinecss = editor.getCss();
            props.onChange(inlinehtml, inlinecss);
        });
        setConfig(editor);
    }, []);

    return (
        <>

            <div className="panel__top">
        
                <div className="panel__basic-actions"></div>
            </div>

            <div id="style-manager-container"></div>
            <div id="gjs" className="editor">
            
            </div>


        </>
    )
}

export default Editor;

Editor.propTypes = {
    onChange: PropTypes.func.isRequired,
};