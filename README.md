
# Order Manager Stress Test Guide

Welcome to the Order Manager Stress Test project! This guide is designed to help you set up and conduct a stress test on the "Order Manager" feature. Our objective is to evaluate its performance and reliability under extreme load conditions to ensure optimal operation during peak demands.

## Project Overview

The "Order Manager" feature plays a critical role in processing orders efficiently. This stress test aims to simulate high-load scenarios to uncover potential bottlenecks and enhance the system's capacity to manage heavy traffic, ensuring stability and performance are maintained at all times.

## Setup and Configuration Steps

Before diving into the stress test, there are a few essential setup steps to follow. These ensure that your testing environment is correctly configured for a smooth and effective testing process.

### Pre-requisites Installation

1. **Install Node.js Packages**: Start by installing the necessary Node.js packages. Open your terminal, navigate to the project's root directory, and run:
   ```bash
   npm install
   ```
   This command installs all the dependencies defined in the `package.json` file, setting up your environment for the test.

### Environment Setup

After installing the required packages, the next step is to configure the environment variables used during the test.

1. **Duplicate the `.env.example` file** located in the project root directory.
2. **Rename the duplicate file** to `.env`.
3. **Edit the `.env` file** with your preferred text editor.
4. **Update the file** with the actual values for the following variables:
   - `url`: The endpoint URL of the platform (e.g., `https://homolog-jet.routeasy.com.br`).
   - `token`: The authentication token required for authorizing requests to the server.
   - `site`: The branch for which orders will be created during the stress test.
   - `webhook`: (Optional) The success callback URL for created orders. While not mandatory, it can be used for receiving success notifications.

Ensure that you save the `.env` file after inputting the necessary information.

## Executing the Stress Test

With the environment now set up, you are ready to initiate the stress test on the "Order Manager" feature. This test will help us understand how the feature behaves under different levels of demand and identify any adjustments needed to optimize performance.

1. **Launch the Stress Test**: To start the stress test, simply execute the following command in your terminal:
   ```bash
   npm test
   ```
   This command runs the predefined test scripts that simulate various load conditions on the "Order Manager" feature. Keep an eye on the test output for performance metrics and error rates.


2. **Monitor and Analyze Results**: As the test runs, monitor the system's performance closely. The console will display important metrics in different stages:

   - **Etapa de criação dos order managers**
     - `Total time Queue: {time in ms}`
     - `Average time Queue: {time in ms}`

   - **Etapa de processamento de order manager**
     - `Processing Order Managers...`
     - `Order Managers Processed: {processing/total}`

   - **Etapa de resultado do processamento**
     - `Total time Processing: {time in ms}`
     - `Average time Processing: {time in ms}`

   After the test concludes, analyze the collected data to pinpoint any performance issues or bottlenecks that require attention.

## Conclusion and Further Steps

Upon completing the stress test, review the results to determine the necessary optimizations or improvements to enhance the "Order Manager" feature's resilience and efficiency under high load.

For additional assistance or questions about the testing process, please refer to the project documentation or contact the support team.

We appreciate your efforts in helping to ensure that our "Order Manager" feature can reliably handle the demands of real-world scenarios. Happy testing!
