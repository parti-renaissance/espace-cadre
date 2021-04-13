import React, { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import setConfig from './Config';
import "./Editor.scss";
import "./Config.scss";

const Editor = () => {
    useEffect(() => {
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: true,
            height: '100%',
            width: '100%',
            storageManager: false,
            blockManager: {
            },
            panels: {
                defaults: []
            }
        });
        setConfig(editor);
    }, []);

    return (
        <>
            <div className="panel__top">
                <div className="panel__basic-actions"></div>
            </div>
            <div id="gjs" className="editor">
            </div>
        </>
    )
}

export default Editor;
