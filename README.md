# 🌸 Ease & Bloom

> **A safe, mindful, women-only community web application dedicated to women's mental health, physical wellness, and holistic empowerment.**

Ease & Bloom is transitioning its vibrant community of 170+ women from WhatsApp into a dedicated, privacy-focused Progressive Web Application (PWA). Built with an **X (Twitter)-style discussion-led experience**, the platform eliminates group chat notification fatigue while providing deep, empathetic tools for authentic expression, crowdsourced health context, and crisis care.

---

## 🌟 Core Pillars & Key Features

### 1. 🛡️ Gentle Onboarding & Soft-Gate Verification
* **Playful "This-or-That" Quiz:** A lightweight, culturally intuitive 3-question filter at registration that confirms female community members without demanding invasive government IDs or video checks.
* **Low-Friction Access:** High security with low barrier to entry.

### 2. 💬 Discussion-First Feed (X-Style, Calm Tone)
* **Topic Taxonomy:** Neatly categorized topic pills (`#MentalHealth`, `#PhysicalHealth`, `#SelfCare`, `#Motherhood`, `#AskTheCommunity`).
* **Multi-Format Sharing:** Rich text posts, photos, interactive polls, and community Q&A cards.
* **No Endless Reels or Stories Pressure:** Focuses on thoughtful written discussions, questions, and mutual encouragement.

### 3. 🎭 Vulnerability & Safety Controls
* **Anonymous Posting Mode (🎭):** Members can toggle anonymous mode per post to discuss sensitive physical or mental health topics without fear of judgment.
* **Content Warning (CW) Blurs (⚠️):** Sensitive themes (grief, pregnancy loss, eating disorders) are softly blurred behind a "Click to Reveal" overlay.

### 4. 🤗 Empathy-Driven Interactions
* **Supportive Reactions:** Traditional likes plus a custom **"Send Hugs / Support"** reaction.
* **Threaded Discussions:** Nested, supportive replies highlighting helpful community wisdom.

### 5. 🔍 Community Notes (X-Style Crowdsourced Fact-Checking)
* **Combating Health Misinformation:** Community members can propose contextual notes with verified citations (e.g., NHS, Mayo Clinic, WHO) to health claims.
* **Peer Rating System:** Members vote on note helpfulness; once consensus is achieved, a distinct verified context card renders under the post.

### 6. 🔒 Private Messaging with Mutual-Follow Safety
* **1-on-1 Direct Messages:** Private, real-time messaging between members.
* **Mutual-Follow Shield:** Members can restrict incoming messages so only mutual follows can initiate a chat.

### 7. 🚨 Compassionate 4-Tier Moderation & Crisis Escalation
Rather than blunt keyword blocklists that mistakenly ban medical conditions, Ease & Bloom uses a **Hybrid 2-Stage Contextual Classifier**:
* **Tier 1 (Harassment / Hate / Scams):** Auto-hidden immediately and queued for moderator confirmation.
* **Tier 2 (Unverified Health Claims):** Remains visible, flagged for 24-hour review.
* **Tier 3 (Crisis & Abuse Disclosures):** **Never auto-deleted or slapped with public bot disclaimers.** The post stays visible, and a private alert (SMS/WhatsApp) is sent to the founder/trained responder for a **1-tap private check-in DM in a warm "bestie" tone** with confidential resources.
* **Tier 4 (Off-Topic Drift):** Remains visible with an optional gentle nudge.
* **Crisis Log Privacy:** Field-level AES-256 encryption, strict RBAC, and automated 60-day redaction/pruning.

### 8. 🌿 Anti-Fatigue "Gentle" Notification Engine
* **Default Quiet Hours:** Non-urgent notifications silenced between 10:00 PM and 8:00 AM.
* **Smart Batching:** Pings grouped every 2–4 hours (e.g., *"Sarah and 3 others sent hugs today"*).
* **Weekly Email Digest:** A calming Sunday evening recap of uplifting community moments.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Mobile & PWA)                 │
│         Next.js 14+ (App Router) • Tailwind CSS             │
│         Service Worker (Offline Caching & Web Push)         │
└──────────────────────────────▲──────────────────────────────┘
                               │ HTTPS / WSS
┌──────────────────────────────▼──────────────────────────────┐
│                  Backend Layer (NestJS)                     │
│  AuthModule • PostsModule • NotesModule • DMsModule (WSS)   │
│  ModerationModule • NotificationsModule                     │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│     Data & Storage Layer    │ │   Async Queues & Services   │
│  PostgreSQL (Prisma ORM)    │ │   Redis (BullMQ Worker)     │
│  S3 / R2 (Media Storage)    │ │   Web Push API (VAPID)      │
│  AES-256 Encrypted Logs     │ │   Resend (Email Digests)    │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## 📁 Repository Structure & Documentation

* `Ease_and_Bloom_App_Overview_and_User_Flows.docx` — Layman-friendly community overview & product guide for the founder and members.
* `Ease_and_Bloom_Discovery_Answers.docx` — Initial client discovery responses and requirements.
* `Ease_and_Bloom_Moderation_Dev_Spec.docx` — Founder's developer specification for the 4-tier moderation and crisis escalation system.

---

## 🗺️ Roadmap Milestones

- [x] **Discovery & Community Alignment**
- [x] **User Flow & Screen Inventory Specification**
- [x] **Database Schema & Entity Relationship Design**
- [x] **4-Tier Contextual Moderation & Crisis Workflow Architecture**
- [ ] **Phase 1: Project Scaffolding (Next.js PWA + NestJS Backend)**
- [ ] **Phase 2: Auth, Verification Quiz & Profile Setup**
- [ ] **Phase 3: Topic Feed & X-Style Content Creation (Anonymous & CW)**
- [ ] **Phase 4: 2-Stage Moderation Pipeline & Tier 3 Crisis Alerts**
- [ ] **Phase 5: Community Notes Fact-Checking System**
- [ ] **Phase 6: Realtime 1-on-1 DMs with Mutual-Follow Gate**
- [ ] **Phase 7: Gentle Notification Engine & Quiet Hours Throttling**
- [ ] **Phase 8: Beta Testing & WhatsApp Community Migration**

---

## 📄 License

Proprietary — Built exclusively for **Ease & Bloom**. All rights reserved.
