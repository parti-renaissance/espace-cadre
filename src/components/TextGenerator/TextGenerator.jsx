/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
    useState, useEffect, useRef,
} from 'react';
import { useDebounce } from 'use-debounce';
import { apiClientProxy } from '../../services/networking/client';

function TextGenerator() {
    const [text, setText] = useState('');
    const [textGenerated, setTextGenerated] = useState('Votre texte généré apparaîtra ici');
    const myTextArea = useRef(null);
    const [debouncedSearchTerm] = useDebounce(text, 1000);

    const sendText = async () => {
        if (debouncedSearchTerm !== '') {
            setTextGenerated(JSON.stringify(await apiClientProxy.get(`/textGenerator?text=${debouncedSearchTerm}`)));
        }
    };
    useEffect(() => {
        sendText();
    }, [debouncedSearchTerm]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-lg-6 mb-3">
                    <label htmlFor="myText">Votre texte:</label>
                    <textarea
                        className="form-control"
                        id="myText"
                        ref={myTextArea}
                        rows="20"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Écrivez ici"
                    />
                </div>
                <div className="col-12 col-lg-6">
                    <label htmlFor="suggestedText">Texte suggéré:</label>
                    <textarea className="form-control" id="suggestedText" rows="20" value={textGenerated} readOnly />
                </div>
            </div>
        </div>
    );
}

export default TextGenerator;
