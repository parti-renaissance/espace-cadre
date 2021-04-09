import 'grapesjs/dist/css/grapes.min.css';
import Editor from "./grapesjs/Editor";
import "./Template.scss";

const Template = () => {
    return (
        <div className="templates">
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
            <div class="objet">
                <label>Objet de l'Email : &nbsp; </label>
                <input placeholder="Objet"/>
            </div>
                <Editor/>
        </div>
    )
}

export default Template;
