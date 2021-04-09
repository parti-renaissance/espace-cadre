import useAuth from '../../redux/auth/hooks';

const AuthProvider = ({children}) => {
    const user = useAuth();

    console.log(user);

    return <>{children}</>
}

export default AuthProvider;
