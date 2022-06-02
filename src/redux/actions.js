export const currentAdmin = 'currentAdmin'


export const setCurrentAdmin = admin =>dispatch =>{
    dispatch({
        type:currentAdmin,
        payload:admin
    })
}

