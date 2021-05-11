import moment from 'moment';

function DateFormat({ date }) {
    moment.locale('fr', {
        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    });
    return moment(date).format('D MMMM YYYY');
}

export default DateFormat;
