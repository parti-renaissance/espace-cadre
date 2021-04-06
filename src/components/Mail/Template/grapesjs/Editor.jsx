import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import "./Editor.scss";
import { useEffect } from 'react';

const Editor = () => {

    useEffect(() => {
        const editor = grapesjs.init({
            // Indicate where to init the editor. You can also pass an HTMLElement
            container: '#gjs',
            // Get the content for the canvas directly from the element
            // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
            fromElement: true,
            // Size of the editor
            height: '100%',
            width: '100%',
            // Disable the storage manager for the moment
            storageManager: false,
            // Avoid any default panel
            panels: {
                defaults: []
            },
            blockManager: {
                appendTo: '#blocks',
            }
        });

        editor.BlockManager.add("section-block", {
            id: 'section', // id is mandatory
            label: '<b>Section</b>', // You can use HTML/SVG inside labels
            attributes: { class:'gjs-block-section' },
            content: `<section>
                <h1>This is a simple title</h1>
                <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
        });
        editor.BlockManager.add("text-block", {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
        });
        editor.BlockManager.add("image-block", {
            id: 'image',
            label: 'Image',
            // Select the component once it's dropped
            select: true,
            // You can pass components as a JSON instead of a simple HTML string,
            // in this case we also use a defined component type `image`
            content: { type: 'image' },
            // This triggers `active` event on dropped components and the `image`
            // reacts by opening the AssetManager
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
    }, []);

    return (
    <>
        <div class="panel__top">
            <div class="panel__basic-actions"></div>
        </div>
        <div id="gjs">
            <h1>Hello World Component!</h1>
        </div>
        <div id="blocks"></div>
    </>
    )
}

export default Editor;
