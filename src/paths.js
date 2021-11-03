const Paths = {
    AUTH: {
        route: '/auth',
        url: '/auth',
    },
    DASHBOARD: {
        id: 'dashboard',
        route: '/',
        url: '/',
        label: 'Vue d’ensemble',
    },
    ADHERENTS: {
        id: 'contacts',
        route: '/adherents',
        url: '/adherents',
        label: 'Adhérents',
    },
    MESSAGERIE: {
        id: 'messages',
        route: '/messagerie',
        url: '/messagerie',
        label: 'Messagerie',
    },
    MESSAGERIE_CREATE: {
        id: 'messages',
        route: '/messagerie/creer',
        url: '/messagerie/creer',
        label: 'Messagerie',
    },
    MESSAGERIE_EDIT: {
        id: 'messages',
        route: '/messagerie/:messageUuid/modifier',
        url: '/messagerie/:messageUuid/modifier',
        label: 'Messagerie',
    },
    MESSAGERIE_FILTER: {
        id: 'messages',
        route: '/messagerie/:messageUuid/filtrer',
        url: '/messagerie/:messageUuid/filtrer',
        label: 'Messagerie',
    },
    MESSAGERIE_CONFIRMATION: {
        id: 'messages',
        route: '/messagerie/confirmation',
        url: '/messagerie/confirmation',
        label: 'Messagerie',
    },
    ELECTIONS: {
        id: 'elections',
        route: '/elections',
        url: '/elections',
        label: 'Elections',
    },
    RIPOSTES: {
        id: 'ripostes',
        route: '/ripostes',
        url: '/ripostes',
        label: 'Ripostes',
    },
    TEAMS: {
        id: 'team',
        route: '/equipes',
        url: '/equipes',
        label: 'Équipes',
    },
    TEAMS_EDIT: {
        id: 'team',
        route: '/equipes/:teamId/editer',
        label: 'Équipes',
    },
    NEWS: {
        id: 'news',
        route: '/actualites',
        url: '/actualites',
        label: 'Actualités',
    }
};

export default Paths;
