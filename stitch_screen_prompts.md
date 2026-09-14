# Stitch Screen Prompts — Ease & Bloom (Full Client Demo Journey)

Copy-paste each prompt into Google Stitch one at a time. Each is self-contained and mobile-first (choose **MOBILE** device type in Stitch unless noted otherwise). Screen ordering mirrors the client walkthrough: Onboarding → Home → Create → Engage → Community Notes → DMs → Notifications → Profile → Admin & Crisis.

---

## Design System (shared tokens)

Use these tokens in every prompt so all screens stay visually consistent:

- **Canvas / background:** Soft Cream `#FAF7F5`
- **Surface / cards:** Pure White `#FFFFFF`
- **Secondary surface (blush):** `#F5ECE9`
- **Primary accent / CTA:** Warm Terracotta `#C86D51`
- **Secondary accent:** Muted Wine `#804646`
- **Support accent:** Calm Sage `#8BA888` (used for "safe", "verified", "hugs", success states)
- **Text:** Primary `#292524` (stone), Secondary `#78716C` (muted), Placeholder `#A8A29E`
- **Dark mode:** Background `#1A1817`, Cards `#242120`, Borders `#363230`, Text `#F5F5F4`
- **Typography:** Warm serif for headlines and brand words (Lora / Cormorant Garamond), clean sans-serif (Inter) for body, labels, and UI.
- **Geometry:** Generously rounded corners (`rounded-xl`/`rounded-2xl`), pill-shaped buttons and tags.
- **Elevation:** Whisper-soft, diffused shadows; border separation instead of heavy shadows.
- **Icons:** Thin-line, minimalist icons (Lucide-style).
- **Mood:** Calm, warm, feminine, mindful. Generous whitespace. No harsh contrast, no loud gradients. Think slow Sunday morning, not fitness-hustle.

---

## Phase 2 — Onboarding & Setup

### 01. Welcome / Landing (PWA Install)

**Overall vibe:** A warm, calming first touch for a women-only wellness sanctuary. Feels like being invited into a peaceful garden — soft, safe, and empathetic, never clinical or corporate.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait-first PWA landing view.
- Palette: Soft Cream canvas `#FAF7F5`, white cards, Warm Terracotta `#C86D51` primary CTA, Muted Wine `#804646` secondary, Calm Sage `#8BA888` accent, stone text `#292524`, muted text `#78716C`.
- Typography: Serif (Lora) for the brand headline, Inter for body and buttons.
- Styles: Generously rounded corners, pill-shaped buttons, whisper-soft shadows, thin-line icons.

**PAGE STRUCTURE:**
1. **Top Status Bar:** iOS-style status bar; time + battery.
2. **Brand Header:** A small circular logo mark (a blooming flower in terracotta/sage watercolor style) with the wordmark "Ease & Bloom" in serif under it.
3. **Hero:** Short serif headline "A safe place to bloom." with a soft sub-headline "A women-only sanctuary for mental, physical, and holistic wellness — made with care, not noise."
4. **Visual Anchor:** A gentle, abstract illustration set — a watering can, a sprout, hearts/hugs — in soft terracotta, blush, and sage watercolor tones.
5. **Primary CTA:** Large pill button "Join the Garden" (terracotta) with a secondary text link "Already a member? Sign in".
6. **Reassurance Row:** Three small feature chips with icons: "Women-only community", "Anonymous support mode", "No notification fatigue".
7. **Trust Footer:** Tiny muted line: "Built for women, by women. Privacy first."

---

### 02. Soft-Gate "This-or-That" Verification Quiz

**Overall vibe:** A playful, low-pressure 3-question quiz gateway — feels like a fun conversation, not an interrogation. Warm and friendly, zero scare-factor.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White card on Soft Cream `#FAF7F5`; terracotta `#C86D51` selected states; blush `#F5ECE9` option chips; sage `#8BA888` progress; stone/muted text.
- Typography: Lora serif question headline, Inter for options.
- Styles: Pill-shaped option buttons, rounded card, progress bar, thin-line icons, gentle animations.

