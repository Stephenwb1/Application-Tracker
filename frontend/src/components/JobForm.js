import {useState} from 'react'
import {useJobsContext} from '../hooks/useJobsContext'

const JobForm = () => {
    const {dispatch} = useJobsContext()
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {

        //prevent default method of refreshing the page
        e.preventDefault()

        const job = {company, title, link}
        console.log("Job data being sent:", job)

        const response = await fetch('/api/jobs', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json'
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
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Job</h3>
            
            <label>Company:</label>
            <input
                type='text'
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                className={emptyFields.includes('company') ? 'error' : ''}
            />
            <label>Title:</label>
            <input
                type='text'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>Link:</label>
            <input
                type='text'
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