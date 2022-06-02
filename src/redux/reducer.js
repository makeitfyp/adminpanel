import { currentAdmin } from "./actions";

const initialState = {
    admin: {
        email: null,
        password: null,
        auth: false
    }
}

function Reducer(state = initialState, action) {

    switch (action.type) {
        case currentAdmin:
            return { ...initialState, admin: action.payload }
        default:
            return state
    }
}

export default Reducer;