**PAGE STRUCTURE:**
1. **Header:** Small brand wordmark "Ease & Bloom" + close (X) icon top-right.
2. **Progress:** Soft sage progress bar labeled "Question 1 of 3" ("Step 1/3 · Who are you here with?").
3. **Question Card (rounded-2xl white card):** Serif question "Welcome in! Who are you joining the garden with?"
4. **Answer Options:** Three large pill-style option cards as "This-or-That" choices (e.g., "Just me 🧘‍♀️", "With my sisters 👭", "My bestie 💛") — each a touchable card with emoji, tapping fills it with a `#C86D51` border + light blush fill.
5. **Follow-up questions:** Show the pattern for Q2 ("Which best fits what you need today?") and Q3 ("How would you describe your vibe?") as swipeable preview dots.
6. **Continue Button:** Bottom sticky pill "Continue" (terracotta), disabled until a choice is selected.
7. **Subtle reassurance line:** "This is just a vibe check to help us keep the garden women-only — no ID or proof needed."

---

### 03. Profile Setup

**Overall vibe:** A gentle "make it yours" screen. Encouraging, personal, and quick to complete. Feels like setting up a cozy plant corner.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White card on Soft Cream `#FAF7F5`; terracotta avatar-tint background; sage `#8BA888` success ticks; stone/muted text; blush field backgrounds.
- Typography: Lora serif section titles, Inter for inputs.
- Styles: Rounded-2xl card, circular avatar, pill toggles, rounded inputs, thin-line icons.

**PAGE STRUCTURE:**
1. **Header:** "Create your bloom" serif title + step indicator "3 of 3".
2. **Avatar Setup:** Large circular avatar placeholder with "+ Add photo" — compressed to WebP note; choices of pastel gradient background rings.
3. **Form Fields (rounded inputs):** "@handle" (username), "Display name" (e.g. "Maya"), "Bio" (small textarea).
4. **Privacy Toggles:** Two card-style preference rows with pill toggle switches:
   - "Quiet Hours" — subtitle "Hold notifications 10 PM – 8 AM"
   - "Who can message you?" — segmented control: "Everyone / Mutual follows only"
5. **Primary CTA:** Full-width terracotta pill button "Enter the Garden 🌿".
6. **Skip:** Small muted "Skip for now — I'll finish later" text link.

---

## Phase 3 — Feeds & Creation

### 04. Home Feed (X-Style, Topic Pills)

**Overall vibe:** A calm discussion-first feed. Feels like a thoughtful bulletin board in a beautiful garden — not noisy, not addictive. Warm, editorial, and supportive.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: Soft Cream `#FAF7F5` canvas, white post cards, terracotta `#C86D51` accents, blush `#F5ECE9` pills, sage `#8BA888` for verified/hugs, stone/muted text.
- Typography: Inter for feed copy, Lora for pull-quote/headline style moments.
- Styles: Rounded-2xl cards separated by soft borders, pill topic tags, thin-line icons, sticky header with subtle blur/glassmorphism.

**PAGE STRUCTURE:**
1. **Sticky Header:** Brand wordmark "Ease & Bloom" (serif) left; right icons: gentle notifications bell, avatar thumbnail. Slight glassmorphism blur behind.
2. **Topic Pill Bar (horizontal scroll):** Pill tags `#MentalHealth`, `#PhysicalHealth`, `#Wellness`, `#Motherhood`, `#AskTheCommunity`; active pill filled terracotta, inactive blush-outline.
3. **Composer Prompt:** A rounded "starter card" — avatar + muted text "Share something with your sisters…" with a terracotta circle "+" button.
4. **Post Cards (vertical feed, generous spacing):**
   - Card A — Regular: avatar + name + @handle + time, body text "5 weeks postpartum and finally slept 4 hours straight — anyone else find a second wind around month 2? 🌙", 1 photo, tag pills, action row.
   - Card B — Ask: `#AskTheCommunity` tag, Q&A subtitle styling.
   - Card C — Poll card (see Screen 08).
