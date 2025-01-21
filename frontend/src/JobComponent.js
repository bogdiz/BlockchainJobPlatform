import React, { useState, useContext, useEffect } from 'react';
import { Web3Context } from './web3context';
import './JobComponent.css';
import { useNavigate } from 'react-router-dom'


const JobComponent = () => {
  const navigate = useNavigate()
  const { account, balance, contract } = useContext(Web3Context);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState(0);
  const [jobList, setJobList] = useState([]);

  const fetchJobs = async () => {
    if (contract) {
      try {
        const jobCount = await contract.jobCount();
        const jobs = [];
        for (let i = 0; i < jobCount; i++) {
          const job = await contract.jobs(i);
          jobs.push(job);
        }
        setJobList(jobs);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [contract]);

  const createJob = async () => {
    if (contract) {
      try {
        const tx = await contract.createJob(jobTitle, jobDescription, salary);
        await tx.wait();
        alert('Job created successfully!');
        fetchJobs();
      } catch (err) {
        alert(`Error creating job. ${err}`);
      }
    }
  };

  const deleteJob = async (jobId) => {
    if (contract) {
      try {
        const tx = await contract.deleteJob(jobId);
        await tx.wait();
        alert('Job deactivated successfully!');
        fetchJobs();
      } catch (err) {
        alert(`Error deactivating job. ${err}`);
      }
    }
  };

  return (
    <div className="job-container">
      <div className="create-job">
        <h2>Create Job</h2>
        <p><strong>Account:</strong> {account}</p>
        <p><strong>Balance:</strong> {balance} ETH</p>

        <div className="form-group">
          <input 
            type="text" 
            placeholder="Job Title" 
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
            className="input-field" 
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            placeholder="Job Description" 
            value={jobDescription} 
            onChange={(e) => setJobDescription(e.target.value)} 
            className="input-field" 
          />
        </div>

        <div className="form-group">
          <input 
            type="number" 
            placeholder="Salary in ETH" 
            value={salary} 
            onChange={(e) => setSalary(e.target.value)} 
            className="input-field" 
          />
        </div>

        <button className="button" onClick={createJob}>Create Job</button>
      </div>

      <div className="job-list">
  <h2>Job List</h2>
  <ul className="job-items">
    {jobList.map((job, index) => (
      // Check if job.title exists before rendering the content
      job.title && (
        <li key={index} className="job-item">
          <div className="job-header">
            <div className="flex-row">
              <h3>{job.title}</h3>
              <button
                className="pretty-button"
                onClick={() =>
                  navigate('/job', {
                    state: {
                      title: job.title,
                      description: job.description,
                      salary: job.salary,
                      employer: job.employer,
                      jobId: index,
                    },
                  })
                }
              >
                View Details
              </button>
            </div>
          </div>
          <p>{job.description}</p>
          <p>
            <strong>Salary:</strong> {job.salary} ETH
          </p>
          <p>
            <strong>Employer:</strong> {job.employer}
          </p>
          <div>
            {account === job.employer && (
              <button className="disable-btn" onClick={() => deleteJob(index)}>
                Delete
              </button>
            )}
          </div>
        </li>
      )
    ))}
  </ul>
</div>

    </div>
  );
};

export default JobComponent;