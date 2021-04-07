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
                }
              }
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