5. **Action Row (per card):** thin-line icons + subtle counts: Reply (💬), Hugs (🤗, sage when pressed), Repost/forest sprout optional, metric.
6. **Supportive Microcopy:** Under a popular post a small sage line: "24 sisters sent hugs of support".
7. **Bottom Tab Bar:** Home, Search, Compose (raised terracotta center button), Notifications, Profile — pill highlight on active.

---

### 05. Composer Modal (Rich Text + Photo + Poll)

**Overall vibe:** A focused, calm writing surface. The compose sheet feels like a cozy journal page. Encourages thoughtful posts, never performative.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait bottom-sheet modal over a dimmed feed.
- Palette: White rounded sheet on a soft `#1A1817`-at-40% overlay; terracotta `#C86D51` toggle-accent; blush `#F5ECE9` selected chips; sage `#8BA888` for the "safe" anonymous state hint; stone/muted text.
- Typography: Inter body, muted serif hint line.
- Styles: Mostly-round sheet, pill chips, soft borders, thin-line icons.

**PAGE STRUCTURE:**
1. **Overlay + Bottom Sheet (rounded-top-3xl):** Grab handle pill at top.
2. **Header Row:** "New bloom" serif title; Cancel ghost link left, Post pill (disabled → terracotta when text exists) right.
3. **Author Row:** Your avatar + "@handle" + toggles.
4. **Anonymous Toggle:** A distinct pill toggle "Post anonymously 🎭" — when ON, the avatar row morphs into a randomized pastel avatar + "Anonymous" badge, and a tiny sage reassurance line appears: "Your name and handle stay hidden from everyone."
5. **CW (Content Warning) Selector:** Label "Add a content warning (optional)"; pill chips: `Grief`, `Pregnancy Loss`, `Eating Disorders`, `Body Image`, `Abuse`; tapping a chip adds a soft blur tag with an ⚠️ icon.
6. **Text Area:** Large, quiet, placeholder: "What's on your mind, sister?…" with a dim character counter.
7. **Media Attachment Row:** Thin-line icons: Image, Poll, Emoji, GIF — attached photo shown as a rounded thumbnail with an X-remove.
8. **Poll Builder (expanded state):** "Poll question…" input + 2 option inputs + sage "+ Add option".

---

### 06. Content Warning Blur Overlay

**Overall vibe:** Privacy and gentleness by default. The blurred card invites a mindful choice to reveal, never forces exposure.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: Heavily blurred warm tones behind a frosted-glass panel; dark olive/stone overlay `rgba(26,24,23,0.55)`; blush `#F5ECE9` panel; terracotta `#C86D51` action; muted white text.
- Typography: Inter, medium weights.
- Styles: Frosted glass, large soft blur, rounded-2xl, thin-line icons.

**PAGE STRUCTURE:**
1. **Post Card, blurred:** Avatar, name/tag, and the full post photo + text shown behind a strong soft blur (use frost + saturation dip).
2. **Overlay Panel:** Centered frosted-glass card with a ⚠️ icon in a blush circle.
3. **Warning Label:** "Content warning — Postpartum Depression" (the selected CW chip from Screen 05).
4. **Microcopy:** Muted line "This post discusses a sensitive topic. Reveal only when you feel ready."
5. **Primary CTA:** Terracotta pill "Reveal gently".
6. **Dismiss:** Ghost "Not now" text button below.

---

### 07. Anonymous Post Card

**Overall vibe:** A safe, warm expression of a vulnerable topic. The anonymous card feels protected and gentle, never suspicious or creepy.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White card on Soft Cream `#FAF7F5`; pastel anonymous avatar (soft peach/rose/lavender); sage `#8BA888` Anonymous badge; muted text; terracotta accent icón.
- Typography: Inter body, sage-tinted badge label.
- Styles: Rounded-2xl, pill badge, whisper-soft shadow.

