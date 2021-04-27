/* eslint-disable react/destructuring-assignment */
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import React, { useState, useEffect } from 'react';
import mlplugin from 'grapesjs-preset-newsletter';
import PropTypes from 'prop-types';

import setConfig from './Config';
import './Editor.scss';

const juice = require('juice');

const Editor = (props) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(props.loadingContent);
    }, [props.loadingContent]);

    useEffect(() => {
        grapesjs.plugins.add(mlplugin);
        const editor = grapesjs.init({
            container: '#gjs',
            fromElement: true,
            height: '100%',
            width: '100%',
            storageManager: false,
            blockManager: {},
            plugins: ['gjs-preset-newsletter'],
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
//        setConfig(editor);
        editor
            .on('storage:start', () => {
                const tmp = `${editor.getHtml()}<style>${editor.getCss()}</style>`;
                const templateSave = juice(tmp, []);
                props.onChange(templateSave);
            })
            .on('load', () => {
                editor.Panels.getButton('views', 'open-blocks').set('active', true);
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
