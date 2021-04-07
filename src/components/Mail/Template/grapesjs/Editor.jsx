import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import "./Editor.scss";
import { useEffect } from 'react';
import panelsConf from './panelsConf';

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
            panels: panelsConf
        });
        editor.I18n.setLocale("fr");

        editor.BlockManager.add("section-block", {
            id: 'Section',
            label: '<b>Section</b>',
            attributes: { class: "gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h" },
            content: `<section><h1>Bonjour,</h1>
                <div>Ceci est un exemple de Mail</div></section>`,
        });
        editor.BlockManager.add("text-block", {
            id: 'text',
            label: 'Text',
            attributes: { class: "gjs-fonts gjs-f-text" },
            content: '<div data-gjs-type="text">Exemple de texte</div>',
        });
        editor.BlockManager.add("image-block", {
            id: 'image',
            label: 'Image',
            attributes: { class: "gjs-fonts gjs-f-image" },
            select: true,
            content: { type: 'image' },
            activate: true,
        });
        editor.BlockManager.add("link-block", {
            id: 'link',
            label: 'Link',
            attributes: { class: "fa fa-link gjs-block gjs-one-bg gjs-four-color-h" },
            select: true,
            content: { type: 'link' },
            activate: true,
        });
        editor.Panels.getButton('views', 'open-blocks').set('active', true);
    }, []);

    return (
    <>
        <div class="panel__top">
            <div class="panel__basic-actions"></div>
        </div>
        <div id="gjs" className="editor">
          <h1>Exemple d'Email</h1>
        </div>
    </>
    )
}

export default Editor;
