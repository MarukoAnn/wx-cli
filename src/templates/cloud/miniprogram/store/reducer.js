
const reducer = (state, action) => {
    // let state = 
    switch (action.type) {
        case 'ADD': state.name = action.value; break;
        default:
            break;
    }
    return state;
}


module.exports = reducer