**PAGE STRUCTURE:**
1. **Anonymous Avatar:** A soft pastel circle (peach `#F5D5C8` or lavender) with a subtle flower/face glyph — no photo.
2. **Identity Row:** "Anonymous" in muted serif + a small sage pill badge "💚 Anonymous"; neighborhood tag `#Motherhood` below.
3. **Vulnerable Body Text:** e.g. "I miscarried at 10 weeks and I haven't told my family. The silence is the hardest part. If anyone else has been here… how did you cope? 💛"
4. **CW Tag (if present):** muted little ⚠️ pill "Pregnancy Loss".
5. **Support Row:** Replies (23), Hugs (🤗 61 — sage highlight), and a small sage line: "61 sisters are holding space for you."
6. **Data-Protected Hint (footer microcopy):** tiny muted shield icon + "Your identity is never shared with anyone, not even the founder."

---

### 08. Interactive Poll Card

**Overall vibe:** A lightweight, playful community check-in. Encourages a tap; animates percentages live.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White card on cream; blush `#F5ECE9` unfilled option rows; sage `#8BA888` winner bar; terracotta `#C86D51` your-selection ring; stone/muted text.
- Typography: Inter.
- Styles: Rounded-2xl, pill options, soft progress fill animations, thin-line icons.

**PAGE STRUCTURE:**
1. **Post Header:** Avatar + name + `#AskTheCommunity` pill + "Poll · 3h" time.
2. **Poll Question:** "How do you wind down after a hard day?"
3. **Options (stacked rows):** Bars with percentages filling as selections register, e.g.:
   - "Herbal tea + journaling 🍵" — 42%
   - "Walk in the park 🌳" — 33% (highlighted as your pick with a sage ring)
   - "Call my bestie 📞" — 18%
   - "Early to bed, no guilt 🌙" — 7%
4. **Vote Feedback:** Small text "You voted · results update live · 128 sisters voted".
5. **Action Row:** Replies, Hugs 🤗, share.

---

## Phase 3 / 6 — Post Detail & Engagement

### 09. Post Detail with Threaded Comments & Hugs

**Overall vibe:** A supportive, deeply human conversation thread. Encourages empathy, never argument. Feels like a circle of friends, not a comment war.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White card on blush `#F5ECE9` page; sage `#8BA888` helpful-reply highlight; terracotta accents; muted text; thin-line icons.
- Typography: Inter for comments, Lora for the quoted source post pull.
- Styles: Rounded-2xl, nested reply indents with soft left rails, whisper shadows.

**PAGE STRUCTURE:**
1. **Detail Header:** Back chevron + title "The thread"; avatar of original author.
2. **Hero Post:** Original post card re-rendered larger (text + optional photo + tags) with CW blur respected.
3. **Top-Reply Support Panel:** A compact sage-tinted card: "🤗 61 hugs sent — Sarah, Dana, Nia and 4 others are holding space today."
4. **Comments List:** 
   - Top supportive comment (sage left rail + "🌟 Most supportive" mini-badge).
   - Nested replies indented, with reply lines.
   - Each comment: avatar, name, time, text, Like/Hug actions, "Reply" ghost link.
5. **In-Thread Note:** A highlighted "Community Context" mini-card threaded into the conversation (see Screen 10).
6. **Composer Bar:** Sticky bottom input "Add to the circle…" with emoji + too 🎭 anonymous toggle shortcut, and a Hugs (🤗) quick-action button.

---

## Phase 5 — Community Notes (Fact-Checking)

### 10. Community Context Consensus Card

**Overall vibe:** A verified, clinical, trustworthy callout — clean, calm, and authoritative without being bossy. It empowers the author, isn't a rebuke.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait (rendered beneath a post).
- Palette: White card with sage `#8BA888` left rail / border; soft sage-tint header; muted text; terracotta link accents; thin-line icons.
- Typography: Inter; Lora for the quoted claim.
- Styles: Rounded-2xl, 4px sage accent rail, subtle elevation.

