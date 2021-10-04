/* eslint-disable import/prefer-default-export */
export function clearBody(body) {
    return body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8);
}
