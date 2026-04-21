import {useJobsContext} from '../hooks/useJobsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import API_URL from '../api'

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const JobDetails = ({job}) => {
    const {dispatch} = useJobsContext()
    const {user} = useAuthContext()
    const handleClick = async () => {
        if(!user) {
            return
        }

        const response = await fetch(`${API_URL}/api/jobs/` + job._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        console.log("bruh")
        const  json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_JOB', payload: json})
        }

        //sort titles by popular
        const response1 = await fetch(`${API_URL}/api/jobs/`,
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
        const json1 = await response1.json()
        const titleCounts = {}

        json1.forEach((job) => {
            titleCounts[job.title] = (titleCounts[job.title] || 0) + 1
        })

        const sortedTitles = Object.entries(titleCounts)
            .map(([title, count]) => ({title, count}))
            .sort((a, b) => b.count - a.count)

        dispatch({type: 'SET_POPULAR_TITLES', payload: sortedTitles})
        
    }

    const formatLink = () => {
        if (!job.link.startsWith('http://') && !job.link.startsWith('https://')) {
            return `https://${job.link}`
        }
        return job.link
    }

    const isLink = job.link && job.link.trim() !== ""
    
    
    return (
        <div className="job-details">
            {isLink
                ? <h4><a href={formatLink()} target="_blank" rel="noopener noreferrer">{job.company}</a></h4>
                : <h4>{job.company}</h4>}
            <div className="job-meta">
                <p>{job.title}</p>
                <p>{formatDistanceToNow(new Date(job.createdAt), {addSuffix: true})}</p>
            </div>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    );
}

export default JobDetails;