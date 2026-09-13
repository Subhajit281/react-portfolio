---
title: Building Real-Time Collaborative Apps with WebSockets & WebRTC
slug: building-realtime-apps-with-websockets-and-webrtc
description: An architecture guide for building sub-50ms real-time collaboration using WebSockets for signaling and WebRTC DataChannels for peer-to-peer data.
author: Subhajit Sarkar
date: 2026-03-08
category: Frontend
tags: [WebSockets, WebRTC, Realtime, Networking, Peer-to-Peer]
coverImage: /blog-covers/realtime-websockets-webrtc.jpg
keywords: [websockets, webrtc, realtime collaboration, datachannel, signaling server, peer to peer web apps]
featured: false
---

# Introduction

From Figma's multiplayer cursor canvas to Google Docs' live collaborative typing, modern web applications increasingly demand sub-50ms real-time interactivity. While traditional polling and Server-Sent Events (SSE) provide unidirectional updates, bidirectional collaborative software requires **WebSockets** and **WebRTC DataChannels**.

Understanding when to route through a central WebSocket cluster versus establishing direct peer-to-peer WebRTC channels is the foundation of high-scale collaborative engineering.

## What You'll Learn

- Comparing WebSockets, Server-Sent Events (SSE), and WebRTC
- Building resilient WebSocket connections with heartbeat pings and exponential backoff
- The WebRTC connection handshake: SDP offers, answers, ICE candidates, and STUN/TURN
- Zero-latency peer-to-peer data sharing with `RTCDataChannel`
- Managing concurrent document state using Conflict-Free Replicated Data Types (CRDTs)

## Main Content

### Real-Time Technology Matrix

| Technology | Latency | Topology | Best For |
| :--- | :--- | :--- | :--- |
| **Server-Sent Events (SSE)** | ~100–300ms | Client-Server (Unidirectional) | Stock tickers, notifications, LLM token streaming |
| **WebSockets** | ~30–80ms | Client-Server (Full-Duplex) | Chat systems, multiplayer state broadcast |
| **WebRTC DataChannel** | ~10–35ms | Peer-to-Peer (Mesh / SFU) | Gaming, video audio, cursor tracking, local mesh sync |

### Resilient Client WebSocket Implementation

Production WebSockets must survive laptop sleeps, cellular handover, and load balancer timeouts:

```typescript
export class ResilientWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private heartbeatInterval: any;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      console.log('Connected to real-time cluster');
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), delay);
    };
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 25000);
  }

  private stopHeartbeat() {
    clearInterval(this.heartbeatInterval);
  }
}
```

### WebRTC: Establishing Peer-to-Peer DataChannels

WebRTC allows browsers to exchange arbitrary binary and text data directly without traffic flowing through your central servers:

```typescript
// Initializing peer connection with public Google STUN server
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

// Create low-latency unreliable channel for cursor movements (like UDP)
const cursorChannel = peerConnection.createDataChannel("cursors", {
  ordered: false,
  maxRetransmits: 0 // Drop lost frames to prevent head-of-line blocking!
});

cursorChannel.onmessage = (event) => {
  const { x, y, userId } = JSON.parse(event.data);
  renderRemoteCursor(userId, x, y);
};
```

## Best Practices

- **Use Unordered Channels for Ephemeral Data**: For mouse coordinates and audio levels, set `ordered: false` so missing packets never delay subsequent updates.
- **Always provide TURN servers**: Approximately 15–20% of corporate networks and mobile carriers block direct peer-to-peer UDP connections via symmetric NAT. A TURN relay server is mandatory.
- **Adopt CRDTs (like Yjs or Automerge)**: Never rely on naive timestamps for document conflict resolution; use CRDTs to merge edits mathematically without data loss.

## Conclusion

Combining WebSockets for reliable signaling with WebRTC DataChannels for ultra-low latency peer telemetry enables you to build multiplayer experiences that feel as responsive as desktop software.

