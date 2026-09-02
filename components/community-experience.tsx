"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Heart, LoaderCircle, MessageCircle, Plus, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { communitySeedPosts, courses } from "@/lib/data";
import type { CommunityPost } from "@/lib/data/types";
import { useLearning } from "./learning-store";

type ApiPost = { id: string; spaceId: string; authorName: string; title: string; body: string; createdAt: string; replyCount: number; likeCount: number };

export function CommunityExperience() {
  const [space, setSpace] = useState("all");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [remotePosts, setRemotePosts] = useState<CommunityPost[]>([]);
  const { ownerId } = useLearning();

  async function loadPosts() {
    try {
      const response = await fetch("/api/community?limit=20");
      if (!response.ok) return;
      const payload = await response.json() as { posts?: ApiPost[] };
      setRemotePosts((payload.posts ?? []).map((post) => ({ id: post.id, spaceId: post.spaceId, authorName: post.authorName, authorRole: "EQUA član", title: post.title, body: post.body, replies: post.replyCount, likes: post.likeCount, createdAt: post.createdAt, tags: [post.spaceId] })));
    } catch { /* Seed conversations keep the community useful during local D1 warm-up. */ }
  }

  useEffect(() => { const timer = window.setTimeout(() => void loadPosts(), 0); return () => window.clearTimeout(timer); }, []);

  const posts = useMemo(() => [...remotePosts, ...communitySeedPosts].filter((post) => {
    const matchesSpace = space === "all" || post.spaceId === space;
    const needle = query.trim().toLocaleLowerCase("sr-Latn");
    return matchesSpace && (!needle || `${post.title} ${post.body} ${post.tags.join(" ")}`.toLocaleLowerCase("sr-Latn").includes(needle));
  }), [query, remotePosts, space]);

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/community", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ownerId, authorName: form.get("authorName"), spaceId: form.get("spaceId"), title: form.get("title"), body: form.get("body") }) });
      if (!response.ok) throw new Error("post failed");
      setStatus("success");
      event.currentTarget.reset();
      await loadPosts();
      window.setTimeout(() => setComposerOpen(false), 650);
    } catch { setStatus("error"); }
  }

  return (
    <div className="community-page">
      <section className="community-hero"><div><p className="eyebrow">EQUA Club · uči zajedno</p><h1>Pitanja koja nastaju <em>između koraka.</em></h1><p>Zajednica organizovana po programima i problemima kože — sa ekspertima, nedeljnim check-in razgovorima i manje buke.</p><div className="community-hero__stats"><span><Users /> 1.284 demo člana</span><span><MessageCircle /> 46 aktivnih tema</span><span><ShieldCheck /> stručno moderirano</span></div></div><div className="community-hero__action"><span><Sparkles /></span><h2>Weekly Expert Room</h2><p>Četvrtak · 19:00<br />Kožna barijera i povratak aktiva</p><button className="button button--dark" type="button" onClick={() => setComposerOpen(true)}><Plus size={16} /> Postavi pitanje</button></div></section>

      <div className="community-layout">
        <aside className="community-spaces"><span>Prostori</span><button className={space === "all" ? "is-active" : ""} onClick={() => setSpace("all")}><span>✦</span>Sve diskusije<small>{communitySeedPosts.length + remotePosts.length}</small></button>{courses.map((course) => <button className={space === course.slug ? "is-active" : ""} onClick={() => setSpace(course.slug)} key={course.id}><span style={{ background: course.accent }} />{course.title}<small>{communitySeedPosts.filter((post) => post.spaceId === course.slug).length}</small></button>)}<Link href="/academy">Istraži programe <ArrowRight size={14} /></Link></aside>

        <section className="community-feed"><div className="community-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pretraži pitanja i teme" aria-label="Pretraži zajednicu" /></label><button className="button button--dark" type="button" onClick={() => setComposerOpen(true)}><Plus size={16} /> Nova tema</button></div>{posts.length ? posts.map((post) => <article className="community-post" key={post.id}><div className="community-avatar">{post.authorName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><div className="community-post__meta"><strong>{post.authorName}</strong><span>{post.authorRole}</span><small>{post.createdAt}</small></div><h2>{post.title}</h2><p>{post.body}</p><div className="community-post__tags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><div className="community-post__actions"><button type="button"><MessageCircle /> {post.replies} odgovora</button><button type="button"><Heart /> {post.likes}</button><Link href={`/academy/${post.spaceId}`}>Otvori program <ArrowRight size={13} /></Link></div></div></article>) : <div className="community-empty"><MessageCircle /><h2>Nema rezultata.</h2><p>Probaj drugi izraz ili pokreni novu temu.</p></div>}</section>

        <aside className="community-side"><div><p className="eyebrow">Community pulse</p><h3>Danas učimo</h3><ul><li><span>#1</span> kako vratiti aktive</li><li><span>#2</span> pilling ispod SPF-a</li><li><span>#3</span> suvoća ili dehidratacija</li></ul></div><div><p className="eyebrow">Pravila prostora</p><p>Ljubazno, konkretno i bez dijagnostike. Prijavi sadržaj koji obećava izlečenje ili podstiče rizičnu upotrebu.</p></div></aside>
      </div>

      {composerOpen && <div className="community-modal" role="dialog" aria-modal="true" aria-label="Nova tema"><form onSubmit={submitPost}><div className="community-modal__head"><div><p className="eyebrow">Nova diskusija</p><h2>Postavi dobro pitanje.</h2></div><button type="button" onClick={() => setComposerOpen(false)} aria-label="Zatvori"><X /></button></div><label>Ime<input name="authorName" defaultValue="EQUA član" required maxLength={80} /></label><label>Prostor<select name="spaceId" defaultValue={space === "all" ? courses[0].slug : space}>{courses.map((course) => <option key={course.id} value={course.slug}>{course.title}</option>)}</select></label><label>Naslov<input name="title" placeholder="Šta želiš da razjasnimo?" required minLength={6} maxLength={160} /></label><label>Detalji<textarea name="body" placeholder="Napiši kontekst, proizvode koje koristiš i šta se promenilo…" required minLength={12} maxLength={1500} rows={6} /></label>{status === "error" && <p role="alert">Tema nije sačuvana. Pokušaj ponovo.</p>}{status === "success" && <p role="status">Tema je objavljena.</p>}<button className="button button--dark button--full" type="submit" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle /> : <Plus />} Objavi temu</button></form></div>}
    </div>
  );
}
