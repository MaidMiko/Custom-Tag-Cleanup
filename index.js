/* Custom Tag Cleanup v0.3 — Manual-only */
(() => {
    if (typeof window === "undefined") global.window = {};
    if (window.__CTC_READY__) return;
    window.__CTC_READY__ = true;

    const MODULE = "customTagCleanup";
    const DEF = {
        preserveSpace: true,
        tagList: [
            "details",
            "Echat",
            "g_pos_track",
            "LP",
            "STATUS",
            "TRK",
            "TimeNa",
            "Time_Na",
            "Thought_na",
            "UI",
            "notif_p",
            "tigger_ev",
        ],
        customRegex: "",
        keepLatest: 3,
        maxPasses: 1,
    };

    function ctx() {
        try {
            return window.SillyTavern?.getContext?.() || null;
        } catch {
            return null;
        }
    }
    function st() {
        const c = ctx(),
            s = c?.extensionSettings || (c.extensionSettings = {});
        if (!s[MODULE]) s[MODULE] = {};
        for (const k in DEF) if (!(k in s[MODULE])) s[MODULE][k] = DEF[k];
        return s[MODULE];
    }
    function save() {
        const c = ctx();
        (c?.saveSettingsDebounced || c?.saveSettings || (() => {})).call(c);
    }
    const estimate = (t) => Math.ceil((t || "").length / 4);

    function regex() {
        const s = st();
        if (s.customRegex?.trim())
            return new RegExp(
                s.customRegex.replace(/^\/|\/[gimsuy]*$/g, ""),
                "gi"
            );
        const n = s.tagList
            .map((x) => x.trim())
            .filter(Boolean)
            .join("|");
        return n
            ? new RegExp(`<(${n})\\b[^>]*>[\\s\\S]*?<\\/\\1>`, "gi")
            : null;
    }

    function strip(text) {
        if (typeof text !== "string" || !text) return { text, removed: 0 };
        const r = regex();
        if (!r) return { text, removed: 0 };
        const fence = /```[\s\S]*?```/g,
            inline = /`[^`]*`/g;
        const B = [],
            I = [];
        let tmp = text
            .replace(fence, (m) => `@@B${B.push(m) - 1}@@`)
            .replace(inline, (m) => `@@I${I.push(m) - 1}@@`);
        let removed = 0;
        for (let i = 0; i < (st().maxPasses || 1); i++) {
            let ch = false;
            tmp = tmp.replace(r, (m, tag, off, str) => {
                removed += m.length;
                ch = true;
                if (!st().preserveSpace) return "";
                const n = str[off + m.length],
                    p = str[off - 1];
                return /\s/.test(p) || /\s/.test(n) ? "" : " ";
            });
            if (!ch) break;
        }
        tmp = tmp
            .replace(/@@I(\d+)@@/g, (_, i) => I[i])
            .replace(/@@B(\d+)@@/g, (_, i) => B[i]);
        return { text: tmp, removed };
    }

    function cleanMsg(m) {
        if (!m) return { removed: 0, saved: 0 };
        const before = [m.mes, m.extra?.display_text, m.extra?.original]
            .filter(Boolean)
            .join("\n");
        const tb = estimate(before);
        const f = ["mes"];
        f.forEach((k) => {
            if (typeof m[k] === "string") {
                const r = strip(m[k]);
                m[k] = r.text;
            }
        });
        if (m.extra) {
            ["display_text", "original"].forEach((k) => {
                if (typeof m.extra[k] === "string") {
                    const r = strip(m.extra[k]);
                    m.extra[k] = r.text;
                }
            });
        }
        const after = [m.mes, m.extra?.display_text, m.extra?.original]
            .filter(Boolean)
            .join("\n");
        return {
            removed: Math.max(0, before.length - after.length),
            saved: Math.max(0, tb - estimate(after)),
        };
    }

    async function refreshHard(idxs = []) {
        const c = ctx(),
            es = c?.eventSource,
            ev = c?.event_types || {};
        try {
            idxs.forEach((i) => {
                const m = c?.chat?.[i];
                if (!m) return;
                if (m.extra) {
                    delete m.extra.display_text_cache;
                    delete m.extra.render_cache;
                    delete m.extra.rendered_html;
                }
                delete m.rendered_html;
                delete m.renderCache;
            });
            es?.emit?.(ev.MESSAGE_EDITED || ev.MESSAGE_LIST_UPDATED, {});
            await (c?.saveChat?.() || Promise.resolve());
            await (c?.renderChat?.(true) || c?.renderChat?.());
            es?.emit?.(ev.MESSAGE_LIST_UPDATED, {});
        } catch {}
    }

    async function cleanAll() {
        const c = ctx();
        if (!c?.chat) return toast("ไม่มีแชท");
        const s = st(),
            chat = c.chat,
            keep = Math.max(0, s.keepLatest | 0),
            lim = Math.max(0, chat.length - keep);
        if (lim === 0) return toast(`มีแชทไม่เกิน ${keep} ข้อความ — ไม่ลบ`);
        let removed = 0,
            saved = 0,
            touched = [];
        for (let i = 0; i < lim; i++) {
            const m = chat[i];
            if (!m) continue;
            const r = cleanMsg(m);
            if (r.removed) {
                removed += r.removed;
                saved += r.saved;
                touched.push(i);
            }
        }
        await refreshHard(touched);
        toast(
            `ลบแล้ว ${removed.toLocaleString()} อักขระ | ประหยัด ~${saved.toLocaleString()} โทเค็น | เว้นล่าสุด ${keep}`
        );
    }

    function toast(msg) {
        if (typeof document === "undefined") return;
        let el = document.getElementById("ctc__toast");
        if (!el) {
            el = document.createElement("div");
            el.id = "ctc__toast";
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = "1";
        clearTimeout(el._t);
        el._t = setTimeout(() => (el.style.opacity = "0"), 1500);
    }

    function ui() {
        if (
            typeof document === "undefined" ||
            document.getElementById("ctc__container")
        )
            return;
        const m =
            document.querySelector(
                ".chat-input-container,.input-group,.send-form,#send_form,.chat-controls,.st-user-input"
            ) || document.body;
        const box = document.createElement("div");
        box.id = "ctc__container";
        const btn = document.createElement("button");
        btn.id = "ctc__btn";
        btn.textContent = "🧹 Clean";
        btn.title = "ลบของเก่าทั้งหมด เหลือล่าสุด N";
        btn.onclick = cleanAll;
        const menu = document.createElement("div");
        menu.id = "ctc__menu";
        let open = false;
        btn.oncontextmenu = (e) => {
            e.preventDefault();
            menu.style.display = open ? "none" : "flex";
            open = !open;
        };
        document.addEventListener("click", (e) => {
            if (!box.contains(e.target)) {
                menu.style.display = "none";
                open = false;
            }
        });
        const s = st();

        const keep = document.createElement("input");
        keep.type = "number";
        keep.min = "0";
        keep.max = "50";
        keep.value = s.keepLatest;
        keep.onchange = () => {
            st().keepLatest = Math.max(0, parseInt(keep.value || "3", 10));
            save();
        };
        const rowK = document.createElement("label");
        rowK.append("Keep Latest: ", keep);

        const tag = document.createElement("textarea");
        tag.placeholder = "รายชื่อแท็ก (บรรทัดละชื่อ)";
        tag.value = s.tagList.join("\n");
        tag.oninput = () => {
            st().tagList = tag.value
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean);
            save();
        };
        const reg = document.createElement("textarea");
        reg.placeholder = "หรือ Custom Regex";
        reg.value = s.customRegex;
        reg.oninput = () => {
            st().customRegex = reg.value.trim();
            save();
        };

        const pass = document.createElement("input");
        pass.type = "number";
        pass.min = "1";
        pass.max = "10";
        pass.value = s.maxPasses;
        pass.onchange = () => {
            st().maxPasses = Math.min(
                10,
                Math.max(1, parseInt(pass.value || "1", 10))
            );
            save();
        };
        const rowP = document.createElement("label");
        rowP.append("Passes: ", pass);

        const sp = document.createElement("input");
        sp.type = "checkbox";
        sp.checked = s.preserveSpace;
        sp.onchange = () => {
            st().preserveSpace = sp.checked;
            save();
        };
        const rowS = document.createElement("label");
        rowS.append(sp, " เว้นช่องไฟ");

        menu.append(rowK, rowP, rowS, tag, reg);
        box.append(btn, menu);
        if (m === document.body) {
            box.style.position = "fixed";
            box.style.bottom = "12px";
            box.style.left = "12px";
            box.style.zIndex = "9999";
            document.body.appendChild(box);
        } else m.appendChild(box);
    }

    function boot() {
        const c = ctx(),
            ev = c?.event_types,
            es = c?.eventSource;
        const init = () => ui();
        if (es && ev && ev.APP_READY) es.on(ev.APP_READY, init);
        else {
            document.addEventListener("DOMContentLoaded", init, { once: true });
            setTimeout(init, 600);
        }
    }
    boot();
})();
