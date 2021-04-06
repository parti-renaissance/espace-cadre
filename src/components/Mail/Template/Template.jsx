import 'grapesjs/dist/css/grapes.min.css';
import Editor from "./grapesjs/Editor";
import "./Template.scss";

const Template = () => {
    return (
        <div className="templates">
            Mes Templates
            <div className="header">
                <select className="custom-select mb-3">
                    <option defaultValue="0" value="0">Selection du Template</option>
                    <option value="1">Template 1</option>
                    <option value="2">Template 2</option>
                    <option value="3">Template 3</option>
                </select>
            </div>
            <Editor/>
        </div>
    )
}

export default Template;
