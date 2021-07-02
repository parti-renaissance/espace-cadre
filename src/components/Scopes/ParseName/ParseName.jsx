function ParseName({ name }) {
    if (name === 'candidate') {
        return 'Candidat';
    } if (name === 'deputy') {
        return 'Député';
    } if (name === 'senator') {
        return 'Sénateur';
    }
    return 'Référent';
}

export default ParseName;
