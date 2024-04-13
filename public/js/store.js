let state={
    localestrim:null,
    remoteStrim:null
}

export const setlocalstrim=(localestrim)=>{
    state={
        ...state,
        localestrim
    }
}
export const getlocalstrim=()=>{
    return state.localestrim;
}

export const setremotestrim=(remoteStrim)=>{
    state={
        ...state,
        remoteStrim
    }
}