**PAGE STRUCTURE:**
1. **Context Card header:** Sage check-circle icon + "Community Context · Verified by sisters" label.
2. **Claim being addressed (muted serif quote):** e.g. "…so I read that magnesium cures PCOS…"
3. **Note Text:** "Magnesium may support symptoms, but it does not cure PCOS. Current guidelines emphasize lifestyle + medical support. Always chat with your provider."
4. **Cited Sources:** A compact chip row: "NHS", "Mayo Clinic", "WHO" each a small pill with a tiny external-link icon.
5. **Ratings Strip:** Tiny thumbs: "Helpful 82 · Somewhat 17 · Not helpful 5" in muted small type.
6. **Dissenting affordance:** Small ghost link "Was this note misleading? Flag it".

---

### 11. Note Proposal Modal + Rating Flow

**Overall vibe:** Civic-minded and kind. Proposing context feels like helping a friend, with a clear, non-punitive structure. The rating flow is one-tap simple.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait bottom-sheet + inline rating cards.
- Palette: White sheet on dimmed cream; sage `#8BA888` positive, terracotta `#C86D51` destructive-only accents; blush chips; stone/muted text.
- Typography: Inter.
- Styles: Rounded sheets, pill chips, thin-line icons.

**PAGE STRUCTURE (Part A — Proposal modal):**
1. **Sheet Header:** "Add community context" + close X.
2. **Claim Input:** "Which claim needs context?" with the quoted post snippet.
3. **Classification Pills:** `Unverified health claim`, `Misleading claim`, `Missing context`, `Partly true`, `Fact-check needed`.
4. **Note Textfield:** "Explain it calmly, sister…" with a friendly helper: "Be kind — gentle tone gets helpful.")
5. **Source URL field:** "Attach a reputable source (NHS, Mayo, WHO…)".
6. **Submit:** sage-tinted pill "Submit for rating".

**PAGE STRUCTURE (Part B — Rating flow):**
1. **Rating Strawpoll Card:** "Is this note helpful?" with three large tappable buttons: `Helpful 👍` (sage), `Somewhat 💛` (blush), `Not helpful 👎` (muted).
2. **Reason Tag Chips below each:** e.g. "Cites credible sources", "Clear tone", "Misleading", "Too vague".
3. **Consensus Progress:** small meter "46 of 50 votes needed (70%)" with sage fill.

---

## Phase 6 — Direct Messaging

### 12. DMs Inbox

**Overall vibe:** A calm inbox — like a stack of friendly letters, not a notification warzone.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White cards on Soft Cream `#FAF7F5`; sage `#8BA888` for mutual-follow and unread soft-dots; blush previews; muted text.
- Typography: Inter.
- Styles: Rounded row cards, thin-line icons, whisper shadows.

**PAGE STRUCTURE:**
1. **Header:** "Messages" serif title + new-message composer icon.
2. **Filter Capsule Row:** `All`, `Mutual sisters`, `Waiting` (mutual-follow gate states shown).
3. **Message Row (cards):** Avatar + name + time; last-message preview in muted text. Examples:
   - "Sarah Messi — 'Thank you for the kind words 🥹' — 2m" with a soft sage "Mutual" tick.
   - "Dana R. — 'Thinking of you after yesterday 🌷'" unread with a tiny sage dot.
4. **Pending row (gate state):** an amber-light style muted row "Amina N. — requested a chat · Accept / Decline" to show the mutual-follow shield working.
5. **Hint footer:** tiny muted line "New chats only open with mutual follows unless you change your settings."

---

### 13. 1-on-1 DM Thread

**Overall vibe:** An intimate, caring conversation. Bubbles feel handwritten and warm — like texting your best friend at her kitchen table.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: Blush `#F5ECE9` page; outgoing bubbles in blush with wine `#804646` text on white; incoming in white; sage highlights for the hug sticker moments; terracotta timestamp accents.
- Typography: Inter.
- Styles: Rounded corner-ward bubbles, soft shadows, thin-line icons.

