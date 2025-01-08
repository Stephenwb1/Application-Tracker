import { useEffect, useState } from 'react';
import { useJobsContext } from '../hooks/useJobsContext';
import { useAuthContext} from '../hooks/useAuthContext'
// components
import JobDetails from '../components/JobDetails';
import JobForm from '../components/JobForm';
import SearchBar from '../components/SearchBar';
import JobCategoryChart from '../components/JobCategoryChart'

const Home = () => {
  const {jobs, popularTitles, dispatch} = useJobsContext()
  const {user} = useAuthContext()

  const [filteredJobs, setFilteredJobs] = useState([]);  // Initialize with empty array
  const [query, setQuery] = useState(''); //for search


  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch('https://backend-o118.onrender.com/api/jobs', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_JOBS', payload: json });

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
    

    if (user) {
      fetchJobs();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (Array.isArray(jobs) && jobs.length > 0) {
      const filtered = jobs.filter((job) =>
        // Ensure each property exists before calling toLowerCase
        (job.title && job.title.toLowerCase().includes(query.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(query.toLowerCase())) ||
        (job.company && job.company.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredJobs(filtered);
    }
  }, [jobs, query]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);  // Update query whenever search query changes
  };

  return (
    <div className="home" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
      {/* Left column: JobForm, SearchBar, and Jobs List */}
      <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Job Form */}
        <JobForm />
        
        {/* Search Bar under Job Form */}
        <SearchBar query={query} onSearch={handleSearch} />
        
        {/* Jobs List */}
        <div className="jobs">
          <h3>Jobs you've applied to</h3>
          {filteredJobs.length > 0 ? (
            jobs.map((job) => <JobDetails key={job._id} job={job} />)
          ) : (
            <p>No jobs found for your search.</p>
          )}
        </div>
      </div>

      {/* Right column: Job Category Chart */}
      <div style={{ gridColumn: '2 / 2', width: '600px', height: '300px', paddingTop: '50px' }}>
        <JobCategoryChart 
          data={(popularTitles || []).map(item => ({
            name: item.title,
            value: item.count
          }))}
        />
      </div>
    </div>
  );
};

export default Home;
