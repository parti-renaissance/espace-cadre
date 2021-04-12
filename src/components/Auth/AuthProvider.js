import useAuth from '../../redux/auth/hooks';
import {useEffect} from "react";

const AuthProvider = ({children}) => {
    const {callback} = useAuth();

    useEffect(() => {
        const user = callback();
        console.log(user);
    }, [callback])

    console.log('here');

    return <>{children}</>
}

export default AuthProvider;
