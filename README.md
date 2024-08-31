Innovage LMS
The project theme has now been set up. Use the following details to set up the project. The file structure is as discussed. If you need to change any structure, feel free to do so.

Getting Started
Follow these instructions to set up the Innovage LMS project on your local machine.

Prerequisites
Node.js (Ensure you have Node.js installed)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/innovage-lms.git
cd innovage-lms
Install dependencies:

bash
Copy code
npm install
Environment setup:

Copy the example environment file:

bash
Copy code
cp .env.example .env
Generate a secret key for NEXTAUTH_SECRET:

bash
Copy code
openssl rand -base64 32
Update the .env.local file with the generated NEXTAUTH_SECRET and NEXTAUTH_URL:

Create a .env.local file with the following content:

env
Copy code
NEXTAUTH_SECRET=your-generated-secret-key
NEXTAUTH_URL=http://localhost:3000
Running the Application
Start the development server:

bash
Copy code
npm run dev
The application will be running at http://localhost:3000.

File Structure
The file structure has been set up as discussed. If you need to change any structure, feel free to do so.

