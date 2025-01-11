async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying with:", await deployer.getAddress());
  
    // Compile contract
    const JobPayment = await ethers.getContractFactory("JobPayment");
    // Deploy contract
    const jobPayment = await JobPayment.deploy(); 
    await jobPayment.waitForDeployment();           // înlocuiește deployed() cu waitForDeployment()
    const jobPaymentAddress = await jobPayment.getAddress(); // adresa contractului
    console.log("JobPayment deployed at:", jobPaymentAddress);
  
    const JobPlatform = await ethers.getContractFactory("JobPlatform");
    const jobPlatform = await JobPlatform.deploy(jobPaymentAddress);
    await jobPlatform.waitForDeployment();
    console.log("JobPlatform deployed at:", await jobPlatform.getAddress());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  