**PAGE STRUCTURE:**
1. **Chat Header:** Back chevron, friend avatar + name, online sage dot, "For you" tag; right: info (i) icon.
2. **Date Divider:** centered muted "Today".
3. **Conversation Bubbles (alternating):**
   - Incoming (white): "I read your post and just wanted to say — you're so strong. 💛"
   - Outgoing (blush-tinted): "That honestly made my whole day. Thank you. 🥹"
   - A "Hug Sent 🤗" system pill in sage between messages ("You sent a hug · Sarah received it").
4. **Message status microcopy:** tiny muted "Read" ticks on outgoing.
5. **Composer Bar:** rounded input "Write something warm…" + emoji button + heart/hug quick-send 🤗.
6. **Crisis-DM hint (contextual state):** optional small sage banner at top: "This thread was opened from a gentle check-in — your privacy is protected."

---

## Phase 7 — Notifications & Profile

### 14. Gentle Notifications Center

**Overall vibe:** Deliberately quiet. Batching turns a potential nag into a warm recap. Feels like receiving a thoughtful note, not a ping.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White cards on Soft Cream `#FAF7F5`; sage `#8BA888` for hugs/batches; muted text; terracotta for DM urgent-highlight only.
- Typography: Inter; Lora for the "Today" recap headings.
- Styles: Rounded-2xl, pill batching chips, thin-line icons.

**PAGE STRUCTURE:**
1. **Header:** "Notifications" serif + bell icon.
2. **Recap Banner (batching example):** blush card: "🌙 Quiet hours are on — we'll hold your pings until 8 AM."
3. **Grouped Notification Cards (batched):**
   - "Sarah & 3 others sent hugs of support today 🤗" — sage icon, "2h ago" → collapsed expander.
   - "Dana replied to your thread"— reply icon.
   - "Your poll is taking off: 128 sisters voted" — chart icon.
4. **Urgent DM (only urgent type is realtime):** a single non-grouped terracotta accented row: "Sarah sent you a direct message 💬 · now".
5. **Weekly Digest teaser card:** soft serif line "Sunday digest arrives tomorrow ✨ A gentle recap of your week in the garden."

---

### 15. Personal Profile

**Overall vibe:** A personal, warm space — soft, proud but humble. Like a hand-illustrated garden-tag for yourself.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: Blush `#F5ECE9` header block on cream canvas; white cards; terracotta edit accents; sage supports; muted text.
- Typography: Lora for display name & bio, Inter for stats/tabs.
- Styles: Rounded-3xl header, pill counters, whisper shadows.

**PAGE STRUCTURE:**
1. **Header Block (blush gradient):** Back chevron + "Edit" ghost button.
2. **Identity:** Circular avatar with terracotta ring, Display name in Lora "Maya 🌻", @handle muted, sage "Verified sister" tick.
3. **Bio:** "Learning to bloom slowly. Mum of two 🌿 PCOS warrior."
4. **Stats Row:** pill counters "Blossoms (posts) 42 · Hugs given 128 · Hugs received 217".
5. **Tab pills:** `My blooms` | `Replies` | `Media` | `Hugs`.
6. **Content Grid:** 2-column masonry of post cards + your anonymous-post card with "🎭 Anonymous blossom" label and a tiny shield icon.
7. **Empty state (optional):** a gentle sage sprout illustration + "Your garden is just budding — share your first bloom 🌱".

---

### 16. Privacy & Settings Screen

**Overall vibe:** Transparent, calming, human controls. Feels like tuning a cozy room — nothing scary, everything explained in plain words.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait.
- Palette: White rounded group cards on Cream `#FAF7F5`; sage `#8BA888` on-state toggles; terracotta destructive accents; muted text.
- Typography: Inter; Lora group titles.
- Styles: Rounded-2xl grouped cards, pill switches, thin-line icons.

