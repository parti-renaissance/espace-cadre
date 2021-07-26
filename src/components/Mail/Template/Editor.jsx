import React, {
    useCallback, useState, useEffect, useRef,
} from 'react';
import EmailEditor from 'react-email-editor';
import { useUserScope } from '../../../redux/user/hooks';
import { useTemplateContent } from '../../../redux/template/hooks';

const Editor = () => {
    const emailEditorRef = useRef(null);
    const [content, setContent] = useTemplateContent();
    const [currentScope] = useUserScope();
    const [templateId] = useState(() => {
        if (currentScope && currentScope.code === 'referent') {
            return 60354;
        } if (currentScope && currentScope.code === 'deputy') {
            return 60376;
        } if (currentScope && currentScope.code === 'senator') {
            return 60355;
        }
        return 41208;
    });

    const onLoadEditor = useCallback(() => {
        const timer = setInterval(() => {
            if (emailEditorRef && emailEditorRef.current && emailEditorRef.current.editor) {
                const callback = () => emailEditorRef.current.exportHtml(
                    (event) => setContent({ design: event.design, chunks: event.chunks, externalUpdate: false }),
                );

                emailEditorRef.current.editor.addEventListener('design:updated', callback);
                emailEditorRef.current.editor.addEventListener('design:loaded', callback);

                clearInterval(timer);
            }
        }, 500);
    }, [emailEditorRef]);

    useEffect(() => {
        if (content && content.design && content.externalUpdate) {
            emailEditorRef.current.loadDesign(content.design);
        }
    }, [content]);

    return (
        <div className="email-editor">
            <EmailEditor
                minHeight="85vh"
                ref={emailEditorRef}
                projectId={process.env.REACT_APP_UNLAYER_PROJECT_ID}
                onLoad={onLoadEditor}
                options={{
                    locale: 'fr-FR',
                    safeHtml: true,
                    templateId,
                    tools: {
                        button: { enabled: true },
                        divider: { enabled: true },
                        form: { enabled: true },
                        heading: { enabled: true },
                        image: { enabled: true },
                        menu: { enabled: true },
                        social: { enabled: true },
                        text: { enabled: true },
                        timer: { enabled: true },
                        video: { enabled: true }
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
        </div>
    );
};

export default Editor;
