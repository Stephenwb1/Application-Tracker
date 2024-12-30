import {useEffect} from 'react'
import {useJobsContext} from '../hooks/useJobsContext'

//components
import JobDetails from '../components/JobDetails'
import JobForm from '../components/JobForm'
import JobCategoryChart from '../components/JobCategoryChart'


const Home = () => {
    const {jobs, popularTitles, dispatch} = useJobsContext()

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('/api/jobs')
            const json = await response.json()

            if (response.ok) {
                dispatch({type:'SET_JOBS', payload: json})

                //sort titles by popular
                const titleCounts = {}

                json.forEach((job) => {
                    titleCounts[job.title] = (titleCounts[job.title] || 0) + 1
                })

                const sortedTitles = Object.entries(titleCounts)
                    .map(([title, count]) => ({title, count}))
                    .sort((a, b) => b.count - a.count)

                dispatch({type: 'SET_POPULAR_TITLES', payload: sortedTitles})
            }
        }

        fetchJobs()
    }, [dispatch])//dependency array, since its empty, useEffect will only fire once

    return (
        <div className="home" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%'}}>
            <div style={{gridRow: '1 / 2', gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>            
                <JobForm />
            </div>
            <div className="jobs" style={{gridRow: '2 / 2', gridColumn: '1 / 2'}}>
                    <h3>Jobs you've applied to</h3>
                    {jobs && jobs.map((job) => (
                        <JobDetails key={job._id} job={job}/>
                    ))}
            </div>
            <div style={{gridRow: '1 / 2', gridColumn: '2 / 2', width: '600px', height: '300px', paddingTop: '50px'}}>
                <JobCategoryChart 
                    data={(popularTitles || []).map(item => ({
                        name: item.title,
                        value: item.count
                    }))}
                />
            </div>            
        </div>
    )
}

export default Home