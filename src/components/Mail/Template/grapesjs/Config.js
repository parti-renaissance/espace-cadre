const juice = require('juice');

const swv = 'sw-visibility';
const ful = 'fullscreen';
const prv = 'preview';
const obl = 'open-blocks';
const osm = 'open-sm';
const otm = 'open-tm';

const setBlocks = (blockManager) => {
    blockManager.add('1 Section', {
        label: '1 Section',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<table style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%">
          <tr>
            <td style="padding: 0; margin: 0; vertical-align : top"></td>
          </tr>
          </table>`,
    });
    blockManager.add('1/2 Section', {
        label: '1/2 Section',
        attributes: { class: 'gjs-fonts gjs-f-b2' },
        content: `<table  style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%">
          <tr>
            <td style="padding: 0; margin: 0; vertical-align : top; width: 50%"></td>
            <td style="padding: 0; margin: 0; vertical-align : top; width: 50%"></td>
          </tr>
          </table>`,
    });
    blockManager.add('1/3 Section', {
        label: '1/3 Section',
        attributes: { class: 'gjs-fonts gjs-f-b3' },
        content: `<table style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%">
          <tr>
            <td style="padding: 0; margin: 0; vertical-align : top; width: 33.3333%"></td>
            <td style="padding: 0; margin: 0; vertical-align : top; width: 33.3333%"></td>
            <td style="padding: 0; margin: 0; vertical-align : top; width: 33.3333%"></td>
          </tr>
          </table>`,
    });
    blockManager.add('3/7 Section', {
        label: '3/7 Section',
        attributes: { class: 'gjs-fonts gjs-f-b37' },
        content: `<table style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%">
          <tr>
            <td style="padding: 0; margin: 0; vertical-align : top; width:30%"></td>
            <td style="padding: 0; margin: 0; vertical-align : top; width:70%"></td>
          </tr>
          </table>`,
    });
    blockManager.add('button', {
        label: 'Bouton',
        content: '<a class="button">Button</a>',
        attributes: { class: 'gjs-fonts gjs-f-button' },
    });
    blockManager.add('divider', {
        label: 'Séparateur',
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
        attributes: { class: 'gjs-fonts gjs-f-divider' },
    });
    blockManager.add('text', {
        label: 'Texte',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: {
            type: 'text',
            content: 'Insert your text here',
            style: { padding: '10px' },
            activeOnRender: 1,
        },
    });
    blockManager.add('text-sect', {
        label: 'Section Texte',
        content: '<h1 class="heading">Insert title here</h1><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>',
        attributes: { class: 'gjs-fonts gjs-f-h1p' },
    });
    blockManager.add('image', {
        label: 'Image',
        attributes: { class: 'gjs-fonts gjs-f-image' },
        content: {
            type: 'image',
            style: { color: 'black', height: '175px', width: '200px' },
            activeOnRender: 1,
        },
    });
    blockManager.add('link', {
        label: 'Lien',
        attributes: { class: 'fa fa-link' },
        content: {
            type: 'link',
            content: 'Link',
            style: { color: '#3b97e3' },
        },
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
