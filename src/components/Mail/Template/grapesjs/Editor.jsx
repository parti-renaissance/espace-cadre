import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import "./Editor.scss";
import { useEffect } from 'react';
const swv = 'sw-visibility';
const ful = 'fullscreen';
const prv = 'preview';
const obl = 'open-blocks';

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
        editor.I18n.setLocale("fr");
        editor.Panels.addPanel({
            id: 'commands',
            buttons: [
             {
                id: 'deviceDesktop',
                command: 'set-device-desktop',
                className: 'fa fa-desktop',
                attributes: {title: 'Desktop'},
                active: 1,
            }, {
                id: 'deviceTablet',
                command: 'set-device-tablet',
                className: 'fa fa-tablet',
                attributes: {title:'Tablet'},
            }, {
                id: 'deviceMobile',
                command: 'set-device-mobile',
                className: 'fa fa-mobile',
                attributes: {title: 'Mobile'},
            }
            ],
        });
        editor.Panels.addPanel(
        {
            id: 'options',
            buttons: [
              {
                active: true,
                id: swv,
                className: 'fa fa-square-o',
                command: swv,
                context: swv,
                attributes: { title: 'View components' }
              },
              {
                id: prv,
                className: 'fa fa-eye',
                command: prv,
                context: prv,
                attributes: { title: 'Preview' }
              },
              {
                id: ful,
                className: 'fa fa-arrows-alt',
                command: ful,
                context: ful,
                attributes: { title: 'Fullscreen' }
              },
              {
                id: 'show-json',
                className: 'btn-show-json',
                label: 'JSON',
                context: 'show-json',
                command(editor) {
                  editor.Modal.setTitle('Components JSON')
                    .setContent(`<textarea style="width:100%; height: 250px;">
                      ${JSON.stringify(editor.getComponents())}
                    </textarea>`)
                    .open();
                }
              }
            ]
          });
          editor.Panels.addPanel({
            id: 'views',
            buttons: [
              {
                id: obl,
                className: 'fa fa-th-large',
                command: obl,
                togglable: 0,
                attributes: { title: 'Open Blocks' }
              }
            ]
          });

        editor.getConfig().showDevices = 0;
        editor.Panels.addPanel({ id: "devices-c" }).get("buttons").add([
            { id: "set-device-desktop", command: function(e) { return e.setDevice("Desktop") }, className: "fa fa-desktop", active: 1},
            { id: "set-device-tablet", command: function(e) { return e.setDevice("Tablet") }, className: "fa fa-tablet" },
            { id: "set-device-mobile", command: function(e) { return e.setDevice("Mobile portrait") }, className: "fa fa-mobile" },
            ]);
        editor.Panels.render();
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
        editor.BlockManager.add("1/2 section", {
            id: '1/2 section',
            label: '1/2 Section',
            attributes: { class: "gjs-fonts gjs-f-b2 gjs-block gjs-one-bg gjs-four-color-h" },
            select: true,
            content: { type: '1/2 section' },
        });
        editor.Panels.getButton('views', 'open-blocks').set('active', true);
    }, []);

    return (
    <>
        <div className="panel__top">
            <div className="panel__basic-actions"></div>
        </div>
        <div id="gjs" className="editor">
              Exemple de mail
        </div>
    </>
    )
}

export default Editor;
