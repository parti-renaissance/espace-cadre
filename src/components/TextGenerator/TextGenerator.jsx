/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
    useState, useEffect,
} from 'react';
import { useDebounce } from 'use-debounce';
import { Container, Grid, Box } from '@material-ui/core';
import { apiClientProxy } from '../../services/networking/client';
import ErrorComponent from '../ErrorComponent/ErrorComponent';

function TextGenerator() {
    const [text, setText] = useState('');
    const [textGenerated, setTextGenerated] = useState('Le texte généré apparaîtra automatiquement dans quelques secondes');
    const [debouncedSearchTerm] = useDebounce(text, 1000);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const cleanedData = textGenerated.replaceAll('\n', ' ').replaceAll('\\', '');

    const sendText = async () => {
        try {
            if (debouncedSearchTerm !== '') {
                setTextGenerated(JSON.stringify(await apiClientProxy.get(`/textGenerator?text=${debouncedSearchTerm}`)));
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error);
        }
    };

    useEffect(() => {
        sendText();
    }, [debouncedSearchTerm]);

    return (
        <Container maxWidth="xl">
            <Box
                className="with-background dc-container"
                style={{ padding: '16px', marginBottom: '16px' }}
            >
                Le créateur d&apos;éléments de langage utilise l&apos;intelligence artificielle pour générer automatiquement des contenus sur la thématique de votre choix
            </Box>
            {!hasError ? (
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Grid item style={{ marginRight: '16px' }}>
                            <label htmlFor="myText">Votre texte:</label>
                            <textarea
                                className="form-control"
                                id="myText"
                                rows="20"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Écrivez ici"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid item>
                            <label htmlFor="suggestedText">Texte généré:</label>
                            <textarea className="form-control" id="suggestedText" rows="20" value={cleanedData} readOnly />

                        </Grid>
                    </Grid>
                </Grid>
            ) : <ErrorComponent errorMessage={errorMessage} />}
        </Container>
    );
}

export default TextGenerator;
