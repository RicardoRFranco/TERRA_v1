# TERRA App

A modern web application with Python FastAPI backend, React frontend, and PostgreSQL database, all orchestrated with Kubernetes.

## Technologies

- **Frontend**: React, Redux, Axios
- **Backend**: Python FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Deployment**: Docker, Kubernetes

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Kubernetes local cluster (Minikube or K3d)
- Node.js (v16+)
- Python (v3.9+)

### Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/RicardoRFranco/terra-app.git
   cd terra-app
   .\scripts\setup-dev.ps1
   npm run setup