/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, {
    useCallback, useState, useEffect, useRef,
} from 'react';
import EmailEditor from 'react-email-editor';
import { Button, makeStyles, createStyles } from '@material-ui/core';
import { useUserScope } from '../../../redux/user/hooks';
import { useTemplateContent } from '../../../redux/template/hooks';

const useStyles = makeStyles((theme) => createStyles({
    emailEditor: {
        marginBottom: '16px',
    },
    exportButton: {
        color: theme.palette.gray500,
        background: theme.palette.gray200,
        margin: '16px 0 0',
        '&:hover, &:focus': {
            color: theme.palette.gray500,
            background: theme.palette.gray100,
        },
    },
}));

const Editor = () => {
    const emailEditorRef = useRef(null);
    const hiddenElement = useRef(null);
    const classes = useStyles();
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

    const exportHtml = () => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const file = new Blob([data.html], { type: 'text/html' });
            hiddenElement.current.href = URL.createObjectURL(file);
            hiddenElement.current.download = 'template.html';
            hiddenElement.current.click();
        });
    };

    return (
        <div className={classes.emailEditor}>
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
                        video: { enabled: true },
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
            <Button
                variant="contained"
                size="medium"
                className={classes.exportButton}
                onClick={exportHtml}
            >
                Export HTML
            </Button>
            <a ref={hiddenElement} />
        </div>
    );
};

export default Editor;
