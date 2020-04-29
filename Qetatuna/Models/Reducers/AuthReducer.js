const initialState = {
    User: null
}

export default (state = initialState, action) => {
    switch (action.type) {

        case 'SAVE_USER':
            return {
                ...state,
                Processing: false,
                User: {
                    _id: action.payload._id,
                    email: action.payload.email,
                    fullname: action.payload.fullname,
                    mobile: action.payload.mobile,
                    password: action.payload.password,
                    countryCode: action.payload.countryCode,
                    callingCode: action.payload.callingCode,
                    countryID: action.payload.countryID,
                    imgPath: action.payload.imgPath,
                    isMember: action.payload.isMember,
                    membershipStatus: action.payload.membershipStatus
                },
            }

        case 'LOGOUT':
            return { ...state, User: null, }

        default:
            return state
    }
};