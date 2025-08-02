# Momaid - Your Pregnancy Companion

This repository contains a comprehensive web application designed to support expectant mothers throughout their pregnancy journey with personalized tracking, tips, and healthcare resources.

##  Docker Hub Repository

**Image Details:**
- **Docker Hub URL**: `https://hub.docker.com/repositories/kellia855`
- **Image Name**: `kellia855/momaid`
- **Available Tags**: 
  - `v1.0` - Version 1.0 release

##  Build Instructions

### Building the Image Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd momaid
   ```

2. **Build the Docker image**
   ```bash
   docker build -t kellia/momaid:v1 .
   ```

3. **Push to Docker Hub (optional)**
> Replace `yourusername` with your Docker Hub username if you're rebuilding your own version.
   ```bash
   docker login
   docker push yourusername/momaid:v1.0
   ```

##  Run Instructions

### Commands Used on Web01/Web02

**On Web01:**
```bash
# Pull the image from Docker Hub
docker pull yourusername/momaid:v1

# Run the container
docker run -d --name app --restart unless-stopped -p 8080:8080 yourusername/momaid:v1
```

**On Web02:**
```bash
# Pull the image from Docker Hub
docker pull yourusername/momaid:v1

# Run the container
docker run -d --name app --restart unless-stopped -p 8080:8080 yourusername/momaid:v1
```


##  Load Balancer Configuration

### HAProxy Configuration Snippet

Add this to your HAProxy configuration file (`/etc/haproxy/haproxy.cfg`):

```
global
    daemon
    maxconn 4096

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend web_frontend
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    server web01 3.88.177.20:8080 check
    server web02 52.70.40.236:8080 check
```

### Reloading HAProxy Inside the Container

```bash
# Reload HAProxy without stopping the container
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'

# Optionally, check if HAProxy is running and config is valid
docker exec -it lb-01 haproxy -c -f /etc/haproxy/haproxy.cfg


### Adding Server Identification Headers

**On Web01:**
```bash
# Add X-Served-By header to identify the server
docker exec -it app sed -i "/add_header X-Content-Type-Options/a \    add_header X-Served-By \"web-01\" always;" /etc/nginx/conf.d/nginx.conf

# Reload Nginx configuration
docker exec -it app nginx -s reload

# Verify the configuration was added
docker exec -it app grep -A1 "X-Content-Type-Options" /etc/nginx/conf.d/nginx.conf
```

**On Web02:**
```bash
# Add X-Served-By header to identify the server
docker exec -it app sed -i "/add_header X-Content-Type-Options/a \    add_header X-Served-By \"web-02\" always;" /etc/nginx/conf.d/nginx.conf

# Reload Nginx configuration
docker exec -it app nginx -s reload

# Verify the configuration was added
docker exec -it app grep -A1 "X-Content-Type-Options" /etc/nginx/conf.d/nginx.conf
```
## Deployment IPs 

These are the IPs used in the HAProxy config and for direct testing:

- Load Balancer (lb-01): http://13.221.204.4:80
- Web01: http://3.88.177.20:8080
- Web02: http://52.70.40.236:8080

##  Testing Steps & Evidence

### 1. Verify Individual Container Health

**Test Web01 directly:**
```bash
curl -I http://<WEB01_IP>:8080
# Expected: HTTP/200 OK with X-Served-By: web-01 header
```

**Test Web02 directly:**
```bash
curl -I http://<WEB02_IP>:8080
# Expected: HTTP/200 OK with X-Served-By: web-02 header
```

### 2. Test Load Balancer Round-Robin

**From the load balancer (Lb01):**
```bash
# SSH to lb-01
ssh ubuntu@lb-01

# Test multiple requests to verify round-robin distribution
curl -I http://localhost | grep -i x-served-by
curl -I http://localhost | grep -i x-served-by
curl -I http://localhost | grep -i x-served-by
curl -I http://localhost | grep -i x-served-by
```

**Expected Output:**
```
![output snippet](/assets/image.png)
```



## Project Structure

```
momaid/
├── Dockerfile                 # Multi-stage Docker build
├── nginx.conf                # Nginx server configuration
├── index.html                # Main application entry point
├── dashboard.html            # Dashboard components
├── style.css                 # Main stylesheet with responsive design
├── script/
│   ├── auth.js              # Authentication system
│   ├── tracker.js           # Pregnancy tracking logic
│   ├── tips.js              # Tips and advice system
│   └── healthcenters.js     # Healthcare facility finder
├── assets/                  # Static assets (images, icons)
└── README.md               # This file
```

##  Quick Start Guide

1. **Pull and run the application:**
   ```bash
   docker pull kellia855/momaid:v1
   docker run -d -p 8080:8080 kellia/momaid:v1
   ```

2. **Verify it's running:**
   ```bash
   curl -I http://localhost
   ```

3. **Access the application:**
   Open `http://localhost` in your browser

4. **Test core functionality:**
   - Register a new account
   - Set a due date (The time you expect to give birth)
   - View dashboard with pregnancy tracking
   - Test the healthcare finder (requires internet)


## Author

**Kellia Kamikazi** 

*Made for expectant mothers everywhere*