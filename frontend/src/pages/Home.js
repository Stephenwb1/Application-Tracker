import {useEffect} from 'react'
import {useJobsContext} from '../hooks/useJobsContext'

//components
import JobDetails from '../components/JobDetails'
import JobForm from '../components/JobForm'

const Home = () => {
    const {jobs, dispatch} = useJobsContext()

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('/api/jobs')

            const json = await response.json()

            if (response.ok) {
                console.log('bruh')
                dispatch({type:'SET_JOBS', payload: json})
            }
        }

        fetchJobs()
    }, [dispatch])//dependency array, since its empty, useEffect will only fire once

    return (
        <div className="home">
            <div className="jobs">
                {jobs && jobs.map((job) => (
                    <JobDetails key={job._id} job={job}/>
                ))}
            </div>
            <JobForm />
        </div>
    )
}

export default Home