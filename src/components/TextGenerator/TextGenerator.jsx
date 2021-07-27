/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
    useState, useEffect,
} from 'react';
import { useDebounce } from 'use-debounce';
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
        <div className="container-fluid">
            {!hasError ? (
                <div className="row">
                    <div className="col-lg-6 mb-3">
                        <label htmlFor="myText">Votre texte:</label>
                        <textarea
                            className="form-control"
                            id="myText"
                            rows="20"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Écrivez ici"
                        />
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label htmlFor="suggestedText">Texte généré:</label>
                        <textarea className="form-control" id="suggestedText" rows="20" value={cleanedData} readOnly />

                    </div>
                </div>
            ) : <ErrorComponent errorMessage={errorMessage} />}
        </div>
    );
}

export default TextGenerator;
