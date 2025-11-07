<div align="center">

<img src="frontend\public\logo2.png" alt="AuditVault Logo" width="120"/>

<img src="frontend\public\name.png" alt="AuditVault Title" width="400"/>

# **AuditVault**
### Decentralised Compliance & Audit Trail Platform for Construction and Industrial Maintenance 

</div>


## Project Overview

In industries such as construction, facilities management, and industrial maintenance, compliance records—including safety inspections, certifications, and maintenance logs—are often stored in fragmented databases or manual spreadsheets. This creates opportunities for data tampering, missing documentation, and limited transparency during audits.

This project addresses these critical needs by providing a blockchain-based platform that offers a tamper-proof, time-stamped ledger of inspections, certifications, and safety checks. Smart contracts automate compliance reminders, revoke expired certifications, and allow verified inspectors to digitally sign off on-site activities. Our decentralised compliance and audit trail system ensures data integrity, accountability, and transparency across multiple contractors, suppliers, and regulatory bodies.

## Features

- **Immutable Compliance Records**: Utilizes blockchain to create a tamper-proof, time-stamped ledger for all compliance-related documentation.
- **Automated Compliance via Smart Contracts**: Smart contracts automate reminders for compliance tasks, manage certification lifecycles, and enable digital sign-offs.
- **AI-Powered Document Analysis**: Integrates AI models for forgery and AI-generated content detection within uploaded documents, enhancing the integrity of digital records.
- **Decentralised Audit Trails**: Ensures transparency and accountability across all stakeholders, from contractors to regulatory bodies.
- **Role-Based Access & Dashboards**: Provides tailored dashboards for Auditors, Managers, and Regulators to monitor, verify, and manage compliance data securely.
- **Secure Document Uploads**: Facilitates the secure upload of PDF documents for analysis and blockchain recording.
- **Detailed Analysis Reporting**: Offers comprehensive reports on document authenticity, including `final_label` (Real, Forged, AI-Generated), confidence scores, and potential risks.

## Technologies Used

### Frontend

- **Next.js**: React framework for building user interfaces.
- **TypeScript**: Statically typed superset of JavaScript for enhanced code quality.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Framer Motion**: Animation library for smooth and interactive UI elements.
- **Lucide React**: A collection of beautiful and customizable open-source icons.
- **Radix UI**: Unstyled, accessible components for building high-quality design systems.

### Backend

- **FastAPI**: Modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Uvicorn**: ASGI server to run the FastAPI application.
- **Python-Multipart**: For handling `multipart/form-data` (file uploads).

### Blockchain

- **Solidity**: Programming language for writing smart contracts on Ethereum-compatible blockchains.
- **Hardhat**: Development environment for compiling, deploying, testing, and debugging smart contracts.
- **Decentralised Ledger**: Provides a tamper-proof and transparent record of all compliance activities.

## Project Structure

```
.editorconfig
.gitignore
.prettierignore
.prettierrc
package.json
pnpm-lock.yaml
tsconfig.json
README.md

backend/
  main.py
  requirements.txt

frontend/
  app/
    auditor-dashboard/
    auth/
    inspect/
    manager-dashboard/
    regulator-dashboard/
    layout.tsx
    page.tsx
  components/
    ai-analysis-result.tsx
    auditor-dashboard.tsx
    # ... other components
  lib/
    analysis.ts
    auth.ts
    # ... other utility files
  public/
    # ... static assets like logos, placeholder images
  styles/
    globals.css
  # ... other frontend configuration files

TestHackathon/ (Blockchain related files)
  compliance-platform/
    contracts/
    scripts/
    test/
    # ... other blockchain related files
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher) & npm (or pnpm as used in this project)
- Python (v3.8 or higher) & pip

### 1. Backend Setup

Navigate to the `backend` directory, install dependencies, and start the server:

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
source venv/bin/activate # On Linux/macOS
pip install -r requirements.txt
python main.py
```

The backend server will run on `http://127.0.0.1:8000`.

**Note**: The backend uses a `placeholder.jpg` for mock image data. For a better visual experience, place a `placeholder.jpg` image in the `backend/` directory.

### 2. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
pnpm install # Or npm install if you prefer npm
pnpm dev     # Or npm run dev
```

If you navigate to `http://localhost:3000` in your browser, you should see the frontend application.

### 3. Usage

- Go to the `/inspect` page on the frontend (e.g., `http://localhost:3000/inspect`).
- Upload a PDF file.
- The frontend will send the file to the running backend service for analysis.
- The analysis results, including mock image thumbnails, labels, and confidence scores, will be displayed.
- Clicking on a detailed analysis card will open a modal with more information.
