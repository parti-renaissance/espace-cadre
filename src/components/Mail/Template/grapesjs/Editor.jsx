import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import { useEffect } from 'react';
import setConfig from './Config';
import "./Editor.scss";

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
