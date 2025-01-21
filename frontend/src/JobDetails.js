import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "./JobDetails.css";
import { Web3Context } from './web3context';
import { parseEther } from "ethers";


const JobDetails = () => {
  const { account, balance, contract, jobPaymentContract } = useContext(Web3Context);
  const [employees, setJobEmployees] = useState([]);
  const location = useLocation();
  const { title, description, salary, employer, jobId } = location.state || {};

  const joinJob = async (jobId) => {
    if (contract) {
      try {
        const tx = await contract.takeJob(jobId);
        await tx.wait();
        alert('You successfully joined the job!');
        getJobEmployees(jobId);
      } catch (err) {
        alert(`Error joining job: ${err.message}`);
      }
    }
  };

  const getJobEmployees = async (jobId) => {
    if (contract) {
      try {
        const employees = await contract.getAllEmployees(jobId);
        console.log('employees');
        console.log(employees);
        setJobEmployees(employees);
      } catch (err) {
        alert(`Error fetching employees: ${err.message}`);
      }
    }
  };

  const handlePay = async (address, amount) => {
    if (contract) {
      try {
        const amountInWei = parseEther(amount.toString());
        const tx = await jobPaymentContract.processPayment(address, amountInWei, {
          value: amountInWei,
        });
        await tx.wait();
      } catch(err) {
        alert(`Payment error ${err.message}`);
      }
    }
  };

  useEffect(() => {
    if (jobId != null) {
      getJobEmployees(jobId);
    }
  }, [jobId, contract]);

  return (
    <div className="job-details-container">
      <h1 className="job-details-heading">Job Details</h1>

      {
            employer !== account && (
            !employees.includes(account) && 
            (<button className="join-button" onClick={() => joinJob(jobId)}>
                Join
            </button>)
            )
      }
      <div className="job-details-content">
        <p><strong>Title:</strong> {title || "N/A"}</p>
        <p><strong>Description:</strong> {description || "N/A"}</p>
        <p><strong>Salary:</strong> {salary ? `${salary} ETH` : "N/A"}</p>
        <p><strong>Employer:</strong> {employer || "N/A"}</p>
      </div>

      <div className="job-employees">
        <h2 className="employees-heading">Employees</h2>
        {employees.length > 0 ? (
          <ul className="employees-list">
            {employees.map((employee, index) => (
              <li key={index} className="employee-item">
                {employee}
                {
                  employer === account &&
                (<button
                className="pay-button"
                onClick={() => handlePay(employee, salary)}
                >Pay</button>)
                }
              </li>
            ))}
          </ul>
        ) : (
          <p>No employees have taken this job yet.</p>
        )}
      </div>
      <div className="job-details-footer">
        <button className="back-button" onClick={() => window.history.back()}>
        Go Back
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
