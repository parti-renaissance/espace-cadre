import React, { useCallback, useRef } from 'react';
import EmailEditor from 'react-email-editor';

import { useTemplateContent } from '../../../redux/template/hooks';

const Editor = () => {
    const emailEditorRef = useRef(null);
    const [, setContent] = useTemplateContent();

    const onLoadEditor = useCallback(() => {
        const timer = setInterval(() => {
            if (emailEditorRef && emailEditorRef.current && emailEditorRef.current.editor) {
                emailEditorRef.current.addEventListener(
                    'design:updated',
                    () => emailEditorRef.current.exportHtml(setContent),
                );

                clearInterval(timer);
            }
        }, 500);
    }, [emailEditorRef]);

    return (
        <EmailEditor
            minHeight="85vh"
            ref={emailEditorRef}
            projectId={18093}
            onLoad={onLoadEditor}
            options={{
                locale: 'fr-FR',
                safeHtml: true,
                templateId: 41208,
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
