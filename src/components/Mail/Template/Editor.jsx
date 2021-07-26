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
    const [templateId, setTemplateId] = useState(41208);

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

    const getTemplateId = () => {
        if (currentScope && currentScope.code === 'referent') {
            setTemplateId(60354);
        } else if (currentScope && currentScope.code === 'deputy') {
            setTemplateId(60376);
        } else if (currentScope && currentScope.code === 'senator') {
            setTemplateId(60355);
        } else {
            setTemplateId(41208);
        }
    };
    useEffect(() => {
        getTemplateId();
    }, []);

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
            )
        </div>

    );
};

export default Editor;
