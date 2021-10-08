import React, { useState, useEffect, useRef } from 'react';
import EmailEditor from 'react-email-editor';
import { Button, makeStyles, createStyles } from '@material-ui/core';
import { useUserScope } from '../../../../redux/user/hooks';
import { useMessageTemplate } from '../../../../redux/messagerie/hooks';

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
    const [messageTemplate, setMessageTemplate] = useMessageTemplate();
    const emailEditorRef = useRef(null);
    const [unlayerReady, setUnlayerReady] = useState(false);

    const hiddenElement = useRef(null);
    const classes = useStyles();

    const [currentScope] = useUserScope();
    const referentTemplate = 60354;
    const deputyTemplate = 60376;
    const senatorTemplate = 60355;
    const defaultTemplate = 41208;
    const [templateId] = useState(() => {
        if (currentScope && currentScope.code === 'referent') {
            return referentTemplate;
        } if (currentScope && currentScope.code === 'deputy') {
            return deputyTemplate;
        } if (currentScope && currentScope.code === 'senator') {
            return senatorTemplate;
        }
        return defaultTemplate;
    });

    const updateMessageTemplateCallback = (skipReloadUnlayer) => {
        console.log('update design');

        emailEditorRef.current.exportHtml(
            (event) => {
                console.log();

                setMessageTemplate({
                    design: event.design,
                    chunks: event.chunks,
                    skipReloadUnlayer: !messageTemplate || messageTemplate.chunks === undefined || messageTemplate.chunks.body === event.chunks.body,
                });
            },
        );
    };

    useEffect(() => {
        if (!unlayerReady) {
            return;
        }

        emailEditorRef.current.editor.addEventListener('design:updated', (event) => {
            console.log(event);
            updateMessageTemplateCallback(true);
        });
    }, [unlayerReady]);

    useEffect(() => {
        console.log({
            action: 'useEffect',
            messageTemplate,
        });

        if (messageTemplate?.skipReloadUnlayer || !unlayerReady) {
            return;
        }

        console.log({
            unlayerReady,
            messageTemplate,
        });

        if (messageTemplate && messageTemplate.design) {
            console.log('load design', messageTemplate);
            emailEditorRef.current.loadDesign(messageTemplate.design);
            // setContentFilled(true);
        }
    }, [messageTemplate, unlayerReady]);

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
                onLoad={() => {
                    console.log('TEST!!!');
                    if (emailEditorRef && emailEditorRef.current && emailEditorRef.current.editor) {
                        emailEditorRef.current.editor.addEventListener('design:loaded', () => {
                            console.log('EVENT => design:loaded', messageTemplate);
                            if (messageTemplate === null) {
                                updateMessageTemplateCallback(true);
                            }
                        });
                    }
                }}
                onReady={() => setUnlayerReady(true)}
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
