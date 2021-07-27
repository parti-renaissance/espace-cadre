/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
    useState, useEffect,
} from 'react';
import $ from 'jquery';
import { useDebounce } from 'use-debounce';
import { apiClientProxy } from '../../services/networking/client';
import ErrorComponent from '../ErrorComponent/ErrorComponent';

function TextGenerator() {
    const [text, setText] = useState('');
    const [textGenerated, setTextGenerated] = useState('Votre texte généré apparaîtra ici');
    const [debouncedSearchTerm] = useDebounce(text, 1000);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const sendText = async () => {
        try {
            if (debouncedSearchTerm !== '') {
                setTextGenerated(JSON.stringify(await apiClientProxy.get(`/textGenerator?text=${debouncedSearchTerm}`)));
                $('.bar').css('display', 'none');
            }
        } catch (error) {
            console.log(error);
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
                    <div className="col-12 col-lg-6 mb-3">
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
                    <div className="col-12 col-lg-6">
                        {debouncedSearchTerm && (
                            <div className="bar mb-3">
                                <div className="in" />
                            </div>
                        )}
                        <label htmlFor="suggestedText">Texte suggéré:</label>
                        <textarea className="form-control" id="suggestedText" rows="20" value={textGenerated} readOnly />
                    </div>
                </div>
            ) : <ErrorComponent errorMessage={errorMessage} />}
        </div>
    );
}

export default TextGenerator;
