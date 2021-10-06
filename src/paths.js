const Paths = {
    AUTH: {
        route: '/auth',
        url: () => '/auth',
    },
    DASHBOARD: {
        id: 'dashboard',
        route: '/',
        url: () => '/',
        label: 'Vue d’ensemble',
        icon: 'fas fa-th-large',
    },
    ADHERENTS: {
        id: 'contacts',
        route: '/adherents',
        url: () => '/adherents',
        label: 'Adhérents',
        icon: 'fas fa-users',
    },
    MESSAGERIE: {
        id: 'messages',
        route: '/messagerie',
        url: () => '/messagerie',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_CREATE: {
        id: 'messages',
        route: '/messagerie/creer',
        url: () => '/messagerie/creer',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_EDIT: {
        id: 'messages',
        route: '/messagerie/:messageUuid/modifier',
        url: (messageUuid) => `/messagerie/${messageUuid}/modifier`,
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_FILTER: {
        id: 'messages',
        route: '/messagerie/:messageUuid/filtrer',
        url: (messageUuid) => `/messagerie/${messageUuid}/filtrer`,
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_CONFIRMATION: {
        id: 'messages',
        route: '/messagerie/confirmation',
        url: () => '/messagerie/confirmation',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    ELECTIONS: {
        id: 'elections',
        route: '/elections',
        url: () => '/elections',
        label: 'Elections',
        icon: 'fas fa-map',
    },
    RIPOSTES: {
        id: 'ripostes',
        route: '/ripostes',
        url: () => '/ripostes',
        label: 'Ripostes',
        icon: 'fas fa-hashtag',
    },
    TEAMS: {
        id: 'team',
        route: '/equipes',
        url: () => '/equipes',
        label: 'Équipes',
        icon: 'fas fa-star',
    },
};

export default Paths;
