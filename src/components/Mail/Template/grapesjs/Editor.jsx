import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import "./Editor.scss";
import { useEffect } from 'react';

const Editor = () => {

    useEffect(() => {
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: true,
            height: '100%',
            width: '100%',
            storageManager: false,
            panels: {
                defaults: []
            },
            blockManager: {
                appendTo: '#blocks',
            },
            layerManager: {
              appendTo: '.layers-container'
            },
            styleManager: {
              appendTo: '.styles-container',
              sectors: [{
                  name: 'Dimension',
                  open: false,
                  // Use built-in properties
                  buildProps: ['width', 'min-height', 'padding'],
                  // Use `properties` to define/override single property
                  properties: [
                    {
                      // Type of the input,
                      // options: integer | radio | select | color | slider | file | composite | stack
                      type: 'integer',
                      name: 'The width', // Label for the property
                      property: 'width', // CSS property (if buildProps contains it will be extended)
                      units: ['px', '%'], // Units, available only for 'integer' types
                      defaults: 'auto', // Default value
                      min: 0, // Min value, available only for 'integer' types
                    }
                  ]
                },{
                  name: 'Extra',
                  open: false,
                  buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                  properties: [
                    {
                      id: 'custom-prop',
                      name: 'Custom Label',
                      property: 'font-size',
                      type: 'select',
                      defaults: '32px',
                      // List of options, available only for 'select' and 'radio'  types
                      options: [
                        { value: '12px', name: 'Tiny' },
                        { value: '18px', name: 'Medium' },
                        { value: '32px', name: 'Big' },
                      ],
                   }
                  ]
                }]
            },
        });

        editor.BlockManager.add("section-block", {
            id: 'Section',
            label: '<b>Section</b>',
            attributes: { class:'gjs-block-section' },
            content: `<section><h1>Bonjour,</h1>
                <div>Ceci est un exemple de Mail</div></section>`,
        });
        editor.BlockManager.add("text-block", {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Exemple de texte</div>',
        });
        editor.BlockManager.add("image-block", {
            id: 'image',
            label: 'Image',
            select: true,
            content: { type: 'image' },
            activate: true,
        });
        editor.Panels.addPanel({
          id: 'panel-top',
          el: '.panel__top',
        });
        editor.Panels.addPanel({
          id: 'basic-actions',
          el: '.panel__basic-actions',
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
        });
        editor.Panels.addPanel({
          id: 'layers',
          el: '.panel__right',
          // Make the panel resizable
          resizable: {
            maxDim: 350,
            minDim: 200,
            tc: 0, // Top handler
            cl: 1, // Left handler
            cr: 0, // Right handler
            bc: 0, // Bottom handler
            // Being a flex child we need to change `flex-basis` property
            // instead of the `width` (default)
            keyWidth: 'flex-basis',
          }
        });
    }, []);

    return (
    <>
        <div class="panel__top">
            <div class="panel__basic-actions"></div>
        </div>
        <div class="editor-row">
            <div class="editor-canvas">
                <div id="gjs">
                  <h1>Exemple d'Email</h1>
                </div>
            </div>
            <div class="panel__right">
            <div class="layers-container"></div>
            <div class="styles-container"></div>
            </div>
        </div>
        <div id="blocks"></div>
    </>
    )
}

export default Editor;
