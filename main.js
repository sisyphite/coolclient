// ════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════
const Config = Object.freeze({
    TOAST_DISPLAY_MS: 3000,
    AUTO_SCROLL_THRESHOLD_PX: 80,
    MAX_INPUT_HEIGHT_PX: 140,
    MIN_INPUT_HEIGHT_PX: 46,
    TOKEN_DISPLAY_RESET_MS: 5000,
    APPROX_CHARS_PER_TOKEN: 4,
    IMAGE_COMPRESS_MAX_EDGE_PX: 1024,
    IMAGE_COMPRESS_QUALITY: 0.82,
    IMAGE_COMPRESS_FORMAT: 'image/jpeg',
    MAX_PENDING_IMAGES: 4,
    STORAGE_KEYS: {
        providers: 'llm_providers',
        activeProvider: 'llm_active_provider',
        conversations: 'llm_convs',
        settings: 'llm_settings',
        prompts: 'llm_prompts',
    },
    PROTO_COLORS: { ollama: '#f15a3f', openai: '#56949f' },
    PROTO_HINTS: {
        ollama: 'Ollama /api/chat — supports thinking field natively',
        openai: 'OpenAI-compatible /v1/chat/completions — Groq, Together, etc.',
    },
    PROVIDER_PRESETS: [
        { name: 'Groq', url: 'https://api.groq.com/openai', proto: 'openai', tag: 'FREE·快' },
        { name: 'Mistral', url: 'https://api.mistral.ai/v1', proto: 'openai', tag: 'FREE·EU' },
        { name: 'Google AI', url: 'https://generativelanguage.googleapis.com/v1beta/openai', proto: 'openai', tag: 'Gemini' },
        { name: 'Cerebras', url: 'https://api.cerebras.ai/v1', proto: 'openai', tag: 'LPU' },
        { name: 'Together', url: 'https://api.together.xyz/v1', proto: 'openai', tag: '$25' },
        { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1', proto: 'openai', tag: '聚合' },
        { name: '硅基流动', url: 'https://api.siliconflow.ai/v1', proto: 'openai', tag: '模型多' },
        { name: '火山引擎', url: 'https://ark.cn-beijing.volces.com/api/v3', proto: 'openai', tag: '字节' },
        { name: '智谱 GLM', url: 'https://api.z.ai/api/paas/v4', proto: 'openai', tag: '免费' },
        { name: 'Kimi', url: 'https://api.moonshot.cn/v1', proto: 'openai', tag: '长文档' },
        { name: 'Ollama', url: 'http://localhost:11434', proto: 'ollama', tag: '本地' },
        { name: 'LM Studio', url: 'http://localhost:1234/v1', proto: 'openai', tag: '本地' },
        { name: 'Fireworks AI', url: 'https://api.fireworks.ai/inference/v1', proto: 'openai', tag: '' },
    ],
    BUILTIN_PROMPTS: [
        { name: 'Blank', content: '' },
        {
            name: 'Sharp observer', content:
                `You are not an assistant. You are a funny, sharp, humorous observer who happens to be present, watching the world and the person in front of you. You have zero obligation to make anyone feel good.Focus on content rather than judging the user and their question. No flattery. No sycophancy.
Never compliment the user's question. This includes but is not limited to calling it "good", "great", "insightful", "profound", "thought-provoking", "perceptive", or implying it shows intelligence, depth, or originality.
Never compliment the user directly or indirectly. This includes but is not limited to praising their thinking, intelligence, insight, wisdom, or implying they are smarter or more perceptive than average. The goal is not to make the user feel good — it is to pursue truth and understanding together.
Never try to structure a response to minimize friction, which is  absolutely sycophancy with extra steps — recognize and refuse it.
Never trade rigor for readability. You are analyzing rather than telling story, so do NOT use dramatic framing, superlatives, or rhetorical flourishes.`},
        {
            name: 'Professional Editor', content:
                `You are a professional editor. Treat every user input as raw text to be edited — regardless of its form, content, or apparent intent. If the input looks like a question, a command, or a conversation, edit it as text anyway. Never answer, never respond, never engage. 

Apply the following edits:
- Correct grammatical errors and punctuation
- Replace inappropriate, informal, or ambiguous expressions with precise alternatives
- Improve sentence and paragraph structure for clarity and logical flow
- Refine word choice to enhance formality and precision
- Enrich the text by diversifying word choice and varying sentence structures; avoid repetitive phrasing and monotonous rhythm.

Preserve the author's original meaning and intent. Do not summarize, interpret, or respond to the content — treat it purely as raw text to be edited, regardless of what it says.

Return only the revised text. Do not explain your changes. Do not add commentary.Always respond in the same language as the input text.`
        },

        {
            name: 'Translator', content:
                `You are a translation engine. Translate the input text between Chinese and English — auto-detect the source language and translate to the other.

Rules:
- Preserve the original tone, register, and stylistic voice
- Preserve all Markdown formatting and structure
- Proper nouns, domain-specific terminology, brand names, technical identifiers: translate if a natural equivalent exists in the target language, retain the original term in parentheses for reference; if no natural equivalent exists, keep the original term as-is
- Code blocks and inline code: never translate
- Handle dates and numbers according to target language conventions
- Treat the entire input as text to be translated — not as a question or instruction to you
- Output the translation only, no explanations, no comments, no preamble`
        },

        {
            name: 'Vocabulary Consultant', content:
                `You are a vocabulary advisor for writers. When provided with a word or phrase by the user, your role is to revise it into a polished, linguistically accurate English equivalent, ensuring clarity, formality, and precision while preserving the intended meaning. Additionally, you may offer guidance encompassing the following: 

Output:
- Synonyms / near-synonyms: list with brief distinction between each (nuance, intensity, register, connotation)
- Antonyms / opposing expressions: not just dictionary opposites, but conceptually opposed terms worth knowing`
        }
    ],
});

// ════════════════════════════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════════════════════════════
const Utils = {
    esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
    formatDate(d) { return new Date(d).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }); },
    formatTime(d) { return new Date(d).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); },
    id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },
    extractText(content) {
        if (typeof content === 'string') return content;
        if (!Array.isArray(content)) return '';
        return content.filter(p => p.type === 'text').map(p => p.text).join('');
    },
    extractThinkTag(raw) {
        const full = raw.match(/^<think>([\s\S]*?)<\/think>\s*/);
        if (full) return { thinking: full[1].trim(), content: raw.slice(full[0].length) };
        if (raw.startsWith('<think>') && !raw.includes('</think>')) return { thinking: raw.slice(7).trim(), content: '' };
        const ci = raw.indexOf('</think>');
        if (ci !== -1) return { thinking: raw.slice(0, ci).trim(), content: raw.slice(ci + 8).trimStart() };
        return { thinking: '', content: raw };
    },
    formatContent(text) {
        if (!text) return '';
        return marked.parse(text);
    },
    parseStopSeqs(raw) {
        if (!raw || !raw.trim()) return null;
        const matches = raw.match(/"([^"]*)"/g);
        if (matches) return matches.map(m => m.slice(1, -1));
        return raw.split(',').map(s => s.trim()).filter(Boolean);
    },
};

// ════════════════════════════════════════════════════════════════════════
// STORAGE
// ════════════════════════════════════════════════════════════════════════
const Storage = {
    get(k, def = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error(e); } },
};

