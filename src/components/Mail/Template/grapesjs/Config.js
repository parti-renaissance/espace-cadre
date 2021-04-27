const juice = require('juice');

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
