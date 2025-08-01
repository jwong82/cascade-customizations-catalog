---
labels: debugging, troubleshooting, problem-solving, maintenance, logging, profiling, systematic-approach, intermediate
author: Cascade Community
modified: 2024-08-01
---

# Debugging Issues Workflow

## Description

A systematic, phase-based approach to debugging software issues that guides developers from initial problem identification through resolution and prevention. This workflow emphasizes structured thinking, comprehensive information gathering, and methodical testing to efficiently resolve complex technical problems.

## Usage

Use this workflow when:
- Investigating production issues or bugs
- Troubleshooting performance problems
- Diagnosing system failures or unexpected behavior
- Training team members on debugging methodology
- Conducting post-incident investigations
- Resolving integration or deployment issues

This workflow is valuable for:
- **Senior developers** mentoring junior team members
- **DevOps engineers** investigating system issues
- **Support teams** escalating issues to development
- **QA engineers** providing detailed bug reports

## Examples

### Production Issue Investigation

#### API Response Time Degradation
```bash
# Phase 1: Reproduce and define
curl -w "@curl-format.txt" -s -o /dev/null https://api.example.com/users

# Phase 2: Gather information
# Check application logs
kubectl logs -f deployment/api-server | grep "slow query"

# Check database performance
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

# Phase 3: Form hypothesis
# Hypothesis: Recent database migration caused query performance regression

# Phase 4: Test hypothesis
EXPLAIN ANALYZE SELECT * FROM users 
JOIN profiles ON users.id = profiles.user_id 
WHERE users.created_at > '2024-01-01';
```

#### Memory Leak Investigation
```bash
# Monitor memory usage over time
while true; do
  ps aux | grep node | grep -v grep
  sleep 60
done

# Use Node.js heap profiling
node --inspect app.js
# Connect Chrome DevTools and take heap snapshots

# Identify memory growth patterns
node --trace-gc app.js 2>&1 | grep "Scavenge\|Mark-Sweep"
```

### Frontend Debugging Scenarios

#### React Component Not Updating
```javascript
// Add debugging to component
function UserProfile({ userId }) {
  console.log('UserProfile render', { userId, timestamp: Date.now() });
  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('UserProfile useEffect triggered', { userId });
    fetchUser(userId).then(userData => {
      console.log('User data received', userData);
      setUser(userData);
    });
  }, [userId]); // Check dependency array

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

#### Network Request Failures
```javascript
// Enhanced error handling and logging
async function apiCall(endpoint, options = {}) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log('API Request Start', { requestId, endpoint, options });
  
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'X-Request-ID': requestId,
        ...options.headers
      }
    });
    
    console.log('API Response', { 
      requestId, 
      status: response.status, 
      headers: Object.fromEntries(response.headers.entries()) 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Success', { requestId, dataKeys: Object.keys(data) });
    return data;
  } catch (error) {
    console.error('API Error', { requestId, error: error.message, stack: error.stack });
    throw error;
  }
}
```

### Database Debugging Techniques

#### Query Performance Analysis
```sql
-- Enable query logging
SET log_statement = 'all';
SET log_min_duration_statement = 1000; -- Log queries > 1 second

-- Analyze slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
WHERE mean_time > 100
ORDER BY mean_time DESC;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats 
WHERE tablename = 'users';
```

#### Connection Pool Issues
```javascript
// Monitor connection pool
const pool = new Pool({
  host: 'localhost',
  database: 'myapp',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Add pool monitoring
pool.on('connect', (client) => {
  console.log('Pool connected', { 
    totalCount: pool.totalCount, 
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount 
  });
});

pool.on('error', (err, client) => {
  console.error('Pool error', { error: err.message, client: client?.processID });
});
```

### System-Level Debugging

#### Docker Container Issues
```bash
# Check container health
docker ps -a
docker logs container_name --tail 100 -f

# Inspect container resources
docker stats container_name

# Debug inside container
docker exec -it container_name /bin/bash
# Check processes, memory, disk space
ps aux
df -h
free -m
```

#### Load Balancer Configuration
```bash
# Test load balancer routing
for i in {1..10}; do
  curl -H "Host: myapp.com" http://load-balancer/health
  sleep 1
done

# Check backend server health
curl -v http://backend-1:3000/health
curl -v http://backend-2:3000/health
```

### Debugging Workflow Templates

#### Bug Report Template
```markdown
## Bug Report: [Issue Title]
**Reporter**: [Name]
**Date**: [YYYY-MM-DD]
**Environment**: [Production/Staging/Development]
**Severity**: [Critical/High/Medium/Low]

### Steps to Reproduce
1. Navigate to...
2. Click on...
3. Enter data...
4. Observe...

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Additional Context
- Browser: [Chrome 91.0]
- OS: [macOS 11.4]
- User Role: [Admin/User]
- Error Messages: [Copy exact text]
- Screenshots: [Attach if relevant]

### Investigation Notes
[To be filled during debugging]
```

#### Post-Mortem Template
```markdown
## Post-Mortem: [Incident Title]
**Date**: [YYYY-MM-DD]
**Duration**: [Start time - End time]
**Impact**: [Users affected, services down]

### Timeline
- **HH:MM** - Issue first detected
- **HH:MM** - Investigation started
- **HH:MM** - Root cause identified
- **HH:MM** - Fix deployed
- **HH:MM** - Service fully restored

### Root Cause
[Detailed explanation of what caused the issue]

### Resolution
[What was done to fix the issue]

### Lessons Learned
[What we learned from this incident]

### Action Items
- [ ] Implement monitoring for X
- [ ] Update deployment process
- [ ] Add automated tests for Y
```

This systematic approach ensures thorough investigation and helps build institutional knowledge for future debugging efforts.
