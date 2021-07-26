import React, {
    useCallback, useState, useEffect, useRef,
} from 'react';
import EmailEditor from 'react-email-editor';
import { useUserScope } from '../../../redux/user/hooks';

import { useTemplateContent } from '../../../redux/template/hooks';
import Loader from '../../Loader';

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
            setTemplateId(process.env.REACT_APP_UNLAYER_REFERENT_TEMPLATE_ID);
        } else if (currentScope && currentScope.code === 'deputy') {
            setTemplateId(process.env.REACT_APP_UNLAYER_DEPUTY_TEMPLATE_ID);
        } else if (currentScope && currentScope.code === 'senator') {
            setTemplateId(process.env.REACT_APP_UNLAYER_SENATOR_TEMPLATE_ID);
        }
        setTemplateId(process.env.REACT_APP_UNLAYER_DEFAULT_TEMPLATE_ID);
    };

    useEffect(() => {
        setTemplateId(getTemplateId());
    }, []);

    return (
        <div className="email-editor">
            {templateId ? (
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
                : (
                    <div className="with-background dc-container text-center">
                        <Loader />
                    </div>
                )}
        </div>

    );
};

export default Editor;
