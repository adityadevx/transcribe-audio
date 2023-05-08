import LoginContext from './LoginContext';


const LoginState = ({ children }) => {

    const validateLogin = async () => {

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/validateUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: document.cookie.split('=')[1] })
        })
        await res.json()
        if (res.status === 200) return true;
        else return false;
    };


    return (
        <LoginContext.Provider value={{ validateLogin }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginState;