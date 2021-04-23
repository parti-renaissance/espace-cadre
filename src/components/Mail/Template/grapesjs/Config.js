const setConfig = (editor) => {
    // console.log(editor.Panels.getPanels());

    editor.Panels.removeButton('options', 'gjs-open-import-template');
    editor.Panels.removeButton('options', 'gjs-toggle-images');

    // editor.Panels.addButton('options', {
    //     id: 'undo',
    //     className: 'fa fa-undo',
    //     command: 'undo',
    // });
    // editor.Panels.addButton('options', {
    //     id: 'redo',
    //     className: 'fa fa-repeat',
    //     command: 'redo',
    // });
};

export default setConfig;
