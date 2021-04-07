const swv = 'sw-visibility';
const expt = 'export-template';
const ful = 'fullscreen';
const prv = 'preview';

const obl = 'open-blocks';

const panelsConf = {
    defaults: [
        {
            id: 'commands',
            buttons: [
              {
                id: 'visibility',
                active: true, // active by default
                className: 'btn-toggle-borders',
                label: 'Editor',
                command: 'sw-visibility', // Built-in command
              }, {
                id: 'export',
                className: 'btn-open-export',
                label: 'Code',
                command: 'export-template',
                context: 'export-template', // For grouping context of buttons from the same panel
              }, {
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
                },
              }
            ],
        },
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
                id: expt,
                className: 'fa fa-code',
                command: expt,
                attributes: { title: 'View code' }
              },
            ]
          },
          {
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
          }
    ]
};

export default panelsConf;