# Innovage LMS

The project theme has now been set up. Use the following details to set up the project. The file structure is as discussed. If you need to change any structure, feel free to do so.

## Getting Started

Follow these instructions to set up the Innovage LMS project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Ensure you have Node.js installed)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/innovage-lms.git
    cd innovage-lms
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Environment setup:**

    - Copy the example environment file:

      ```bash
      cp .env.example .env
      ```

    - Generate a secret key for `NEXTAUTH_SECRET`:

      ```bash
      openssl rand -base64 32
      ```

    - Update the `.env.local` file with the generated `NEXTAUTH_SECRET` and `NEXTAUTH_URL`:

      Create a `.env.local` file with the following content:

      ```env
      NEXTAUTH_SECRET=your-generated-secret-key
      NEXTAUTH_URL=http://localhost:3000
      ```

### Running the Application

Start the development server:

```bash
npm run dev
