# 📡 API Reference

## Base URL
`http://localhost:3000/api`

## Authentication

### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/register
Register new user
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "age": 30,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "goal": "Maintain"
}
```

## Chat

### POST /api/chat
Send chat message
```json
{
  "email": "user@example.com",
  "message": "What should I eat?"
}
```

### GET /api/chat/history/:email
Get chat history

## Diet

### POST /api/diet
Generate diet plan
```json
{
  "email": "user@example.com"
}
```

### GET /api/diet/history/:email
Get diet history

## Emergency Card

### GET /api/emergency/:email
Get emergency card

### POST /api/emergency
Create/update emergency card
```json
{
  "email": "user@example.com",
  "personalInfo": { ... },
  "emergencyContacts": [ ... ],
  "medicalInfo": { ... }
}
```

## OCR

### POST /api/ocr/upload
Upload file for OCR (multipart/form-data)
- file: Image file
- email: User email

### GET /api/ocr/status/:scanId
Get OCR processing status

### GET /api/ocr/history/:email
Get OCR scan history

## Insights

### GET /api/insights/:email
Get AI insights

### POST /api/insights/generate/:email
Generate new insights

## Family

### GET /api/family/:email
Get all family members

### POST /api/family
Add family member
```json
{
  "email": "user@example.com",
  "name": "Jane Doe",
  "relationship": "Spouse",
  "age": 28,
  ...
}
```

### PUT /api/family/:id
Update family member

### DELETE /api/family/:id
Delete family member

## Health Logs

### GET /api/health/:email
Get health logs

### POST /api/health
Add health log
```json
{
  "email": "user@example.com",
  "type": "weight",
  "value": 70,
  "notes": "Morning weight"
}
```

