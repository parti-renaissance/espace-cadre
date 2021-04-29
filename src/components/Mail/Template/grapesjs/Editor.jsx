/* eslint-disable react/destructuring-assignment */
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
// eslint-disable-next-line no-unused-vars
import ckeditor from 'ckeditor';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { apiClient } from '../../../../services/networking/client';
import setConfig from './Config';
import './Editor.scss';

const juice = require('juice');

const Editor = (props) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(props.loadingContent);
    }, [props.loadingContent]);

    useEffect(() => {
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: true,
            height: '100%',
            width: '100%',
            storageManager: false,
            blockManager: {},
            assetManager: {
                uploadFile: async (e) => {
                    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                    const formData = new FormData();
                    formData.append('upload', files[0]);

                    const response = await apiClient.post('/v3/upload/adherent_message', formData, { 'Content-type': 'multipart/form-data' });
                    editor.AssetManager.add(response.url);
                },
            },
            styleManager: {
                sectors: [{
                    name: 'Typography',
                    open: false,
                    buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'font-style', 'vertical-align', 'text-shadow'],
                    properties: [
                        { name: 'Font', property: 'font-family' },
                        { name: 'Weight', property: 'font-weight' },
                        { name: 'Font color', property: 'color' },
                        {
                            property: 'text-align',
                            type: 'radio',
                            defaults: 'left',
                            list: [
                                { value: 'left', name: 'Left', className: 'fa fa-align-left' },
                                { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                                { value: 'right', name: 'Right', className: 'fa fa-align-right' },
                                { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' },
                            ],
                        }, {
                            property: 'text-decoration',
                            type: 'radio',
                            defaults: 'none',
                            list: [
                                { value: 'none', name: 'None', className: 'fa fa-times' },
                                { value: 'underline', name: 'underline', className: 'fa fa-underline' },
                                { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough' },
                            ],
                        }, {
                            property: 'font-style',
                            type: 'radio',
                            defaults: 'normal',
                            list: [
                                { value: 'normal', name: 'Normal', className: 'fa fa-font' },
                                { value: 'italic', name: 'Italic', className: 'fa fa-italic' },
                            ],
                        }, {
                            property: 'vertical-align',
                            type: 'select',
                            defaults: 'baseline',
                            list: [
                                { value: 'baseline' },
                                { value: 'top' },
                                { value: 'middle' },
                                { value: 'bottom' },
                            ],
                        }, {
                            property: 'text-shadow',
                            properties: [
                                { name: 'X position', property: 'text-shadow-h' },
                                { name: 'Y position', property: 'text-shadow-v' },
                                { name: 'Blur', property: 'text-shadow-blur' },
                                { name: 'Color', property: 'text-shadow-color' },
                            ],
                        }],
                }, {
                    name: 'Dimension',
                    open: false,
                    buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                    properties: [{
                        property: 'margin',
                        properties: [
                            { name: 'Top', property: 'margin-top' },
                            { name: 'Left', property: 'margin-left' },
                            { name: 'Right', property: 'margin-right' },
                            { name: 'Bottom', property: 'margin-bottom' },
                        ],
                    }, {
                        property: 'padding',
                        properties: [
                            { name: 'Top', property: 'padding-top' },
                            { name: 'Right', property: 'padding-right' },
                            { name: 'Bottom', property: 'padding-bottom' },
                            { name: 'Left', property: 'padding-left' },
                        ],
                    }],
                },
                {
                    name: 'Decorations',
                    open: false,
                    buildProps: ['background-color', 'border-collapse', 'border-radius', 'border', 'background'],
                    properties: [{
                        property: 'background-color',
                        name: 'Background',
                    }, {
                        property: 'border-radius',
                        properties: [
                            { name: 'Top', property: 'border-top-left-radius' },
                            { name: 'Right', property: 'border-top-right-radius' },
                            { name: 'Bottom', property: 'border-bottom-left-radius' },
                            { name: 'Left', property: 'border-bottom-right-radius' },
                        ],
                    }, {
                        property: 'border-collapse',
                        type: 'radio',
                        defaults: 'separate',
                        list: [
                            { value: 'separate', name: 'No' },
                            { value: 'collapse', name: 'Yes' },
                        ],
                    },
                    {
                        property: 'border',
                        properties: [
                            { name: 'Width', property: 'border-width', defaults: '0' },
                            { name: 'Style', property: 'border-style' },
                            { name: 'Color', property: 'border-color' },
                        ],
                    }, {
                        property: 'background',
                        properties: [
                            { name: 'Image', property: 'background-image' },
                            { name: 'Repeat', property: 'background-repeat' },
                            { name: 'Position', property: 'background-position' },
                            { name: 'Attachment', property: 'background-attachment' },
                            { name: 'Size', property: 'background-size' },
                        ],
                    }],
                }],
            },
            panels: {
                defaults: [],
            },
        });

        if (props.loadingContent !== '' && props.loadingContent !== 'clear') {
            editor.setComponents(props.loadingContent);
        } else if (props.loadingContent === 'clear') {
            editor.DomComponents.clear();
        }
        const comps = editor.DomComponents;
        const textType = comps.getType('text');

        comps.addType('text', {
            model: textType.model,
            view: textType.view.extend({
                events: {
                    click: 'onActive',
                },
            }),
        });
        setConfig(editor);
        editor
            .on('storage:start', () => {
                const tmp = `${editor.getHtml()}<style>${editor.getCss()}</style>`;
                const templateSave = juice(tmp, []);
                props.onChange(templateSave);
            })
            .on('load', () => {
                editor.Panels.getButton('views', 'open-blocks').set('active', true);
            });
        editor.on('load', () => {
            const prop = editor.StyleManager.getProperty('typography', 'font-family');
            prop.set('options', [
                { value: 'Roboto, Arial, sans-serif', name: 'Roboto' },
                { value: "'Oswald', sans-serif", name: 'Oswald' },
                { value: 'Helvetica Neue,Helvetica,Arial,sans-serif', name: 'Helvetica' },
                { value: 'sans-serif', name: 'sans-serif' },
                { value: 'Times New Roman', name: 'Times New Roman' },
                { value: 'Arial Black', name: 'Arial Black' },
                { value: "'Avenir Book', Avenir", name: 'Avenir Book' },
                { value: "'Avenir Medium', Avenir", name: 'Avenir Medium' },
                { value: "'Avenir Roman', Avenir", name: 'Avenir Roman' },
                { value: "'Montserrat', sans-serif", name: 'Montserrat' },
                { value: "'Merriweather', sans-serif", name: 'Merriweather' },
                { value: "'Oswald', sans-serif", name: 'Oswald' },
                { value: "'Shadows Into Light', cursive", name: 'Shadows Into Light' },
                { value: "'Pacifico', cursive", name: 'Pacifico' },
                { value: 'Tahoma', name: 'Tahoma' },
                { value: 'Verdana, Geneva, sans-serif', name: 'Verdana' },
                { value: 'Courier New Courier, monospace', name: 'Courier New Courier' },
                { value: "'Lato', sans-serif", name: 'Lato' },
                { value: "'Open Sans', sans-serif", name: 'Open Sans' },
                { value: "'Montserrat', sans-serif", name: 'Montserrat' },
            ]);
        });
    }, [content]);

    return (
        <>
            <div className="panel__basic-actions" />
            <div id="gjs" className="editor" />
        </>
    );
};

export default Editor;

Editor.propTypes = {
    onChange: PropTypes.func.isRequired,
    loadingContent: PropTypes.string.isRequired,
};