**PAGE STRUCTURE:**
1. **Header:** "Settings" + back chevron.
2. **Notification group:** row "Quiet Hours" with pill switch (ON) + subtext "Hold notifications 10 PM – 8 AM"; row "Batch social pings" switch (ON) + "Recap hugs & likes every 2–4 hours"; push-notification permission row.
3. **Privacy group:** "Who can message you?" segmented control `Everyone / Mutual follows only` (default Mutual); "Show my activity to mutuals" switch.
4. **Moderation group:** "Anonymous shell — see masked replies only" info row.
5. **Crisis & data group:** gentle info row w/ shield: "Your sensitive posts are encrypted and pruned after 60 days." + support/resources link.
6. **Danger zone:** muted "Sign out" ghost + tiny "Delete my garden" in muted terracotta, de-emphasized.

---

## Phase 4 & 7 — Admin, Moderation & Crisis (build in DESKTOP)

### 17. Admin — Moderator Queue (Tiers 1, 2, 4)

> Device: choose **DESKTOP** in Stitch.

**Overall vibe:** A calm, human-first review desk. Judge-like but kind; fast triage with empathy baked into the UI.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Desktop admin dashboard.
- Palette: Light canvas `#F5F0EC`; white panel cards; Tier chips: Tier 1 terracotta `#C86D51`, Tier 2 amber `#D9A441`, Tier 4 muted stone `#78716C`; sage `#8BA888` for health-allowlist pass; wine `#804646` for harassment labels.
- Typography: Inter; tabular numbers for queues.
- Styles: Flat panels, thin dividers, rounded-2xl, strong but calm colors, thin-line icons.

**PAGE STRUCTURE:**
1. **Left Sidebar:** "Ease & Bloom · Mod Desk"; Menu: Queue, Crisis Incidents, Members, Digests, Settings. Active item wine-highlighted.
2. **Top Bar:** Search, current admin avatar, "On-call" sage dot.
3. **Metric Cards row:** `Waiting — Tier 1 (8)`, `In review (24h) — Tier 2 (13)`, `Gentle nudges — Tier 4 (5)`, `Crisis open (2)` (terracotta).
4. **Queue List (Tier 1 focuses):** each row = post card + claim excerpt + classifier chips:
   - Harassment card: flagged "targeted abuse", author handle, "AI score 0.94 — Tier 1".
   - Misinformation card: violet `#8A7FA8` chip "Tier 2 — flagged 24h review".
   - A passing example: sage chip "Allowlist pass — PCOS/endometriosis clinical context (auto-cleared)".
5. **Actions per row:** `Keep hidden`, `Visible`, `Send gentle note`, `Escalate → Crisis` (terracotta).
6. **Rationale Panel (right):** expanding drawer showing Stage 1 match + Stage 2 LLM reasoning + category scores (Harassment / Health Misinfo / Crisis / Predatory).

### 18. Crisis Incident Log — Tier 3 (with SLA timer)

> Device: choose **DESKTOP** in Stitch.

**Overall vibe:** A serious but tender command center. Utmost clarity and compassion; explicit, calm urgency with a visible response timer.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Desktop, crisis view.
- Palette: Mostly-dark calm surface `#1A1817` with `#242120` panels and `#363230` borders (dark mode consistent with app); text `#F5F5F4`; support accents sage `#8BA888`; urgent pulse terracotta `#C86D51`; soft wine highlights. No flashing alarms — calm urgency.
- Typography: Inter; monospaced timer numerals (tabular).
- Styles: Flat panels, rounded-2xl, gentle borders, thin-line icons.

