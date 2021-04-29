/*const juice = require('juice');

const swv = 'sw-visibility';
const ful = 'fullscreen';
const prv = 'preview';
const obl = 'open-blocks';
const osm = 'open-sm';
const otm = 'open-tm';

const setPanels = (panels) => {
    panels.addPanel({
        id: 'options',
        buttons: [
            {
                id: swv,
                className: 'fa fa-square-o',
                command: swv,
                context: swv,
                attributes: { title: 'View components' },
            },
            {
                id: prv,
                className: 'fa fa-eye',
                command: prv,
                context: prv,
                attributes: { title: 'Preview' },
            },
            {
                id: ful,
                className: 'fa fa-arrows-alt',
                command: ful,
                context: ful,
                attributes: { title: 'Fullscreen' },
            },
            {
                id: 'show-json',
                className: 'btn-show-json',
                label: 'JSON',
                context: 'show-json',
                command(editor) {
                    editor.Modal
                        .setTitle('Components JSON')
                        .setContent(
                            `<textarea style="width:100%; height: 250px;">
                                ${JSON.stringify(editor.getComponents())}
                            </textarea>`,
                        )
                        .open();
                },
            },
            {
                // Commande d'export de l'HTML du canvas
                id: 'Export Code',
                className: 'fa fa-code',
                context: 'ExportCode',
                command(editor) {
                    const md = editor.Modal;
                    const container = document.createElement('div');
                    const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
                    let viewer = codeViewer.editor;
                    if (!viewer) {
                        const txtarea = document.createElement('textarea');
                        container.appendChild(txtarea);
                        codeViewer.init(txtarea);
                        viewer = codeViewer.editor;
                        viewer.setOption('lineWrapping', 1);
                    }
                    md.setContent(container);
                    const tmp = `${editor.getHtml()}<style>${editor.getCss()}</style>`;
                    codeViewer.setContent(juice(tmp, []));
                    md.setTitle('Export Mail Code');
                    md.open();
                    viewer.refresh();
                },
            },
            {
                id: 'undo',
                className: 'fa fa-undo',
                command: 'undo',
            }, {
                id: 'redo',
                className: 'fa fa-repeat',
                command: 'redo',
            },
        ],
    });
    // Add buttons for panel selection
    panels.addPanel({
        id: 'views',
        buttons: [
            {
                id: obl,
                className: 'fa fa-th-large',
                command: obl,
                togglable: 1,
                attributes: { title: 'Open Blocks' },
            },
            {
                id: osm,
                command: osm,
                className: 'fa fa-paint-brush',
                togglable: 1,
                attributes: { title: 'Style Manager' },
            },
            {
                id: otm,
                command: otm,
                className: 'fa fa-cog',
            },
        ],
    });
};

const setConfig = (editor) => {
    editor.I18n.setLocale('fr');
    setPanels(editor.Panels);
    editor.Panels.render();
    editor.Commands.add('undo', {
        run(localEditor, sender) {
            sender.set('active', 0);
            localEditor.UndoManager.undo(1);
        },
    });
    editor.Commands.add('redo', {
        run(localEditor, sender) {
            sender.set('active', 0);
            localEditor.UndoManager.redo(1);
        },
    });
};

export default setConfig;
*/

const juice = require('juice');

const swv = 'sw-visibility';
const ful = 'fullscreen';
const prv = 'preview';
const obl = 'open-blocks';
const osm = 'open-sm';
const otm = 'open-tm';

const setBlocks = (blockManager) => {
    blockManager.add('text-block', {
        id: 'text',
        label: 'Texte',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: `<div data-gjs-type="text"> Exemple de bloc texte : Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Aenean aliquam quam sit amet eros mattis.</div>`,
    });
    blockManager.add('centeredtext-block', {
        id: 'centeredtext',
        label: 'Texte centré',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: `<div style="display: flex; justify-content: space-between">
        <div></div><p>Votre Texte Centré</p><div></div></div>`,
    });
    blockManager.add('section-block', {
        id: 'Section',
        label: '<b>Section</b>',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<table style="display :flex">
        <tr>
          <td style="display : flex"><div><h1>Bonjour,</h1>
          <div>Ceci est un exemple de Mail</div></td>
        </tr>
        </table></div>`,
    });
    blockManager.add('1/2 section', {
        id: '1/2 section',
        label: '1/2 Section',
        attributes: { class: 'gjs-fonts gjs-f-b2 gjs-block gjs-one-bg gjs-four-color-h' },
        select: true,
        content: `<table style="height: 150px;
        margin: 0 auto 10px auto; padding: 5px 5px 5px 5px ;width: 100%">
        <tr>
          <td style="padding: 0; margin: 0; vertical-align: 'top'; width: 50%"></td>
          <td style="padding: 0; margin: 0; vertical-align: 'top'; width: 50%"></td>
        </tr>
        </table>`,
        activate: true,
    });
    blockManager.add('image', {
        label: 'Image',
        attributes: { class: 'gjs-fonts gjs-f-image' },
        content: {
            type: 'image',
            style: { color: 'black', height: '150px', width: '150px' },
            activeOnRender: 1,
        },
    });
    blockManager.add('imageCentered', {
        id: 'imageCentered',
        label: 'image centrée',
        attributes: { class: 'gjs-fonts gjs-f-image' },
        select: true,
        content: '<div style="display: flex; justify-content: space-between"><div></div><img style="width: 50px"src="https://toppng.com/uploads/preview/file-upload-image-icon-115632290507ftgixivqp.png"/><div></div></div>',
        activate: true,
    });
    blockManager.add('link-block', {
        id: 'link',
        label: 'Link',
        attributes: { class: 'fa fa-link gjs-block gjs-one-bg gjs-four-color-h' },
        select: true,
        content: {
            type: 'link',
            content: 'Link',
            style: { color: '#1d5fd1' },
        },
        activate: true,
    });
    blockManager.add('Divider', {
        id: 'divider',
        label: 'Divider',
        attributes: { class: 'gjs-fonts gjs-f-divider gjs-block gjs-one-bg gjs-four-color-h' },
        content: `<table style="width: 100%; margin-top: 10px; margin-bottom: 10px;">
        <tr>
          <td class="divider"></td>
        </tr>
      </table>
      <style>
      .divider {
        background-color: rgba(0, 0, 0, 0.1);
        height: 1px;
      }
      </style>`,
    });
    blockManager.add('Button', {
        id: 'Button',
        label: 'Bouton',
        attributes: { class: 'gjs-fonts gjs-f-button' },
        content: `<div style="display: flex; justify-content: space-between">
        <a style="background-color: #1d5fd1; color: white;
        padding : 8px 16px 8px 16px; border-radius : 8px">Bouton</a></div>`,
        style: { color: '#1d5fd1' },
        activate: true,
    });
    blockManager.add('ButtonCentered', {
        id: 'ButtonCentered',
        label: 'Bouton centré',
        attributes: { class: 'gjs-fonts gjs-f-button' },
        content: `<div style="display: flex; justify-content: space-between">
        <div></div><a class="button" style="background-color: #1d5fd1; color: white;
        display:flex; align-items:center; justify-content:center;">Bouton</a><div></div></div>`,
        style: { color: '#1d5fd1' },
        activate: true,
    });
};

