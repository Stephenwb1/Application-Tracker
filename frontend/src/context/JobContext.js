import {createContext, useReducer} from 'react'

export const JobsContext = createContext()

export const jobsReducer = (state, action) => {//this updates the list of jobs without contacting the server. > inserts new html
    switch(action.type) {
        case 'SET_JOBS':
            console.log("set_jobs ran")
            return {
                jobs: action.payload
            }
        case 'CREATE_JOB':
            return {
                jobs: [action.payload, ...state.jobs]
            }
        case 'DELETE_JOB':
            return {
                jobs: state.jobs.filter((w) => w._id !== action.payload._id)
            }
        case 'SET_POPULAR_TITLES':
            return {
                ...state, 
                popularTitles: action.payload
            }
        case 'SET_POPULAR_TITLES':
            return {
                ...state, 
                popularTitles: action.payload
            }
        default:
            return state

    }
}

export const JobsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(jobsReducer, {
        jobs: [],
        popularTitles: []
    })

    return (
        <JobsContext.Provider value={{...state, dispatch}}>
            {children}
        </JobsContext.Provider>
    )
}