const initialState = {
    Language: null, // AR - EN
}

export default (state = initialState, action) => {
    switch (action.type) {

        case 'SET_LANGUAGE':
            return {
                ...state,
                Language: action.payload.Language,
            };

        default:
            return state
    }
};