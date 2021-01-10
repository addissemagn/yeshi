const recipe = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_RECIPE':
    case 'DELETE_RECIPE':
    case 'EDIT_RECIPE':
      return {
        ...state
      }
    default:
      return state
  }
}

export default recipe;