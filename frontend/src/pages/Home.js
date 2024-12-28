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
        <div className="home" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%'}}>
            <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>            
                <JobForm />
                <div className="jobs">
                    <h3>Jobs you've applied to</h3>
                    {jobs && jobs.map((job) => (
                        <JobDetails key={job._id} job={job}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home