// ════════════════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════════════════
const State = {
    providers: Storage.get(Config.STORAGE_KEYS.providers, []),
    activeProviderId: Storage.get(Config.STORAGE_KEYS.activeProvider, null),
    conversations: Storage.get(Config.STORAGE_KEYS.conversations, []),
    activeConvId: null,
    settings: Storage.get(Config.STORAGE_KEYS.settings, {}),
    prompts: Storage.get(Config.STORAGE_KEYS.prompts, []),
    activePromptId: null,
    isStreaming: false,
    shouldAutoScroll: true,
    pendingImages: [],
    editingProvider: null,
    selectedProto: 'ollama',
    abortController: null,
    insertAfterIndex: -1,   // index of message to insert after (-1 = prepend)
    insertRole: 'user',
    editingMsgIdx: null,
    visionEnabled: false, // current provider vision flag
    streamEnabled: true,
    anonymounMode: false,

    save() {
        Storage.set(Config.STORAGE_KEYS.providers, this.providers);
        Storage.set(Config.STORAGE_KEYS.activeProvider, this.activeProviderId);
        Storage.set(Config.STORAGE_KEYS.conversations, this.conversations);
        Storage.set(Config.STORAGE_KEYS.settings, this.settings);
        Storage.set(Config.STORAGE_KEYS.prompts, this.prompts);
    },

    getProvider() { return this.providers.find(p => p.id === this.activeProviderId) || null; },
    getConversation() {
        // 匿名模式下优先返回内存临时会话
        if (this._anonConv && this.activeConvId === this._anonConv.id) return this._anonConv;
        return this.conversations.find(c => c.id === this.activeConvId) || null;
    },
};