**PAGE STRUCTURE:**
1. **Header:** "Crisis Incidents" + shield icon + "60-day auto-pruned · Encrypted AES-256" muted caption.
2. **Open Incident Card (priority top):** author (blurred pastel shell if anonymous), time-since-post (mono), and a large **SLA timer** chip: e.g. `⏱ 04:32 until target reply` turning wine→terracotta for emphasis.
3. **Encrypted Snippet Note:** locked padlock icon + "Snippet field-level encrypted — visible only to Crisis Lead (you)".
4. **1-Tap Warm DM Builder:** big terracotta button "Open compassionate DM ✨" → expands a draft composer pre-filled with an editable bestie-tone message: *"Hey love 🌷 I saw your post and my heart went out to you. You're not alone — I'm here if you want to talk in private. 💛"* + a curated resource dropdown (helplines).
5. **Crisis Checklist:** small quiet checklist: "✅ Sent warm DM · ☐ Shared confidential resource · ☐ Schedule gentle check-in (48h)".
6. **Incident history table:** muted list of past incidents with "Pruned after 60 days" watermark.

### 19. Founder Alert — SMS / WhatsApp Crisis Notification (mobile, extra)

> Device: choose **MOBILE** in Stitch. This is what the founder's phone shows.

**Overall vibe:** A calm-but-immediate SOS text on the responder's phone. Human, private, and effective within seconds.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile simulated SMS/WhatsApp-style card.
- Palette: Dark calm surface `#1A1817`; terracotta `#C86D51` alert action; sage `#8BA888` private note; soft white text.
- Typography: Inter; system monospace for timestamp.
- Styles: Simulated phone notification card, rounded-2xl, whisper shadow.

**PAGE STRUCTURE:**
1. **Notification Card:** App icon (bloom) + "Ease & Bloom — Crisis Alert" in terracotta.
2. **Message Body (mono timestamp):** "12:41 — Tier 3 disclosure detected in #MentalHealth."
3. **Context line (decrypted for responder):** "Author shell: ✨Anonymous · snippet: 'I feel like giving up…' (encrypted for Crisis Lead)".
4. **Primary Action:** Terracotta pill "Open 1-tap warm DM 💛" (docs straight into Screen 18's draft).
5. **Secondary action:** Ghost "View incident" + muted "Mark safe · log as reviewed".
6. **Calm assurance footer:** tiny sage line "Post remains visible. No public bot reply. Slept quietly in the feed."

---

## Phase 8 — Onboarding the Community

### 20. Migration / "Welcome to the Garden" Guide (bonus)

**Overall vibe:** A warm, simple 1-page visual guide that helps WhatsApp members feel at home instantly. Reassuring like a welcome letter.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile portrait (sharable card format).
- Palette: Soft Cream `#FAF7F5`; white guide cards; terracotta steps; sage highlights; blush accents.
- Typography: Lora serif headlines, Inter for steps.
- Styles: Rounded-2xl, numbered step cards, thin-line icons.

**PAGE STRUCTURE:**
1. **Hero:** Serif "Welcome to the Garden 🌷" + "Your WhatsApp family now has a home that always lets you rest."
2. **Step Cards (numbered 1-4):**
   1. "Add to your Home Screen" (PWA install icon) — "Just tap Share → Add to Home Screen on iOS or Install on Android."
   2. "Take the 3-question vibe check" — 30 seconds, women-only gate.
   3. "Share your first bloom 🌱" — try anonymous mode first, no pressure.
   4. "Set your quiet hours" — "We hold your pings so you can sleep."
3. **Reassurance panel:** sage card with shield icon: "Your data stays yours. Crisis posts are encrypted & auto-pruned in 60 days."
4. **Footer CTA:** terracotta pill "Start your first bloom today ✨" + muted "Questions? DM the founder 💬".

---

## Build Order Suggestion

For a smooth client walkthrough, generate in this order (this also maps to your build phases):

1. **04** Home Feed → 2. **05** Composer → 3. **07** Anonymous Post → 4. **06** CW Blur → 5. **08** Poll → 6. **09** Post Detail → 7. **10** Community Context → 8. **12** DMs → 9. **13** DM Thread → 10. **14** Notifications → 11. **15** Profile → 12. **03** Profile Setup → 13. **01-02** Welcome + Quiz → 14. **17-19** Admin + Crisis (wow factor) → 15. **20** Migration guide.

Tip: Start each new Stitch artboard at Mobile; only Screens 17 and 18 use Desktop.