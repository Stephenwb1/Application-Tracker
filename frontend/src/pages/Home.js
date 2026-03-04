import { useEffect, useState } from 'react';
import { useJobsContext } from '../hooks/useJobsContext';
import { useAuthContext} from '../hooks/useAuthContext'
import API_URL from '../api'
// components
import JobDetails from '../components/JobDetails';
import JobForm from '../components/JobForm';
import SearchBar from '../components/SearchBar';
import JobCategoryChart from '../components/JobCategoryChart'

const Home = () => {
  const {jobs, popularTitles, dispatch} = useJobsContext()
  const [filteredJobs, setFilteredJobs] = useState([]);  // Initialize with empty array
  const [query, setQuery] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(null);
  const {user} = useAuthContext()

  const handleTitleSelect = (title) => {
    setSelectedTitle(prev => prev === title ? null : title);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(`${API_URL}/api/jobs`, {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>Jobs you've applied to</h3>
            {selectedTitle && (
              <span className="filter-badge" onClick={() => setSelectedTitle(null)}>
                {selectedTitle} &times;
              </span>
            )}
          </div>
          {(() => {
            const displayedJobs = selectedTitle
              ? filteredJobs.filter(job => job.title === selectedTitle)
              : filteredJobs;
            return displayedJobs.length > 0 ? (
              displayedJobs.map((job) => <JobDetails key={job._id} job={job} />)
            ) : (
              <p>No jobs found.</p>
            );
          })()}
        </div>
      </div>

      {/* Right column: Job Category Chart */}
      <div style={{ gridColumn: '2 / 2', width: '100%', height: '500px', paddingTop: '20px' }}>
        <JobCategoryChart
          data={(popularTitles || []).map(item => ({
            name: item.title,
            value: item.count
          }))}
          selectedTitle={selectedTitle}
          onTitleSelect={handleTitleSelect}
        />
      </div>
    </div>
  );
};

export default Home;
