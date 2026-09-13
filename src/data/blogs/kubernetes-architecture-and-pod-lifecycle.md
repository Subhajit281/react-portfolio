---
title: Kubernetes Architecture & Pod Lifecycle Under the Hood
slug: kubernetes-architecture-and-pod-lifecycle
description: A deep dive into Kubernetes control planes, the Kubelet worker loop, Pod phases, and zero-downtime graceful shutdowns.
author: Subhajit Sarkar
date: 2026-06-10
category: DevOps
tags: [Kubernetes, Cloud, DevOps, Orchestration]
coverImage: /blog-covers/kubernetes-architecture.jpg
keywords: [kubernetes architecture, pod lifecycle, kubelet, control plane, k8s graceful shutdown, liveness probes]
featured: false
---

# Introduction

Kubernetes has become the operating system of the modern cloud. While writing a YAML Deployment manifest is straightforward, understanding what happens behind the scenes when a Pod is scheduled, booted, evaluated, and terminated is what separates junior developers from senior infrastructure engineers.

## What You'll Learn

- The roles of control plane components (`kube-apiserver`, `etcd`, `kube-scheduler`)
- How the `kubelet` agent reconciles desired state on worker nodes
- Pod phases (`Pending`, `Running`, `Succeeded`, `Failed`) and container states
- Configuring robust Liveness, Readiness, and Startup Probes
- Handling `SIGTERM` signals for zero-downtime rolling updates

## Main Content

### The Control Plane & Worker Dance

When you submit `kubectl apply -f deployment.yaml`:

1. **`kube-apiserver`**: Validates the spec and writes the state to **`etcd`** (the distributed key-value store).
2. **`kube-scheduler`**: Watches for unscheduled pods, evaluates node affinities, resource requirements, and taints, and assigns the pod to a suitable node.
3. **`kubelet`**: The node agent sees the pod assigned to its host and instructs the container runtime (CRI like containerd) to pull images and launch containers.

```
+---------------+      +-------------------+      +------------------+
| kubectl apply | ---> |   kube-apiserver  | ---> |   etcd cluster   |
+---------------+      +-------------------+      +------------------+
                                |
                                v
                       +-------------------+
                       |   kube-scheduler  |
                       +-------------------+
                                |
                   (Assigns Pod to Worker Node)
                                v
                       +-------------------+
                       | kubelet (Node 01) | ---> container runtime
                       +-------------------+
```

### Pod Probes: Preventing Traffic Blackholes

A container being running does not mean your application is ready to process traffic. Without probes, Kubernetes routes requests to booting servers, causing HTTP 502/503 spikes.

```yaml
spec:
  containers:
    - name: api-service
      image: myorg/api:v1.4
      ports:
        - containerPort: 8080
      # Verifies application startup has finished
      startupProbe:
        httpGet:
          path: /health/startup
          port: 8080
        failureThreshold: 30
        periodSeconds: 5
      # Controls whether traffic should be routed to this pod
      readinessProbe:
        httpGet:
          path: /health/ready
          port: 8080
        periodSeconds: 10
        timeoutSeconds: 2
      # Restarts the container if deadlock or fatal state occurs
      livenessProbe:
        httpGet:
          path: /health/live
          port: 8080
        periodSeconds: 15
        timeoutSeconds: 3
```

### Graceful Termination Lifecycle

When a pod is deleted (or replaced during a rolling update):

1. Pod status transitions to `Terminating`.
2. Endpoint controller removes the pod IP from the Service's Endpoints/EndpointSlices (routing stops).
3. Kubernetes sends `SIGTERM` to the container's PID 1.
4. If the container doesn't exit within `terminationGracePeriodSeconds` (default 30s), a `SIGKILL` is sent.

```javascript
// Node.js Express Graceful Shutdown
const server = app.listen(8080);

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Draining existing connections...');
  server.close(async () => {
    await db.$disconnect();
    console.log('All connections drained cleanly. Exiting.');
    process.exit(0);
  });
});
```

## Best Practices

- Always specify both `requests` and `limits` for CPU and memory to prevent noisy neighbor starvation.
- Ensure readiness probes fail immediately if downstream database pools or cache connections drop.
- Keep `preStop` hooks for quick sleeps (`sleep 5`) if your ingress controller takes a few seconds to flush endpoint updates.

## Conclusion

Mastering the Pod lifecycle ensures high availability and zero-downtime rolling updates in mission-critical Kubernetes clusters.

