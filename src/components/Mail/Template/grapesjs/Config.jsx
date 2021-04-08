const swv = 'sw-visibility';
const ful = 'fullscreen';
const prv = 'preview';
const obl = 'open-blocks';

const setBlocks = (blockManager) => {
    blockManager.add("section-block", {
        id: 'Section',
        label: '<b>Section</b>',
        attributes: { class: "gjs-fonts gjs-f-b1 gjs-block gjs-one-bg gjs-four-color-h" },
        content: `<section><h1>Bonjour,</h1>
            <div>Ceci est un exemple de Mail</div></section>`,
    });
    blockManager.add("text-block", {
        id: 'text',
        label: 'Text',
        attributes: { class: "gjs-fonts gjs-f-text" },
        content: '<div data-gjs-type="text">Exemple de texte</div>',
    });
    blockManager.add("image-block", {
        id: 'image',
        label: 'Image',
        attributes: { class: "gjs-fonts gjs-f-image" },
        select: true,
        content: { type: 'image' },
        activate: true,
    });
    blockManager.add("link-block", {
        id: 'link',
        label: 'Link',
        attributes: { class: "fa fa-link gjs-block gjs-one-bg gjs-four-color-h" },
        select: true,
        content: {
          type: 'link',
          content: 'Link',
          style: { color: '#d983a6' }
        },
        activate: true,
    });
    blockManager.add("1/2 section", {
        id: '1/2 section',
        label: '1/2 Section',
        attributes: { class: "gjs-fonts gjs-f-b2 gjs-block gjs-one-bg gjs-four-color-h" },
        select: true,
        content: `<div style="display: flex; justify-content: space-between"><section><h1>Section 1 titre</h1>
        <div>Section1 texte</div></section><section><h1>Section 2 titre</h1>
        <div>Section2 texte</div></section></div>`,
        activate: true
    });
    blockManager.add("Divider", {
      id: 'divider',
      label: 'divider',
      attributes: { class: "gjs-fonts gjs-f-divider gjs-block gjs-one-bg gjs-four-color-h" },
      select: true,
      content: '<hr>',
      activate: true
    });
    blockManager.add("Button", {
      id: 'Button',
      label: 'Button',
      attributes: { class: 'gjs-fonts gjs-f-button' },
      content: '<a class="button" style="background-color: blue; color: white">Button</a>',
      activate: true
    });
}

const setPanels = (panels) => {
  panels.addPanel({
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
      }, {
        id: 'undo',
        className: 'fa fa-undo',
        command: 'undo',
      }, {
        id: 'redo',
        className: 'fa fa-repeat',
        command: 'redo',
      }
    ]
  });
  panels.addPanel({
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
}

const setDevices = (editor) => {
  editor.getConfig().showDevices = 0;
  editor.Panels.addPanel({ id: "devices-c" }).get("buttons").add([
      { id: "set-device-desktop", command: function(e) { return e.setDevice("Desktop") }, className: "fa fa-desktop", active: 1},
      { id: "set-device-mobile", command: function(e) { return e.setDevice("Mobile portrait") }, className: "fa fa-mobile" },
      ]);
}

const setConfig = (editor) => {
  editor.I18n.setLocale("fr");
  setPanels(editor.Panels);
  setDevices(editor);
  setBlocks(editor.BlockManager);
  editor.Panels.render();
  editor.Panels.getButton('views', 'open-blocks').set('active', true);
  editor.Commands.add('undo', {
    run(editor, sender) {
      sender.set('active', 0);
      editor.UndoManager.undo(1);
    }
  });
  editor.Commands.add('redo', {
    run(editor, sender) {
      sender.set('active', 0);
      editor.UndoManager.redo(1);
    }
  });
};

export default setConfig;