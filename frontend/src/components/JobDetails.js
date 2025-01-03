import {useJobsContext} from '../hooks/useJobsContext'

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const JobDetails = ({job}) => {
    const {dispatch} = useJobsContext()

    const handleClick = async () => {
        const response = await fetch('/api/jobs/' + job._id, {
            method: 'DELETE'
        })
        console.log("bruh")
        const  json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_JOB', payload: json})
        }
    
        //sort titles by popular
        const response1 = await fetch('/api/jobs/')
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

            {isLink && <h4 style={{display: 'inline'}}>
                <a 
                href={formatLink(job.link)} target="_blank" rel="noopener noreferrer">{job.company}
                </a>
                </h4>}
            {!isLink && <h4 style={{display: 'inline'}}>{job.company}</h4>}
            
            <p>{job.title}</p>
            <p style={{float: 'right', paddingRight: '55px'}}>{formatDistanceToNow(new Date(job.createdAt), {addSuffix: true})}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    );
}

export default JobDetails;