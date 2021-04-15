import React,  { useState } from 'react';
import { useEffect } from 'react';
import 'grapesjs/dist/css/grapes.min.css';
import Editor from "./grapesjs/Editor";
import "./Template.scss";

const Template = () => {

    // Set State elements
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [template, setTemplate] = useState("");
    const [mailObjet, setObjet] = useState("");

    // Handle CSS HTML change
    function handleChange (htmlChanged, cssChanged) {
        setHtml(htmlChanged);
        setCss(cssChanged);
        

    }

    // Handle mail object change
    const handleObj = (event) => {
        setObjet(event.target.value);
    }

    // Handle Template select change
    /*const handleTemplate = (event) => {
        setTemplate(event.target.value);
    }*/

    // Actions on mail object change
    useEffect(() => {

    }, [mailObjet]);

    // Actions on Canvas Html change
    useEffect(() => {

    }, [html]);

    // Actions on Canvas CSS change
    useEffect(() => {

    }, [css]);

    // Actions on template Select
    useEffect(() => {

    }, [template]);



    return (
        <div className="templates" style={{overflow : 'auto'}}>
            <h3>Mes Templates</h3>
            <div className="header">
                <select className="custom-select">
                    <option defaultValue="0" value="0">Selection du Template</option>
                    <option value="1">Template 1</option>
                    <option value="2">Template 2</option>
                    <option value="3">Template 3</option>
                </select>
                <button className="btn-danger">Supprimer</button>
            </div>
            <div className="objet">
                <label>Objet de l&apos;Email : &nbsp; </label>
                <input placeholder="Objet" onChange={handleObj}/>
            </div>
            <Editor onChange={handleChange}/>
        </div>
    )
}

export default Template;