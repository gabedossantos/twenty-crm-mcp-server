# Docker Deployment Guide

This guide covers deploying the Twenty CRM MCP Server as a Docker container for reliable, persistent operation.

---

## Quick Start

### 1. Prerequisites

- Docker and Docker Compose installed
- Twenty CRM API key
- (Optional) Cloudflare tunnel for external access

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
cd /Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server

cat > .env << 'EOF'
# Twenty CRM Configuration
TWENTY_API_KEY=your-twenty-api-key-here
TWENTY_BASE_URL=http://host.docker.internal:3000

# Optional: Override MCP defaults
# MCP_HTTP_PORT=8088
EOF
```

### 3. Build and Start

```bash
# Build and start in detached mode
docker compose up -d --build

# View logs
docker compose logs -f twenty-crm-mcp

# Check health
curl http://localhost:8088/healthz
```

### 4. Verify Connectivity

```bash
# Test SSE endpoint
curl -Nv --max-time 3 "http://localhost:8088/sse" 2>&1 | head -15

# Expected output:
# HTTP/1.1 200 OK
# Content-Type: text/event-stream
# event: endpoint
# data: /sse?sessionId=...
```

---

## Dify Integration

### From Local Docker Host

If Dify runs on the same Docker host:

1. **Verify container-to-host connectivity**:
   ```bash
   docker exec -it dify-api-1 sh -c 'curl -Nv --max-time 3 http://host.docker.internal:8088/sse 2>&1 | head -10'
   ```

2. **Configure in Dify UI**:
   - Navigate: **Tools → MCP → Add MCP Server (HTTP)**
   - **Server URL**: `http://host.docker.internal:8088/sse`
   - **Identifier**: `twenty_crm`
   - **Use Dynamic Client Registration**: OFF

### Using Docker Network

For direct container-to-container communication:

```yaml
# docker-compose.yml
services:
  twenty-crm-mcp:
    # ... existing config ...
    networks:
      - dify-network

networks:
  dify-network:
    external: true
    name: dify_default  # Or your Dify network name
```

Then in Dify, use: `http://twenty-crm-mcp:8088/sse`

---

## Cloudflare Tunnel Integration

### Option A: Add to Existing Tunnel Config

If you already have a Cloudflare tunnel running, add a new public hostname:

1. **In Cloudflare Zero Trust Dashboard**:
   - Go to: **Networks → Tunnels → Your Tunnel → Public Hostname**
   - Add hostname:
     - **Subdomain**: `twenty-mcp` (or your choice)
     - **Domain**: Your domain
     - **Service**: `http://host.docker.internal:8088`

2. **Update Dify configuration**:
   - Server URL: `https://twenty-mcp.yourdomain.com/sse`

### Option B: Connect to Tunnel Network

If your Cloudflare tunnel runs in Docker:

```yaml
# docker-compose.yml
services:
  twenty-crm-mcp:
    # ... existing config ...
    networks:
      - cloudflare-tunnel

networks:
  cloudflare-tunnel:
    external: true
    name: cloudflare_default  # Your tunnel's network name
```

Then configure the tunnel to route to `http://twenty-crm-mcp:8088`.

### Option C: Dedicated Tunnel Sidecar

Add cloudflared as a sidecar container:

```yaml
# docker-compose.yml
services:
  twenty-crm-mcp:
    # ... existing config ...
    networks:
      - mcp-internal

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: twenty-mcp-tunnel
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    networks:
      - mcp-internal
    depends_on:
      - twenty-crm-mcp

networks:
  mcp-internal:
    driver: bridge
```

Configure the tunnel in Cloudflare dashboard to route to `http://twenty-crm-mcp:8088`.

---

## Management Commands

### Container Lifecycle

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# Rebuild after code changes
docker compose up -d --build

# View real-time logs
docker compose logs -f twenty-crm-mcp

# Check status
docker compose ps
```

### Health Monitoring

```bash
# Container health status
docker inspect twenty-crm-mcp --format='{{.State.Health.Status}}'

# Health check endpoint
curl -s http://localhost:8088/healthz

# SSE endpoint test
curl -Nv --max-time 3 http://localhost:8088/sse 2>&1 | grep -E "HTTP|event:"
```

### Troubleshooting

```bash
# View container logs
docker compose logs --tail=100 twenty-crm-mcp

# Enter container shell
docker exec -it twenty-crm-mcp sh

# Check environment variables
docker exec twenty-crm-mcp env | grep -E "MCP_|TWENTY_"

# Test Twenty API connectivity from container
docker exec twenty-crm-mcp wget -qO- http://host.docker.internal:3000/healthz
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TWENTY_API_KEY` | ✅ Yes | - | Your Twenty CRM API key |
| `TWENTY_BASE_URL` | ✅ Yes | - | Twenty CRM URL (use `host.docker.internal` for localhost) |
| `MCP_TRANSPORT` | No | `http` | Transport mode (`http` for Docker) |
| `MCP_HTTP_HOST` | No | `0.0.0.0` | Bind address |
| `MCP_HTTP_PORT` | No | `8088` | Server port |
| `MCP_HTTP_PATH` | No | `/sse` | SSE endpoint path |

---

## Security Considerations

### Network Security

- The container runs as non-root user (`mcp:nodejs`)
- No secrets are baked into the image
- Use environment variables or secrets management for API keys

### Recommended Practices

1. **Use Cloudflare Access** for authentication if exposing via tunnel
2. **Restrict network access** using Docker networks
3. **Rotate API keys** periodically
4. **Monitor logs** for unauthorized access attempts

### Firewall Rules (if exposing directly)

```bash
# Only allow from specific IPs (example with ufw)
sudo ufw allow from 192.168.1.0/24 to any port 8088

# Or use iptables
iptables -A INPUT -p tcp --dport 8088 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 8088 -j DROP
```

---

## Updating

### Pull Latest Changes

```bash
cd /Volumes/2TB/Code/twenty-crm-mcp-server/twenty-crm-mcp-server

# Pull updates (if from git)
git pull

# Rebuild and restart
docker compose up -d --build
```

### Version Check

```bash
# Check running version
docker exec twenty-crm-mcp cat package.json | grep version
```

---

## Backup & Recovery

### Export Configuration

```bash
# Backup .env (contains API key)
cp .env .env.backup.$(date +%Y%m%d)

# Backup docker-compose overrides
cp docker-compose.override.yml docker-compose.override.yml.backup 2>/dev/null || true
```

### Recovery Steps

1. Restore `.env` file
2. Run `docker compose up -d --build`
3. Re-add MCP server in Dify UI (if needed)

---

## FAQ

### Q: Container keeps restarting?

Check logs for errors:
```bash
docker compose logs --tail=50 twenty-crm-mcp
```

Common causes:
- Invalid `TWENTY_API_KEY`
- `TWENTY_BASE_URL` unreachable from container
- Port 8088 already in use on host

### Q: Dify can't connect?

1. Verify container is healthy: `docker compose ps`
2. Test from Dify container:
   ```bash
   docker exec -it dify-api-1 sh -c 'curl http://host.docker.internal:8088/healthz'
   ```
3. Check if `host.docker.internal` resolves in your Docker setup

### Q: How to change the port?

Update both `.env` and the port mapping:

```yaml
# docker-compose.yml
ports:
  - "9000:9000"  # host:container

# .env
MCP_HTTP_PORT=9000
```

### Q: How to run alongside stdio mode?

Docker runs HTTP mode. For Claude Desktop (stdio), run directly:
```bash
npm start  # Uses stdio by default
```

Both can run simultaneously on different ports/transports.