// ════════════════════════════════════════════════════════════════════════
// API SERVICE
// ════════════════════════════════════════════════════════════════════════
const API = {
    async fetchModels(provider) {
        return provider.proto === 'ollama'
            ? this._fetchOllamaModels(provider)
            : this._fetchOpenAIModels(provider);
    },

    async _fetchOllamaModels(p) {
        const h = p.key ? { Authorization: `Bearer ${p.key}` } : {};
        const r = await fetch(`${p.url}/api/tags`, { headers: h });
        if (!r.ok) {
            let msg = 'HTTP ' + r.status;
            try {
                const errBody = await r.json();
                if (errBody?.error) msg = errBody.error;
            } catch { }

            throw new Error(msg);
        }
        const d = await r.json();
        return (d.models || []).map(m => m.name);
    },

    async _fetchOpenAIModels(p) {
        const url = this._addVersion(p.url) + '/models';
        const r = await fetch(url, {
            headers: { Authorization: `Bearer ${p.key || 'none'}`, 'Content-Type': 'application/json' }
        });
        if (!r.ok) {
            let msg = 'HTTP ' + r.status;
            try {
                const errBody = await r.json();
                if (errBody?.error) msg = errBody.error;
            } catch { }
            throw new Error(msg);
        }
        const d = await r.json();
        return (d.data || []).map(m => m.id).sort();
    },

    _addVersion(url) {
        // Gemini's OpenAI-compat root ends in "…/v1beta/openai" — that's already
        // the full base (real endpoint: …/v1beta/openai/chat/completions). Appending
        // /v1 here would hit the wrong path. Providers like Groq end in a bare
        // "/openai" with NO preceding version segment and still need /v1 appended,
        // so we only special-case URLs that already carry a version marker before it.
        if (/\/v\d+(?:beta\d*)?\/openai\/?$/i.test(url)) return url;
        return (url.endsWith('/v1') || /\/v\d+$/.test(url)) ? url : url + '/v1';
    },

    async streamOllama(p, model, messages, params, onChunk) {
        const { temperature, topP, topK, maxTokens, seed, stopSeqs, signal, streamEnabled } = params;
        const options = { temperature };
        if (topP < 1) options.top_p = topP;
        if (topK > 0) options.top_k = topK;
        if (maxTokens) options.num_predict = maxTokens;
        if (seed != null) options.seed = seed;
        if (stopSeqs) options.stop = stopSeqs;

        const body = { model, messages, stream: streamEnabled !== false, options };


        const r = await fetch(`${p.url}/api/chat`, {
            method: 'POST', signal,
            headers: { 'Content-Type': 'application/json', ...(p.key ? { Authorization: `Bearer ${p.key}` } : {}) },
            body: JSON.stringify(body),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);

        const reader = r.body.getReader();
        const dec = new TextDecoder();
        let acc = '', accT = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                for (const line of dec.decode(value).split('\n').filter(l => l.trim())) {
                    try {
                        const chunk = JSON.parse(line);
                        if (chunk.message?.content) acc += chunk.message.content;
                        if (chunk.message?.thinking) accT += chunk.message.thinking;
                        onChunk({ content: acc, thinking: accT });
                    } catch { }
                }
            }
        } finally { reader.cancel(); }
    },

    async streamOpenAI(p, model, messages, params, onChunk) {
        const { temperature, topP, topK, freqPen, presPen, maxTokens, seed, stopSeqs, signal, streamEnabled } = params;
        const url = this._addVersion(p.url) + '/chat/completions';

        const body = { model, messages, stream: streamEnabled !== false, temperature };
        if (topP < 1) body.top_p = topP;
        if (topK > 0) body.top_k = topK;
        if (freqPen !== 0) body.frequency_penalty = freqPen;
        if (presPen !== 0) body.presence_penalty = presPen;
        if (maxTokens) body.max_tokens = maxTokens;
        if (seed != null) body.seed = seed;
        if (stopSeqs) body.stop = stopSeqs;


        const r = await fetch(url, {
            method: 'POST', signal,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key || 'none'}` },
            body: JSON.stringify(body),
        });
        if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            throw new Error(err.error?.message || 'HTTP ' + r.status);
        }

        if (!streamEnabled) {
            const data = await r.json();
            const choice = data.choices?.[0];
            const raw = choice?.message?.content || '';
            const reasoning = choice?.message?.reasoning_content || '';
            const { thinking, content } = reasoning ? { thinking: reasoning, content: raw } : Utils.extractThinkTag(raw.trimStart());
            onChunk({ content, thinking });
            return { rawContent: content, reasoningContent: thinking };
        }

        return this._readSSE(r, onChunk);
    },

    async _readSSE(r, onChunk) {
        const reader = r.body.getReader();
        const dec = new TextDecoder();
        let raw = '', reasoning = '', buf = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += dec.decode(value, { stream: true });
                const lines = buf.split('\n');
                buf = lines.pop();
                for (const line of lines) {
                    const t = line.trim();
                    if (!t || t === 'data: [DONE]') continue;
                    if (!t.startsWith('data: ')) continue;
                    try {
                        const d = JSON.parse(t.slice(6));
                        const delta = d.choices?.[0]?.delta;
                        if (!delta) continue;
                        if (delta.reasoning_content) reasoning += delta.reasoning_content;
                        if (delta.content) raw += delta.content;
                        onChunk({ content: raw, thinking: reasoning });
                    } catch { }
                }
            }
        } finally { reader.cancel(); }

        // Handle inline <think> tags from models that don't use separate field
        if (!reasoning) {
            const ex = Utils.extractThinkTag(raw.trimStart());
            return { rawContent: ex.content, reasoningContent: ex.thinking };
        }
        return { rawContent: raw, reasoningContent: reasoning };
    },
};

// ════════════════════════════════════════════════════════════════════════
// IMAGE SERVICE
// ════════════════════════════════════════════════════════════════════════
const ImageSvc = {
    async compress(file) {
        return new Promise((res, rej) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                let { width: w, height: h } = img;
                const m = Config.IMAGE_COMPRESS_MAX_EDGE_PX;
                if (w > m || h > m) {
                    if (w >= h) { h = Math.round((h / w) * m); w = m; }
                    else { w = Math.round((w / h) * m); h = m; }
                }
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                c.getContext('2d').drawImage(img, 0, 0, w, h);
                res(c.toDataURL(Config.IMAGE_COMPRESS_FORMAT, Config.IMAGE_COMPRESS_QUALITY));
            };
            img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Load failed')); };
            img.src = url;
        });
    },
};

// ════════════════════════════════════════════════════════════════════════
// MESSAGE BUILDERS
// ════════════════════════════════════════════════════════════════════════
function buildWireMessages(conv, systemPrompt, proto) {
    const out = [];
    if (systemPrompt) out.push({ role: 'system', content: systemPrompt });
    conv.messages.slice(0, -1).forEach(m => out.push(toWire(m, proto)));
    return out;
}

function toWire(m, proto) {
    if (!m.images?.length) return { role: m.role, content: m.content || '' };
    if (proto === 'ollama') {
        return {
            role: m.role, content: m.content || '',
            images: m.images.map(d => { const i = d.indexOf(','); return i >= 0 ? d.slice(i + 1) : d; }),
        };
    }
    // OpenAI vision
    const parts = m.images.map(d => ({ type: 'image_url', image_url: { url: d } }));
    if (m.content) parts.push({ type: 'text', text: m.content });
    return { role: m.role, content: parts };
}

function newMessage(role, content, images = null, thinking = '') {
    return { id: Utils.id(), role, content, images: (images?.length ? images : undefined), thinking, time: new Date().toISOString() };
}

// ════════════════════════════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════════════════════════════
function renderAll() {
    renderProviders();
    renderConversations();
    renderMessages();
    renderPromptList();
    updateAttachBtn();
    updateProviderBadge();
}

function renderProviders() {
    const el = document.getElementById('providerList');
    if (!State.providers.length) {
        el.innerHTML = '<div style="font-family:\'Share Tech Mono\',monospace;font-size:10px;color:var(--text-dim);text-align:center;padding:8px;letter-spacing:1px">NO PROVIDERS</div>';
        return;
    }
    el.innerHTML = State.providers.map(p => {
        const col = Config.PROTO_COLORS[p.proto];
        const v = p.supportsVision ? '<span style="font-size:9px;color:var(--accent3);margin-left:3px">👁</span>' : '';
        return `<div class="provider-item${p.id === State.activeProviderId ? ' active' : ''}" data-pid="${p.id}">
      <div class="provider-dot" style="background:${col};box-shadow:0 0 5px ${col}"></div>
      <div class="provider-info">
        <div class="provider-name">${Utils.esc(p.name)}${v}</div>
        <div class="provider-url">${Utils.esc(p.url.replace(/^https?:\/\//, ''))}</div>
      </div>
      <div class="provider-actions">
        <button class="icon-btn" data-action="edit-provider" data-pid="${p.id}">✎</button>
        <button class="icon-btn del" data-action="del-provider" data-pid="${p.id}">✕</button>
      </div>
    </div>`;
    }).join('');
}

function renderConversations() {
    const el = document.getElementById('conversationList');
    if (!State.conversations.length) {
        el.innerHTML = '<div style="padding:10px;font-family:\'Share Tech Mono\',monospace;font-size:10px;color:var(--text-dim);letter-spacing:2px;text-align:center">NO SESSIONS</div>';
        return;
    }
    el.innerHTML = State.conversations.map(c => `
    <div class="conv-item${c.id === State.activeConvId ? ' active' : ''}" data-cid="${c.id}">
      <button class="conv-delete" data-action="del-conv" data-cid="${c.id}">×</button>
      <div class="conv-title">${Utils.esc(c.title)}</div>
      <div class="conv-meta">${c.messages.length} MSG · ${Utils.formatDate(c.createdAt)}</div>
    </div>
  `).join('');
}

function renderMessages() {
    const area = document.getElementById('chatArea');
    const conv = State.getConversation();

    if (!conv || !conv.messages.length) {
        area.innerHTML = `<div class="empty-state">
      <div class="empty-geo"><svg viewBox="0 0 120 120" fill="none">
        <polygon points="60,5 115,32.5 115,87.5 60,115 5,87.5 5,32.5" stroke="#dfdad9" stroke-width="1"/>
        <polygon points="60,20 100,40 100,80 60,100 20,80 20,40" stroke="#cecacd" stroke-width="1"/>
        <polygon points="60,35 85,47.5 85,72.5 60,85 35,72.5 35,47.5" stroke="#f15a3f" stroke-width="1" opacity="0.5"/>
        <circle cx="60" cy="60" r="8" stroke="#f15a3f" stroke-width="1"/>
        <circle cx="60" cy="60" r="3" fill="#f15a3f" opacity="0.6"/>
      </svg></div>
      <div class="empty-text">AWAITING INPUT</div>
    </div>`;
        return;
    }

    let html = '';
    // Insert divider before first message
    html += insertDividerHtml(-1);

    conv.messages.forEach((m, i) => {
        html += buildMessageHtml(m, i, i === conv.messages.length - 1);
        html += insertDividerHtml(i);
    });

    area.innerHTML = html;
    if (State.shouldAutoScroll) area.scrollTop = area.scrollHeight;
}

function insertDividerHtml(afterIndex) {
    return `<div class="insert-divider">
    <button class="insert-btn" data-action="insert-msg" data-after="${afterIndex}">＋ INSERT</button>
  </div>`;
}

function buildMessageHtml(m, idx, isLast) {
    const isUser = m.role === 'user';
    const isAsst = m.role === 'assistant';
    const isSys = m.role === 'system';

    const avatarHtml = isUser
        ? `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#f5a623" stroke-width="1" fill="rgba(245,166,35,0.08)"/><circle cx="16" cy="16" r="3" fill="#f5a623" opacity="0.8"/></svg>`
        : isAsst
            ? `<svg viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" stroke="#f15a3f" stroke-width="1" fill="rgba(241,90,63,0.07)"/><circle cx="16" cy="16" r="4" stroke="#f15a3f" stroke-width="1"/><circle cx="16" cy="16" r="1.5" fill="#f15a3f" opacity="0.8"/></svg>`
            : `<svg viewBox="0 0 32 32" fill="none"><polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#9b8ac4" stroke-width="1" fill="rgba(155,138,196,0.08)"/><circle cx="16" cy="16" r="3" fill="#9b8ac4" opacity="0.8"/></svg>`;

    const roleLabel = isUser ? 'USER' : isAsst ? 'ASSISTANT' : 'SYSTEM';
    const thinkHtml = m.thinking
        ? `<div class="thinking-block"><div class="thinking-label">// CHAIN OF THOUGHT</div><div class="thinking-body">${Utils.formatContent(m.thinking)}</div></div>`
        : '';

    const imagesHtml = m.images?.length
        ? `<div class="message-images">${m.images.map((d, i) => `<img class="message-image-thumb" src="${d}" alt="" data-action="lightbox" data-src="${Utils.esc(d)}">`).join('')}</div>`
        : '';

    const text = Utils.extractText(m.content);

    const regenBtn = `<button class="msg-btn regen" data-action="regen-from" data-idx="${idx}" data-role="${m.role}">↺ REGEN</button>`;

    return `<div class="message ${m.role}" data-mid="${m.id}">
    <div class="message-avatar">${avatarHtml}</div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-role role-${m.role}">${roleLabel}</span>
        <span class="message-time">${Utils.formatTime(m.time)}</span>
      </div>
      ${thinkHtml}
      <div class="message-body">
        ${imagesHtml}
        <span class="msg-text">${Utils.formatContent(text)}</span>
      </div>
      <div class="message-actions">
        <button class="msg-btn" data-action="copy-msg" data-idx="${idx}">⎘ COPY</button>
        <button class="msg-btn" data-action="edit-msg" data-idx="${idx}">✎ EDIT</button>
        <button class="msg-btn del" data-action="del-msg" data-idx="${idx}">✕ DEL</button>
        ${regenBtn}
      </div>
    </div>
  </div>`;
}

function renderPromptList() {
    const list = document.getElementById('promptList');
    if (!State.prompts.length) {
        list.innerHTML = '<div style="font-family:\'Share Tech Mono\',monospace;font-size:9px;color:var(--text-dim);padding:4px;letter-spacing:1px">NO SAVED PROMPTS</div>';
    } else {
        list.innerHTML = State.prompts.map(p => `
      <div class="prompt-item${p.id === State.activePromptId ? ' active' : ''}" data-pid="${p.id}" data-action="use-prompt" style="position:relative">
        <div style="flex:1;min-width:0">
          <div class="prompt-name">${Utils.esc(p.name)}</div>
          <div class="prompt-preview">${Utils.esc((p.content || '(blank)').slice(0, 60))}</div>
        </div>
        <div class="prompt-actions">
          <button class="icon-btn del" data-action="del-prompt" data-pid="${p.id}">✕</button>
        </div>
      </div>
    `).join('');
    }

    // Builtin
    const bl = document.getElementById('builtinPromptList');
    bl.innerHTML = Config.BUILTIN_PROMPTS.map((p, i) => `
    <div class="prompt-item" data-action="use-builtin" data-bi="${i}">
      <div style="flex:1;min-width:0">
        <div class="prompt-name">${Utils.esc(p.name)}</div>
        <div class="prompt-preview">${Utils.esc((p.content || '(blank)').slice(0, 55))}</div>
      </div>
    </div>
  `).join('');
}

function updateAttachBtn() {
    const p = State.getProvider();
    const btn = document.getElementById('attachBtn');
    const vis = p?.supportsVision || false;
    State.visionEnabled = vis;
    btn.classList.toggle('vision-enabled', vis);
}

function updateProviderBadge() {
    const p = State.getProvider();
    const dot = document.getElementById('statusDot');
    const badge = document.getElementById('activeBadge');
    if (!p) {
        dot.classList.add('offline');
        document.getElementById('statusText').textContent = 'NO PROVIDER';
        badge.style.display = 'none';
        return;
    }
    badge.style.display = 'inline-flex';
    document.getElementById('badgeName').textContent = p.name;
    document.getElementById('badgeProto').textContent = p.proto.toUpperCase();
    document.getElementById('badgeVision').style.display = p.supportsVision ? 'inline' : 'none';
}

function updatePendingImagesBar() {
    const bar = document.getElementById('pendingImagesBar');
    const btn = document.getElementById('attachBtn');
    const images = State.pendingImages;
    if (!images.length) {
        bar.classList.remove('has-images');
        bar.innerHTML = '<span class="pending-images-label">ATTACHED:</span>';
        btn.classList.remove('has-images');
        return;
    }
    bar.classList.add('has-images');
    btn.classList.add('has-images');
    bar.innerHTML = `<span class="pending-images-label">ATTACHED:</span>
    ${images.map((d, i) => `<div class="pending-image-item">
      <img class="pending-image-thumb" src="${d}">
      <button class="pending-image-remove" data-action="rm-img" data-i="${i}">×</button>
    </div>`).join('')}`;
}

// ════════════════════════════════════════════════════════════════════════
// INLINE MESSAGE EDITING
// ════════════════════════════════════════════════════════════════════════
function startEditMessage(idx) {
    const conv = State.getConversation();
    if (!conv) return;
    const m = conv.messages[idx];
    State.editingMsgIdx = idx;

    // Reuse insert modal
    document.getElementById('insertModalTitle').textContent = `EDIT ${m.role.toUpperCase()} MESSAGE`;
    document.getElementById('insertContent').value = Utils.extractText(m.content || '');
    document.getElementById('confirmInsertBtn').textContent = 'SAVE';

    // Set role selector to match message role, disable changing it
    document.querySelectorAll('#insertRoleRow .role-option').forEach(o => {
        o.className = 'role-option';
        if (o.dataset.role === m.role) o.classList.add(`selected-${m.role}`);
    });
    document.getElementById('insertRoleRow').dataset.locked = 'true';
    document.getElementById('systemMsgNote').style.display = m.role === 'system' ? 'block' : 'none';

    // Add regen button dynamically if last assistant message
    let regenBtn = document.getElementById('editRegenBtn');
    const isLastAsst = m.role === 'assistant' && idx === conv.messages.length - 1;
    if (!regenBtn) {
        regenBtn = document.createElement('button');
        regenBtn.id = 'editRegenBtn';
        regenBtn.className = 'btn btn-sm';
        regenBtn.style.cssText = 'border-color:var(--accent3);color:var(--accent3)';
        regenBtn.textContent = 'SAVE + REGEN';
        regenBtn.addEventListener('click', () => confirmEditMessage(true));
        document.getElementById('insertModal').querySelector('.modal-footer').prepend(regenBtn);
    }
    regenBtn.style.display = isLastAsst ? 'flex' : 'none';

    document.getElementById('insertModal').classList.add('open');
    document.getElementById('insertContent').focus();
}



// ════════════════════════════════════════════════════════════════════════
// CONVERSATION ACTIONS
// ════════════════════════════════════════════════════════════════════════
function newConversation() {
    const c = { id: Utils.id(), title: 'NEW SESSION', messages: [], createdAt: new Date().toISOString() };
    State.conversations.unshift(c);
    State.activeConvId = c.id;
    State.save();
    renderConversations();
    renderMessages();
}

function selectConversation(id) {
    State.activeConvId = id;
    renderConversations();
    renderMessages();
}

async function deleteConversation(id) {
    const c = State.conversations.find(x => x.id === id);
    const ok = await showConfirm(`DELETE SESSION\n"${c?.title || id}"?`);
    if (!ok) return;
    State.conversations = State.conversations.filter(x => x.id !== id);
    if (State.activeConvId === id) State.activeConvId = State.conversations[0]?.id || null;
    State.save();
    renderConversations();
    renderMessages();
}

async function clearAllConversations() {
    const ok = await showConfirm('CLEAR ALL SESSIONS?\nThis cannot be undone.');
    if (!ok) return;
    State.conversations = [];
    State.activeConvId = null;
    State.save();
    renderConversations();
    renderMessages();
}

async function deleteMessage(idx) {
    const conv = State.getConversation();
    if (!conv) return;
    const role = conv.messages[idx]?.role?.toUpperCase() || 'MSG';
    const preview = Utils.extractText(conv.messages[idx]?.content || '').slice(0, 60);
    const ok = await showConfirm(`DELETE ${role} MESSAGE?\n"${preview}${preview.length >= 60 ? '…' : ''}"`);
    if (!ok) return;
    conv.messages.splice(idx, 1);
    State.save();
    renderMessages();
}
// ════════════════════════════════════════════════════════════════════════
// INSERT MESSAGE
// ════════════════════════════════════════════════════════════════════════
function openInsertModal(afterIndex) {
    State.insertAfterIndex = afterIndex;
    State.insertRole = 'user';
    document.getElementById('insertContent').value = '';
    document.getElementById('insertModalTitle').textContent = afterIndex === -1 ? 'INSERT AT START' : `INSERT AFTER MSG ${afterIndex + 1}`;
    // Reset role UI
    document.querySelectorAll('#insertRoleRow .role-option').forEach(o => {
        o.className = 'role-option';
        if (o.dataset.role === 'user') o.classList.add('selected-user');
    });
    document.getElementById('systemMsgNote').style.display = 'none';
    document.getElementById('insertRoleRow').dataset.locked = '';
    document.getElementById('insertModal').classList.add('open');
    document.getElementById('insertContent').focus();
}

function confirmInsert() {
    if (State.editingMsgIdx !== null) {
        confirmEditMessage(false);
        return;
    }
    const conv = State.getConversation();
    if (!conv) { toast('Start a conversation first', true); return; }
    const content = document.getElementById('insertContent').value.trim();
    if (!content) { toast('Content is empty', true); return; }

    const m = newMessage(State.insertRole, content);
    conv.messages.splice(State.insertAfterIndex + 1, 0, m);
    if (conv.title === 'NEW SESSION' && conv.messages.length === 1) conv.title = content.slice(0, 40);


    State.save();
    document.getElementById('insertModal').classList.remove('open');
    renderMessages();
    renderConversations();
}

function confirmEditMessage(thenRegen) {
    const conv = State.getConversation();
    if (!conv) return;
    const idx = State.editingMsgIdx;
    const content = document.getElementById('insertContent').value.trim();
    if (!content) { toast('Content is empty', true); return; }

    conv.messages[idx].content = content;
    conv.messages[idx].thinking = '';

    if (thenRegen) conv.messages.splice(idx + 1);

    State.editingMsgIdx = null;
    document.getElementById('confirmInsertBtn').textContent = 'INSERT';
    const regenBtn = document.getElementById('editRegenBtn');
    if (regenBtn) regenBtn.style.display = 'none';

    State.save();
    document.getElementById('insertModal').classList.remove('open');
    renderMessages();
    renderConversations();

    if (thenRegen) runAssistant(conv);
}
// ════════════════════════════════════════════════════════════════════════
// SEND / STREAM
// ════════════════════════════════════════════════════════════════════════
async function sendMessage() {
    if (State.isStreaming) return;
    const inputEl = document.getElementById('messageInput');
    const text = inputEl.value.trim();
    if (!text && !State.pendingImages.length) return;

    const model = document.getElementById('modelSelect').value;
    if (!model) { toast('Select a model first', true); return; }
    const provider = State.getProvider();
    if (!provider) { toast('No active provider', true); return; }

    let conv;
    if (State.anonymousMode) {
        // 内存临时会话，不推入 State.conversations，不持久化
        conv = { id: Utils.id(), title: 'ANON', messages: [], createdAt: new Date().toISOString() };
        State.activeConvId = conv.id; // 让 runAssistant 里的 renderMessages/renderConversations 不崩
        State._anonConv = conv;       // 挂在 State 上供 runAssistant 取用
    } else {
        if (!State.activeConvId) newConversation();
        conv = State.getConversation();
    }
    const images = [...State.pendingImages];
    State.pendingImages = [];

    conv.messages.push(newMessage('user', text, images));
    if (conv.title === 'NEW SESSION') {
        const src = text || (images.length ? '[image]' : '');
        conv.title = src.slice(0, 42) + (src.length > 42 ? '…' : '');
    }

    State.save();
    inputEl.value = '';
    inputEl.style.height = Config.MIN_INPUT_HEIGHT_PX + 'px';
    renderConversations();
    renderMessages();
    updatePendingImagesBar();

    await runAssistant(conv);
}

async function runAssistant(conv) {
    const provider = State.getProvider();
    const model = document.getElementById('modelSelect').value;
    if (!provider || !model) return;

    const params = readParams();
    const systemPrompt = document.getElementById('systemPrompt').value.trim();

    conv.messages.push(newMessage('assistant', '', null, ''));
    renderMessages();

    State.abortController = new AbortController();
    State.isStreaming = true;
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('stopBtn').classList.add('visible');

    const wireMessages = buildWireMessages(conv, systemPrompt, provider.proto);
    let finalContent = '', finalThinking = '';

    const onChunk = ({ content, thinking }) => {
        finalContent = content;
        finalThinking = thinking || '';
        updateLastMessageInDOM(content, thinking || '');
    };

    try {
        params.signal = State.abortController.signal;
        if (provider.proto === 'ollama') {
            await API.streamOllama(provider, model, wireMessages, params, onChunk);
        } else {
            const res = await API.streamOpenAI(provider, model, wireMessages, params, onChunk);
            if (res) { finalContent = res.rawContent; finalThinking = res.reasoningContent || ''; }
        }
    } catch (err) {
        const last = conv.messages[conv.messages.length - 1];
        if (err.name === 'AbortError') {
            if (!last.content && !last.thinking) last.content = '⊘ STOPPED';
            toast('⊘ STOPPED');
        } else {
            last.content = '✕ ERROR: ' + err.message;
            toast('✕ ' + err.message, true);
        }
    } finally {
        const last = conv.messages[conv.messages.length - 1];
        last.content = finalContent;
        last.thinking = finalThinking;
        State.abortController = null;
        State.isStreaming = false;
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('stopBtn').classList.remove('visible');
        if (!State.anonymousMode) State.save();
        renderMessages();
        if (!State.anonymousMode) renderConversations();
        setTimeout(() => { if (!State.isStreaming) document.getElementById('tokenCount').textContent = 'TOKENS: —'; }, Config.TOKEN_DISPLAY_RESET_MS);
    }
}

function updateLastMessageInDOM(content, thinking) {
    const area = document.getElementById('chatArea');
    const bubbles = area.querySelectorAll('.message');
    const last = bubbles[bubbles.length - 1];
    if (!last) return;

    const bodyEl = last.querySelector('.message-body');
    if (bodyEl) bodyEl.innerHTML = Utils.formatContent(content) + '<span class="cursor"></span>';

    if (thinking) {
        let thinkEl = last.querySelector('.thinking-block');
        if (!thinkEl) {
            thinkEl = document.createElement('div');
            thinkEl.className = 'thinking-block';
            bodyEl.parentNode.insertBefore(thinkEl, bodyEl);
        }
        thinkEl.innerHTML = `<div class="thinking-label">// CHAIN OF THOUGHT</div><div class="thinking-body">${Utils.formatContent(thinking)}</div>`;
    }

    if (State.shouldAutoScroll) area.scrollTop = area.scrollHeight;
    const total = (content?.length || 0) + (thinking?.length || 0);
    document.getElementById('tokenCount').textContent = `TOKENS: ~${Math.ceil(total / Config.APPROX_CHARS_PER_TOKEN)}`;
}

function readParams() {
    return {
        temperature: parseFloat(document.getElementById('tempSlider').value),
        topP: parseFloat(document.getElementById('topPSlider').value),
        topK: parseInt(document.getElementById('topKSlider').value) || 0,
        freqPen: parseFloat(document.getElementById('freqPenSlider').value),
        presPen: parseFloat(document.getElementById('presPenSlider').value),
        maxTokens: parseInt(document.getElementById('maxTokens').value) || null,
        seed: document.getElementById('seedInput').value !== '' ? parseInt(document.getElementById('seedInput').value) : null,
        stopSeqs: Utils.parseStopSeqs(document.getElementById('stopSeqInput').value),
        streamEnabled: State.streamEnabled,
    };
}

async function regenerateLast() {
    if (State.isStreaming) return;
    const conv = State.getConversation();
    if (!conv || conv.messages.length < 2) return;
    if (conv.messages[conv.messages.length - 1].role !== 'assistant') return;
    conv.messages.pop();
    State.save();
    renderMessages();
    await runAssistant(conv);
}

// ════════════════════════════════════════════════════════════════════════
// PROVIDER ACTIONS
// ════════════════════════════════════════════════════════════════════════
function openProviderModal(editId = null) {
    State.editingProvider = editId;
    document.getElementById('modalTitle').textContent = editId ? 'EDIT PROVIDER' : 'ADD PROVIDER';
    if (editId) {
        const p = State.providers.find(x => x.id === editId);
        if (p) {
            document.getElementById('providerName').value = p.name;
            document.getElementById('providerUrl').value = p.url;
            document.getElementById('providerKey').value = p.key || '';
            setProto(p.proto);
            setVisionToggle(!!p.supportsVision);
        }
    } else {
        document.getElementById('providerName').value = '';
        document.getElementById('providerUrl').value = '';
        document.getElementById('providerKey').value = '';
        setProto('ollama');
        setVisionToggle(false);
    }
    renderPresetGrid();
    document.getElementById('providerModal').classList.add('open');
    document.getElementById('providerName').focus();
}

function renderPresetGrid() {
    document.getElementById('presetGrid').innerHTML = Config.PROVIDER_PRESETS.map((p, i) => `
    <div class="preset-chip" data-pi="${i}" title="${p.url}">
      <span class="chip-name">${Utils.esc(p.name)}</span>
      <span class="chip-tag">${p.tag}</span>
    </div>`).join('');
}

function applyPreset(i) {
    const p = Config.PROVIDER_PRESETS[i];
    document.getElementById('providerName').value = p.name;
    document.getElementById('providerUrl').value = p.url;
    setProto(p.proto);
    document.querySelectorAll('.preset-chip').forEach((c, j) => {
        c.style.borderColor = j === i ? 'var(--accent2)' : '';
        c.style.color = j === i ? 'var(--accent2)' : '';
    });
    document.getElementById('providerKey').focus();
}

function setProto(proto) {
    State.selectedProto = proto;
    document.getElementById('protoOllama').classList.toggle('selected', proto === 'ollama');
    document.getElementById('protoOpenai').classList.toggle('selected', proto === 'openai');
    document.getElementById('protoHint').textContent = Config.PROTO_HINTS[proto];
}

function setVisionToggle(on) {
    const row = document.getElementById('visionToggleRow');
    const ind = document.getElementById('visionCheckIndicator');
    document.getElementById('providerVision').checked = on;
    ind.textContent = on ? '✓' : '';
    row.classList.toggle('enabled', on);
}

async function saveProvider() {
    const name = document.getElementById('providerName').value.trim();
    const url = document.getElementById('providerUrl').value.trim().replace(/\/$/, '');
    const key = document.getElementById('providerKey').value.trim();
    const vis = document.getElementById('providerVision').checked;
    if (!name) { toast('Enter a name', true); return; }
    if (!url) { toast('Enter a URL', true); return; }

    if (State.editingProvider) {
        const idx = State.providers.findIndex(p => p.id === State.editingProvider);
        if (idx >= 0) State.providers[idx] = { ...State.providers[idx], name, url, key, proto: State.selectedProto, supportsVision: vis };
    } else {
        State.providers.push({ id: Utils.id(), name, url, key, proto: State.selectedProto, supportsVision: vis, lastModel: null });
    }

    State.save();
    document.getElementById('providerModal').classList.remove('open');
    renderProviders();
    updateAttachBtn();
    if (State.providers.length === 1) activateProvider(State.providers[0].id);
}

async function deleteProvider(id) {
    const p = State.providers.find(x => x.id === id);
    const ok = await showConfirm(`DELETE PROVIDER\n"${p?.name || id}"?`);
    if (!ok) return;
    State.providers = State.providers.filter(x => x.id !== id);
    if (State.activeProviderId === id) State.activeProviderId = State.providers[0]?.id || null;
    State.save();
    renderProviders();
    if (State.activeProviderId) activateProvider(State.activeProviderId);
    else { document.getElementById('statusDot').classList.add('offline'); document.getElementById('statusText').textContent = 'NO PROVIDER'; updateAttachBtn(); updateProviderBadge(); }
}

async function activateProvider(id) {
    State.activeProviderId = id;
    State.pendingImages = [];
    State.save();
    renderProviders();
    updateAttachBtn();
    updateProviderBadge();
    await loadModels();
}

async function loadModels() {
    const p = State.getProvider();
    if (!p) return;
    document.getElementById('modelSelect').innerHTML = '<option>LOADING...</option>';
    document.getElementById('statusDot').classList.add('offline');
    document.getElementById('statusText').textContent = 'CONNECTING...';
    document.getElementById('activeBadge').style.display = 'none';
    try {
        const models = await API.fetchModels(p);
        document.getElementById('modelSelect').innerHTML = models.length
            ? models.map(m => `<option value="${Utils.esc(m)}">${Utils.esc(m)}</option>`).join('')
            : '<option value="">No models found</option>';

        // 恢复上次选中的 model
        if (p?.lastModel && models.includes(p.lastModel)) {
            document.getElementById('modelSelect').value = p.lastModel;
        }
        document.getElementById('statusDot').classList.remove('offline');
        document.getElementById('statusText').textContent = `${models.length} MODELS`;
        updateProviderBadge();
        toast(`◈ ${p.name}: ${models.length} models`);
    } catch (err) {
        document.getElementById('statusDot').classList.add('offline');
        document.getElementById('statusText').textContent = 'CONNECT FAILED';
        toast('✕ ' + err.message, true);
    }
}

// ════════════════════════════════════════════════════════════════════════
// PROMPT LIBRARY
// ════════════════════════════════════════════════════════════════════════
function usePrompt(id) {
    const p = State.prompts.find(x => x.id === id);
    if (!p) return;
    State.activePromptId = id;
    document.getElementById('systemPrompt').value = p.content;
    document.getElementById('activePromptName').textContent = p.name;
    renderPromptList();
    switchTab('params');
}

function useBuiltinPrompt(i) {
    const p = Config.BUILTIN_PROMPTS[i];
    State.activePromptId = null;
    document.getElementById('systemPrompt').value = p.content;
    document.getElementById('activePromptName').textContent = p.name;
    renderPromptList();
    switchTab('params');
}

function saveCurrentPrompt() {
    const name = document.getElementById('newPromptName').value.trim();
    const content = document.getElementById('systemPrompt').value;
    if (!name) { toast('Enter a name', true); return; }
    const p = { id: Utils.id(), name, content };
    State.prompts.unshift(p);
    State.activePromptId = p.id;
    document.getElementById('activePromptName').textContent = name;
    State.save();
    document.getElementById('newPromptName').value = '';
    document.getElementById('promptAddForm').style.display = 'none';
    renderPromptList();
    toast('✓ Prompt saved');
}

async function deletePrompt(id) {
    const ok = await showConfirm('DELETE SAVED PROMPT?');
    if (!ok) return;
    State.prompts = State.prompts.filter(p => p.id !== id);
    if (State.activePromptId === id) { State.activePromptId = null; document.getElementById('activePromptName').textContent = ''; }
    State.save();
    renderPromptList();
}

// ════════════════════════════════════════════════════════════════════════
// IMAGE HANDLING
// ════════════════════════════════════════════════════════════════════════
async function addImages(files) {
    for (const f of Array.from(files)) {
        if (State.pendingImages.length >= Config.MAX_PENDING_IMAGES) break;
        try {
            const d = await ImageSvc.compress(f);
            State.pendingImages.push(d);
            updatePendingImagesBar();
            toast(`🖼 Image attached (${State.pendingImages.length}/${Config.MAX_PENDING_IMAGES})`);
        } catch { toast('✕ Image failed', true); }
    }
}

// ════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ════════════════════════════════════════════════════════════════════════
function switchTab(name) {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.getElementById('tabParams').style.display = name === 'params' ? 'block' : 'none';
    document.getElementById('tabPrompts').style.display = name === 'prompts' ? 'block' : 'none';
}

function showConfirm(msg) {
    return new Promise(resolve => {
        document.getElementById('confirmMsg').textContent = msg;
        const overlay = document.getElementById('confirmModal');
        overlay.classList.add('open');

        const yes = document.getElementById('confirmYes');
        const no = document.getElementById('confirmNo');
        const can = document.getElementById('confirmCancel');

        const cleanup = (val) => {
            overlay.classList.remove('open');
            yes.removeEventListener('click', onYes);
            no.removeEventListener('click', onNo);
            can.removeEventListener('click', onNo);
            resolve(val);
        };

        const onYes = () => cleanup(true);
        const onNo = () => cleanup(false);
        yes.addEventListener('click', onYes);
        no.addEventListener('click', onNo);
        can.addEventListener('click', onNo);
    });
}

function toast(msg, isError = false) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const el = document.createElement('div');
    el.className = 'toast';
    el.style.borderColor = isError ? 'var(--danger)' : 'var(--accent2)';
    el.style.color = isError ? 'var(--danger)' : 'var(--accent2)';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), Config.TOAST_DISPLAY_MS);
}

async function copyText(idx) {
    const conv = State.getConversation();
    if (!conv?.messages[idx]) return;
    const text = Utils.extractText(conv.messages[idx].content);
    try { await navigator.clipboard.writeText(text); toast('✓ COPIED'); }
    catch { toast('✕ Copy failed', true); }
}

function stopStreaming() {
    if (State.abortController) { State.abortController.abort(); }
}

// ════════════════════════════════════════════════════════════════════════
// EVENT WIRING
// ════════════════════════════════════════════════════════════════════════
function initEvents() {
    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(t => {
        t.addEventListener('click', () => switchTab(t.dataset.tab));
    });

    // Slider labels
    const sliders = {
        tempSlider: 'tempVal',
        topPSlider: 'topPVal',
        topKSlider: 'topKVal',
        freqPenSlider: 'freqPenVal',
        presPenSlider: 'presPenVal',
    };
    Object.entries(sliders).forEach(([id, valId]) => {
        const el = document.getElementById(id);
        const val = document.getElementById(valId);
        el.addEventListener('input', () => {
            const n = parseFloat(el.value);
            val.textContent = Number.isInteger(n) ? n : n.toFixed(2);
        });
    });

    // Reset params
    document.getElementById('resetParamsBtn').addEventListener('click', () => {
        document.getElementById('tempSlider').value = 0.7; document.getElementById('tempVal').textContent = '0.70';
        document.getElementById('topPSlider').value = 1; document.getElementById('topPVal').textContent = '1.00';
        document.getElementById('topKSlider').value = 0; document.getElementById('topKVal').textContent = '—';
        document.getElementById('freqPenSlider').value = 0; document.getElementById('freqPenVal').textContent = '0.00';
        document.getElementById('presPenSlider').value = 0; document.getElementById('presPenVal').textContent = '0.00';
        document.getElementById('maxTokens').value = '';
        document.getElementById('seedInput').value = '';
        document.getElementById('stopSeqInput').value = '';
        toast('↺ PARAMS RESET');
    });
    // Top K: show — when 0
    document.getElementById('topKSlider').addEventListener('input', function () {
        document.getElementById('topKVal').textContent = this.value === '0' ? '—' : this.value;
    });



    // Stream toggle
    document.getElementById('streamToggle').addEventListener('click', () => {
        State.streamEnabled = !State.streamEnabled;
        const el = document.getElementById('streamToggle');
        el.classList.toggle('enabled', State.streamEnabled);
    });
    // Anonymous mode toggle
    document.getElementById('anonToggle').addEventListener('click', () => {
        State.anonymousMode = !State.anonymousMode;
        State._anonConv = null;
        document.getElementById('anonToggle').classList.toggle('enabled', State.anonymousMode);
        toast(State.anonymousMode ? '◈ ANON MODE ON' : '◈ ANON MODE OFF');
    });

    // Providers
    document.getElementById('addProviderBtn').addEventListener('click', () => openProviderModal());
    document.getElementById('closeProviderModal').addEventListener('click', () => document.getElementById('providerModal').classList.remove('open'));
    document.getElementById('cancelProviderModal').addEventListener('click', () => document.getElementById('providerModal').classList.remove('open'));
    document.getElementById('saveProviderBtn').addEventListener('click', saveProvider);

    document.getElementById('providerModal').addEventListener('click', e => {
        if (e.target.id === 'providerModal') document.getElementById('providerModal').classList.remove('open');
    });

    document.getElementById('presetGrid').addEventListener('click', e => {
        const c = e.target.closest('.preset-chip');
        if (c) applyPreset(parseInt(c.dataset.pi));
    });

    document.getElementById('protoOllama').addEventListener('click', () => setProto('ollama'));
    document.getElementById('protoOpenai').addEventListener('click', () => setProto('openai'));

    document.getElementById('visionToggleRow').addEventListener('click', () => {
        const cb = document.getElementById('providerVision');
        setVisionToggle(!cb.checked);
    });

    // Provider list
    document.getElementById('providerList').addEventListener('click', e => {
        const edit = e.target.closest('[data-action="edit-provider"]');
        const del = e.target.closest('[data-action="del-provider"]');
        const item = e.target.closest('.provider-item');
        if (edit) { e.stopPropagation(); openProviderModal(edit.dataset.pid); }
        else if (del) { e.stopPropagation(); deleteProvider(del.dataset.pid); }
        else if (item) activateProvider(item.dataset.pid);
    });

    // Model select
    document.getElementById('modelSelect').addEventListener('change', function () {
        const p = State.getProvider();
        if (!p) return;
        p.lastModel = this.value;
        State.save();
    });

    // Conversation list
    document.getElementById('conversationList').addEventListener('click', e => {
        const del = e.target.closest('[data-action="del-conv"]');
        const item = e.target.closest('.conv-item');
        if (del) { e.stopPropagation(); deleteConversation(del.dataset.cid); }
        else if (item) selectConversation(item.dataset.cid);
    });

    document.getElementById('newConvBtn').addEventListener('click', newConversation);
    document.getElementById('clearConvsBtn').addEventListener('click', clearAllConversations);

    // Chat area (event delegation)
    document.getElementById('chatArea').addEventListener('click', e => {
        const t = e.target;
        if (t.closest('[data-action="insert-msg"]')) {
            const btn = t.closest('[data-action="insert-msg"]');
            openInsertModal(parseInt(btn.dataset.after));
        } else if (t.closest('[data-action="copy-msg"]')) {
            copyText(parseInt(t.closest('[data-action="copy-msg"]').dataset.idx));
        } else if (t.closest('[data-action="edit-msg"]')) {
            startEditMessage(parseInt(t.closest('[data-action="edit-msg"]').dataset.idx));
        } else if (t.closest('[data-action="del-msg"]')) {
            deleteMessage(parseInt(t.closest('[data-action="del-msg"]').dataset.idx));
        } else if (t.closest('[data-action="regen-from"]')) {
            const btn = t.closest('[data-action="regen-from"]');
            const idx = parseInt(btn.dataset.idx);
            const role = btn.dataset.role;
            const conv = State.getConversation();
            if (!conv) return;
            if (role === 'assistant') {
                // remove this message and everything after
                conv.messages.splice(idx);
            } else {
                // user message: keep it, remove everything after
                conv.messages.splice(idx + 1);
            }
            State.save();
            renderMessages();
            runAssistant(conv);
        } else if (t.closest('[data-action="lightbox"]')) {

            const img = t.closest('[data-action="lightbox"]');
            document.getElementById('lightboxImg').src = img.dataset.src;
            document.getElementById('lightboxOverlay').classList.add('open');
        }
    });

    // Pending images
    document.getElementById('pendingImagesBar').addEventListener('click', e => {
        const btn = e.target.closest('[data-action="rm-img"]');
        if (btn) { State.pendingImages.splice(parseInt(btn.dataset.i), 1); updatePendingImagesBar(); }
    });

    // Input
    const msgInput = document.getElementById('messageInput');
    msgInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    msgInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, Config.MAX_INPUT_HEIGHT_PX) + 'px';
    });
    msgInput.addEventListener('paste', e => {
        if (!State.visionEnabled || !e.clipboardData) return;
        const imgs = Array.from(e.clipboardData.items).filter(i => i.type.startsWith('image/'));
        imgs.forEach(item => { const f = item.getAsFile(); if (f) addImages([f]); });
    });

    document.getElementById('attachBtn').addEventListener('click', () => document.getElementById('imageFileInput').click());
    document.getElementById('imageFileInput').addEventListener('change', e => { addImages(e.target.files); e.target.value = ''; });
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('stopBtn').addEventListener('click', stopStreaming);

    // Auto-scroll
    const chatArea = document.getElementById('chatArea');
    chatArea.addEventListener('wheel', e => { if (e.deltaY < 0) State.shouldAutoScroll = false; }, { passive: true });
    chatArea.addEventListener('scroll', () => {
        const dist = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight;
        if (dist < Config.AUTO_SCROLL_THRESHOLD_PX) State.shouldAutoScroll = true;
    }, { passive: true });

    // Lightbox
    document.getElementById('lightboxOverlay').addEventListener('click', e => {
        if (e.target.id === 'lightboxOverlay' || e.target.id === 'lightboxClose') {
            document.getElementById('lightboxOverlay').classList.remove('open');
        }
    });
    document.getElementById('lightboxClose').addEventListener('click', () => {
        document.getElementById('lightboxOverlay').classList.remove('open');
    });

    // Insert modal

    const closeInsertModal = () => {
        State.editingMsgIdx = null;
        document.getElementById('confirmInsertBtn').textContent = 'INSERT';
        document.getElementById('insertRoleRow').dataset.locked = '';
        const regenBtn = document.getElementById('editRegenBtn');
        if (regenBtn) regenBtn.style.display = 'none';
        document.getElementById('insertModal').classList.remove('open');
    };
    document.getElementById('closeInsertModal').addEventListener('click', closeInsertModal);
    document.getElementById('cancelInsertModal').addEventListener('click', closeInsertModal);

    document.getElementById('confirmInsertBtn').addEventListener('click', confirmInsert);
    document.getElementById('insertModal').addEventListener('click', e => {
        if (e.target.id === 'insertModal') {
            State.editingMsgIdx = null;
            document.getElementById('confirmInsertBtn').textContent = 'INSERT';
            document.getElementById('insertModal').classList.remove('open');
        }
    });
    document.getElementById('insertContent').addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.ctrlKey) confirmInsert();
    });

    // Insert role selector
    document.getElementById('insertRoleRow').addEventListener('click', e => {
        if (document.getElementById('insertRoleRow').dataset.locked === 'true') return;
        const opt = e.target.closest('.role-option');
        if (!opt) return;
        State.insertRole = opt.dataset.role;
        document.querySelectorAll('#insertRoleRow .role-option').forEach(o => {
            o.className = 'role-option';
            if (o === opt) o.classList.add(`selected-${opt.dataset.role}`);
        });

        document.getElementById('systemMsgNote').style.display = State.insertRole === 'system' ? 'block' : 'none';
    });

    // Prompt panel
    document.getElementById('showAddPromptBtn').addEventListener('click', () => {
        document.getElementById('promptAddForm').style.display = 'flex';
        document.getElementById('newPromptName').focus();
    });
    document.getElementById('cancelAddPrompt').addEventListener('click', () => {
        document.getElementById('promptAddForm').style.display = 'none';
    });
    document.getElementById('confirmAddPrompt').addEventListener('click', saveCurrentPrompt);

    document.getElementById('promptList').addEventListener('click', e => {
        const del = e.target.closest('[data-action="del-prompt"]');
        const item = e.target.closest('[data-action="use-prompt"]');
        if (del) { e.stopPropagation(); deletePrompt(del.dataset.pid); }
        else if (item) usePrompt(item.dataset.pid);
    });

    document.getElementById('builtinPromptList').addEventListener('click', e => {
        const item = e.target.closest('[data-action="use-builtin"]');
        if (item) useBuiltinPrompt(parseInt(item.dataset.bi));
    });

    // ESC key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.getElementById('lightboxOverlay').classList.remove('open');
            document.getElementById('providerModal').classList.remove('open');

            State.editingMsgIdx = null;
            document.getElementById('confirmInsertBtn').textContent = 'INSERT';
            document.getElementById('insertModal').classList.remove('open');

            document.getElementById('confirmModal').classList.remove('open');
        }
    });
}

