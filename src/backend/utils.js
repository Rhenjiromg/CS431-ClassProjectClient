const checkPassword = (password) => {
    if(password === ''){
        return false;
    }else if(password.length < 8){
        return false;
    }
    return true;
}

export {checkPassword}