const setPanels = (panels) => {
    panels.addPanel({
        id: 'options',
        buttons: [
            {
                id: swv,
                className: 'fa fa-square-o',
                command: swv,
                context: swv,
                attributes: { title: 'View components' },
            },
            {
                id: prv,
                className: 'fa fa-eye',
                command: prv,
                context: prv,
                attributes: { title: 'Preview' },
            },
            {
                id: ful,
                className: 'fa fa-arrows-alt',
                command: ful,
                context: ful,
                attributes: { title: 'Fullscreen' },
            },
            {
                id: 'show-json',
                className: 'btn-show-json',
                label: 'JSON',
                context: 'show-json',
                command(editor) {
                    editor.Modal
                        .setTitle('Components JSON')
                        .setContent(
                            `<textarea style="width:100%; height: 250px;">
                                ${JSON.stringify(editor.getComponents())}
                            </textarea>`,
                        )
                        .open();
                },
            },
            {
                // Commande d'export de l'HTML du canvas
                id: 'Export Code',
                className: 'fa fa-code',
                context: 'ExportCode',
                command(editor) {
                    const md = editor.Modal;
                    const container = document.createElement('div');
                    const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
                    let viewer = codeViewer.editor;
                    if (!viewer) {
                        const txtarea = document.createElement('textarea');
                        container.appendChild(txtarea);
                        codeViewer.init(txtarea);
                        viewer = codeViewer.editor;
                        viewer.setOption('lineWrapping', 1);
                    }
                    md.setContent(container);
                    const tmp = `${editor.getHtml()}<style>${editor.getCss()}</style>`;
                    codeViewer.setContent(juice(tmp, []));
                    md.setTitle('Export Mail Code');
                    md.open();
                    viewer.refresh();
                },
            },
            {
                id: 'undo',
                className: 'fa fa-undo',
                command: 'undo',
            }, {
                id: 'redo',
                className: 'fa fa-repeat',
                command: 'redo',
            },
        ],
    });
    // Add buttons for panel selection
    panels.addPanel({
        id: 'views',
        buttons: [
            {
                id: obl,
                className: 'fa fa-th-large',
                command: obl,
                togglable: 1,
                attributes: { title: 'Open Blocks' },
            },
            {
                id: osm,
                command: osm,
                className: 'fa fa-paint-brush',
                togglable: 1,
                attributes: { title: 'Style Manager' },
            },
            {
                id: otm,
                command: otm,
                className: 'fa fa-cog',
            },
        ],
    });
};

const setDevices = (editor) => {
    editor.getConfig().showDevices = 0;
    editor.Panels.addPanel({ id: 'devices-c' }).get('buttons').add([
        {
            id: 'set-device-desktop',
            command(e) {
                return e.setDevice('Desktop', '600px');
            },
            className: 'fa fa-desktop',
            active: 1,
        },
        {
            id: 'set-device-mobile',
            command(e) {
                return e.setDevice('Mobile portrait');
            },
            className: 'fa fa-mobile',
        },
    ]);
};

const setConfig = (editor) => {
    editor.I18n.setLocale('fr');
    setPanels(editor.Panels);
    setDevices(editor);
    setBlocks(editor.BlockManager);
    editor.Panels.render();
    editor.Commands.add('undo', {
        run(localEditor, sender) {
            sender.set('active', 0);
            localEditor.UndoManager.undo(1);
        },
    });
    editor.Commands.add('redo', {
        run(localEditor, sender) {
            sender.set('active', 0);
            localEditor.UndoManager.redo(1);
        },
    });
};

export default setConfig;
