export const initialState = {
    user:null,
    toggle:false,
};

export const actionTypes = {
    SET_USER : "SET_USER",
    SET_TOGGLE:"SET_TOGGLE",
};

const reducer = (state, action) => {
    switch(action.type){
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };

        case actionTypes.SET_TOGGLE:
            return {
                ...state,
                toggle: action.toggle,
            };

        default:
            return state;
    }
};

export default reducer;