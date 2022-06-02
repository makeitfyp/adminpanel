import {user_name,user_email,user_password} from './action'

const  initialState = {
    username:'',
    email:'',
    password:''
}
function Reducer(state = initialState, action) {
    switch (action.type) {
        case user_name:{
            return { ...state, username: action.payload }
        }
        case user_password:{
            return { ...state, password: action.payload }
        }
        case user_email:{
            return { ...state, email: action.payload }
        }
        default:{
            return state
        }
    }

}
export default Reducer;