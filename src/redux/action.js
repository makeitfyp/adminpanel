export const user_name = 'user_name';
export const user_password = 'user_password';
export const user_email = 'user_email';

export const setUserUSerName = username =>dispatch =>{
    dispatch({
        type:user_name,
        payload:username
    })
}
export const setUserPassword = pass =>dispatch =>{
    dispatch({
        type:user_password,
        payload:pass
    })
}
export const setUserEmail = email=>dispatch =>{
    dispatch({
        type:user_email,
        payload:email
    })
}