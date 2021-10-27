import React, {
    useState, useRef, useEffect, useCallback,
} from 'react'
import EmailEditor from 'react-email-editor';
import { Button, makeStyles, createStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useUserScope } from '../../../redux/user/hooks';
import { apiClient } from '../../../services/networking/client'

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
const referentTemplate = 60354;
const deputyTemplate = 60376;
const senatorTemplate = 60355;
const defaultTemplate = 41208;
const editorConfiguration = {
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
}
const Editor = ({ onMessageSubject, onMessageUpdate }) => {
    const [editorLoaded, setEditorLoaded] = useState(false)
    const emailEditorRef = useRef(null);
    const classes = useStyles();
    const { messageUuid } = useParams()
    const [currentScope] = useUserScope();

    const [templateId] = useState(() => {
        if (currentScope?.code === 'referent') {
            return referentTemplate;
        }
        if (currentScope?.code === 'deputy') {
            return deputyTemplate;
        }
        if (currentScope?.code === 'senator') {
            return senatorTemplate;
        }
        return defaultTemplate;
    });

    const updateMessageTemplateCallback = useCallback(() => {
        emailEditorRef.current.exportHtml(
            (data) => {
                onMessageUpdate({
                    design: data.design,
                    chunks: data.chunks,
                });
            },
        );
    }, [onMessageUpdate])

    useEffect(() => {
        const { editor } = emailEditorRef.current
        const onEditorLoaded = async () => {
            if (messageUuid) {
                const messageContent = await apiClient.get(`/v3/adherent_messages/${messageUuid}/content`);
                const design = JSON.parse(messageContent.json_content)
                editor.loadDesign(design);
                onMessageSubject(messageContent.subject)
            }
            editor.addEventListener('design:updated', updateMessageTemplateCallback);
        }

        if (editorLoaded && editor) {
            onEditorLoaded()
        }

        return () => {
            editor?.removeEventListener('design:updated', updateMessageTemplateCallback);
        }
    }, [editorLoaded, messageUuid, onMessageSubject, updateMessageTemplateCallback])

    useEffect(() => {
        const editor = emailEditorRef.current?.editor
        return () => editor?.removeEventListener(updateMessageTemplateCallback)
    }, [updateMessageTemplateCallback]);

    const exportHtml = () => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const file = new Blob([data.html], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = 'template.html';
            a.click();
        });
    };

    return (
        <div className={classes.emailEditor}>
            <EmailEditor
                minHeight="85vh"
                ref={emailEditorRef}
                projectId={process.env.REACT_APP_UNLAYER_PROJECT_ID}
                onLoad={() => setEditorLoaded(true)}
                onReady={() => {
                }}
                options={{
                    locale: 'fr-FR',
                    safeHtml: true,
                    templateId: messageUuid ? null : templateId,
                    tools: editorConfiguration.tools,
                    features: editorConfiguration.features,
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
        </div>
    );
};

Editor.propTypes = {
    onMessageSubject: PropTypes.func.isRequired,
    onMessageUpdate: PropTypes.func.isRequired,
}

export default Editor;
