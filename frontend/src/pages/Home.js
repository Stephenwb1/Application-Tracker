import { useEffect, useState } from 'react';
import { useJobsContext } from '../hooks/useJobsContext';

// components
import JobDetails from '../components/JobDetails';
import JobForm from '../components/JobForm';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const { jobs, dispatch } = useJobsContext();
  const [filteredJobs, setFilteredJobs] = useState([]);  // Initialize with empty array
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch('/api/jobs');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_JOBS', payload: json });
      }
    };

    fetchJobs();
  }, [dispatch]);

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
      <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <JobForm />
        
        {/* Keep the SearchBar only under Add job */}
        <SearchBar query={query} onSearch={handleSearch} />  {/* Search bar below "Add Job" */}

        <div className="jobs">
          <h3>Jobs you've applied to</h3>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobDetails key={job._id} job={job} />)
          ) : (
            <p>No jobs found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
