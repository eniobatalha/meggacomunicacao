"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Info, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/form";
import { DEMO_USERS } from "@/lib/data/galleries";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/store/auth";
import { toast } from "@/lib/store/toast";

type Mode = "login" | "register";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const login = useAuth((s) => s.login);
  const register = useAuth((s) => s.register);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function finish(role: "client" | "admin", firstName: string) {
    toast({ title: `Olá, ${firstName}!`, description: "Login realizado com sucesso." });
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    router.push(safeNext ?? (role === "admin" ? "/admin" : "/cliente"));
  }

  function doLogin(e: string, p: string) {
    setLoading(true);
    setError(null);
    // pequena espera para simular a chamada ao servidor
    setTimeout(() => {
      const res = login(e, p);
      setLoading(false);
      if (!res.ok) return setError(res.error);
      finish(res.user.role, res.user.name.split(" ")[0]);
    }, 500);
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (mode === "login") return doLogin(email, password);
    if (password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    const res = register({ name, email, phone, password });
    if (!res.ok) return setError(res.error);
    finish("client", name.split(" ")[0]);
  }

  return (
    <div className="w-full max-w-md">
      <p className="eyebrow">Área do cliente</p>
      <h1 className="mt-3 font-display text-5xl font-medium">{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
      <p className="mt-3 text-mist">
        {mode === "login"
          ? "Entre para ver suas galerias, comprar fotos e acompanhar seus pedidos."
          : "Use o mesmo e-mail informado na contratação para encontrarmos suas galerias."}
      </p>

      <div className="mt-8 grid grid-cols-2 rounded-full border border-white/10 bg-ink-850 p-1" role="tablist">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={cn(
              "h-10 rounded-full text-sm font-semibold transition-all",
              mode === m ? "bg-ink-600 text-bone shadow" : "text-mist hover:text-bone",
            )}
          >
            {m === "login" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "register" && (
          <>
            <Field id="name" label="Nome completo" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <Field id="phone" label="WhatsApp" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(81) 90000-0000" autoComplete="tel" />
          </>
        )}
        <Field id="email" label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="voce@email.com" />
        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-smoke hover:text-bone"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : mode === "login" ? "Entrar" : "Criar conta e entrar"}
          {!loading && <ArrowRight className="size-4" />}
        </Button>
      </form>

      {/* Atalhos da demonstração */}
      <div className="mt-10 rounded-2xl border border-dashed border-gold-500/30 bg-gold-500/4 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-gold-200">
          <Info className="size-4" /> Acesso de demonstração
        </p>
        <p className="mt-1 text-xs text-mist">Protótipo para apresentação — os dados ficam salvos apenas neste navegador.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              disabled={loading}
              onClick={() => {
                setEmail(u.email);
                setPassword(u.password);
                doLogin(u.email, u.password);
              }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-left transition-colors hover:border-gold-500/50"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-700 text-gold-300">
                {u.role === "admin" ? <ShieldCheck className="size-4" /> : <UserRound className="size-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-bone">{u.role === "admin" ? "Painel da equipe" : "Cliente"}</span>
                <span className="block truncate text-[0.7rem] text-smoke">{u.email}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
