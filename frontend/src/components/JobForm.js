import {useState} from 'react'
import {useJobsContext} from '../hooks/useJobsContext'
import { useAuthContext } from '../hooks/useAuthContext'
const JobForm = () => {
    const {dispatch} = useJobsContext()
    const {user} = useAuthContext()
    
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {

        //prevent default method of refreshing the page
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const job = {company, title, link}
        console.log("Job data being sent:", job)

        const response = await fetch('https://backend-o118.onrender.com/api/jobs', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        console.log("Raw response:", response);

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setCompany('')
            setTitle('')
            setLink('')
            setError(null)
            setEmptyFields([])
            dispatch({type: 'CREATE_JOB', payload: json})
            console.log('new job added', json)



            const response = await fetch('https://backend-o118.onrender.com/api/jobs/', {
                //method: 'POST',
                //body: JSON.stringify(job),
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json1 = await response.json()
            //sort titles by popular
            const titleCounts = {}
            console.log("STUFF:", json1)
            json1.forEach((job) => {
                titleCounts[job.title] = (titleCounts[job.title] || 0) + 1
            })

            const sortedTitles = Object.entries(titleCounts)
                .map(([title, count]) => ({title, count}))
                .sort((a, b) => b.count - a.count)

            dispatch({type: 'SET_POPULAR_TITLES', payload: sortedTitles})
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Job</h3>
            
            <label></label>
            <input
                type='text'
                placeholder='Company'
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                className={emptyFields.includes('company') ? 'error' : ''}
            />
            <label></label>
            <input
                type='text'
                placeholder="Title (optional)"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label></label>
            <input
                type='text'
                placeholder="Link (optional)"
                onChange={(e) => setLink(e.target.value)}
                value={link}
                className={emptyFields.includes('link') ? 'error' : ''}
            />

            <button>Add Job</button>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default JobForm