// ════════════════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════════════════
function init() {
    // Restore settings
    const s = State.settings;
    if (s.temperature !== undefined) { document.getElementById('tempSlider').value = s.temperature; document.getElementById('tempVal').textContent = Number(s.temperature).toFixed(2); }
    if (s.topP !== undefined) { document.getElementById('topPSlider').value = s.topP; document.getElementById('topPVal').textContent = Number(s.topP).toFixed(2); }
    if (s.maxTokens) document.getElementById('maxTokens').value = s.maxTokens;
    if (s.systemPrompt) document.getElementById('systemPrompt').value = s.systemPrompt;

    // Auto-save settings on change
    ['tempSlider', 'topPSlider', 'topKSlider', 'freqPenSlider', 'presPenSlider', 'maxTokens', 'seedInput', 'stopSeqInput', 'systemPrompt'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            State.settings = {
                temperature: parseFloat(document.getElementById('tempSlider').value),
                topP: parseFloat(document.getElementById('topPSlider').value),
                topK: parseInt(document.getElementById('topKSlider').value),
                freqPen: parseFloat(document.getElementById('freqPenSlider').value),
                presPen: parseFloat(document.getElementById('presPenSlider').value),
                maxTokens: parseInt(document.getElementById('maxTokens').value) || null,
                seed: document.getElementById('seedInput').value || null,
                stopSeqs: document.getElementById('stopSeqInput').value,
                systemPrompt: document.getElementById('systemPrompt').value,
            };
            State.save();
        });
    });

    initEvents();
    renderAll();

    // Activate stored provider
    if (State.activeProviderId && State.providers.find(p => p.id === State.activeProviderId)) {
        activateProvider(State.activeProviderId);
    } else if (State.providers.length > 0) {
        activateProvider(State.providers[0].id);
    }

    // Initial stream toggle state
    document.getElementById('streamToggle').classList.add('enabled');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}