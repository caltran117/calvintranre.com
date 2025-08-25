# Health API Documentation

## Overview
The Health API provides endpoints to monitor the service status and overall API health. These endpoints are typically used for health checks, monitoring, and load balancer configurations.

## Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/self` | Check if Health service is running and responsive | ❌ |
| GET | `/health` | Get overall API health status with system information | ❌ |

## Notes
- All endpoints return JSON responses
- No authentication required for health checks
- Suitable for monitoring and load balancer health checks