

async function main() {
    const [deployer1, deployer2, deployer3] = await ethers.getSigners();

    console.log("Deploying with:");
    console.log("Deployer 1 Address:", await deployer1.getAddress());
    console.log("Deployer 2 Address:", await deployer2.getAddress());
    console.log("Deployer 3 Address:", await deployer3.getAddress());
  
    // Compile contract
    const JobPayment = await ethers.getContractFactory("JobPayment");
    // Deploy contract
    const jobPayment = await JobPayment.deploy(); 
    await jobPayment.waitForDeployment();
    const jobPaymentAddress = await jobPayment.getAddress();
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
  