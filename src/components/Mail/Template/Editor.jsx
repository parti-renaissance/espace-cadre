import React, { useCallback, useEffect, useRef } from 'react';
import EmailEditor from 'react-email-editor';
import { useTemplateContent } from '../../../redux/template/hooks';

const Editor = () => {
    const emailEditorRef = useRef(null);

    const { content, setContent } = useTemplateContent();

    const onLoadEditor = useCallback(() => {
        const timer = setInterval(() => {
            if (emailEditorRef && emailEditorRef.current && emailEditorRef.current.editor) {
                if (content) {
                    emailEditorRef.current.editor.loadDesign(content);
                }

                emailEditorRef.current.addEventListener('design:updated', () => emailEditorRef.current.exportHtml((event) => {
                    setContent(event.design);
                }));

                clearInterval(timer);
            }
        }, 500);
    }, [emailEditorRef]);

    useEffect(() => {
        if (emailEditorRef && emailEditorRef.current && emailEditorRef.current.editor && content) {
            emailEditorRef.current.editor.loadDesign(content);
        }
    }, [content]);

    return (
        <EmailEditor
            ref={emailEditorRef}
            projectId={18093}
            onLoad={onLoadEditor}
            options={{
                locale: 'fr-FR',
                safeHtml: true,
                tools: {
                    menu: {
                        enabled: false,
                    },
                },
                features: {
                    preheaderText: false,
                    textEditor: {
                        tables: true,
                        emojis: false,
                    },
                },
            }}
        />
    );
};

export default Editor;
