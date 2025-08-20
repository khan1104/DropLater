# DropLater 


### Prerequisites
- Docker
- MongoDB Locally installed
- Node.js and npm installed

###  Run with Docker 

Follow these steps to spin up the full stack with Docker:

1. Clone the repository

```bash
git clone https://github.com/khan1104/DropLater.git
```

2. Navigate to the project directory
```bash
cd DropLater
```

3. Build and start services 
```bash
docker compose up --build
```

4. Once running, the services will be available at:
   - API:        http://localhost:4000
   - Worker:     runs in background
   - sink (webhook) :  http://locahost:4001
   - Redis:      localhost:6379
   - Admin :   http://localhost:1573

### crul example

curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer supersecrettoken123" \
  -d '{
    "title": "Hello",
    "body": "Ship me later",
    "releaseAt": "2025-08-18T15:06:15.232Z",
    "webhookUrl": "http://sink:4001/sink"
  }'

