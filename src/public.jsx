import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "./api";
import {
  useApp,
  useData,
  Load,
  Brand,
  Icon,
  s,
  Card,
  Tile,
  Field,
  ErrorText,
  Info,
  Orbit,
} from "./core";

export function Welcome() {
  const content = useData("/public/content"),
    { user } = useApp();
  return (
    <div className={s.welcome}>
      <header className={s.publicHeader}>
        <Brand />
        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="#our-approach">Our approach</a>
          <Link to={user ? "/" : "/login"} className={s.secondary}>
            {user ? "Open workspace" : "Sign in"}
            <Icon name="ArrowUpRight" size={15} />
          </Link>
        </nav>
      </header>
      <Load state={content}>
        {(d) => (
          <>
            <section className={s.landingHero}>
              <div>
                <span className={s.landingPill}>
                  <span /> ROBOTNETWORK · A FRESH PERSPECTIVE
                </span>
                <h1>{d.heroTitle}</h1>
                <p>{d.heroSubtitle}</p>
                <div className={s.landingActions}>
                  <Link className={s.primary} to={user ? "/" : "/register"}>
                    {user ? "Open my workspace" : "Start your next chapter"}
                    <Icon name="ArrowRight" size={17} />
                  </Link>
                  <a className={s.textLink} href="#how-it-works">
                    Take a closer look <Icon name="ArrowDownLeft" size={16} />
                  </a>
                </div>
                <div className={s.landingTrust}>
                  <Icon name="ShieldCheck" size={17} />
                  <span>Clear terms. Recorded transactions. A personal workspace.</span>
                </div>
              </div>
              <div className={s.landingArt}>
                <div className={s.artLabel}>A LITTLE ROOM TO GROW.</div>
                <Orbit />
                <div className={s.artGlass}>
                  <Tile icon="Network" />
                  <div>
                    <strong>Everything, connected.</strong>
                    <small>Your wallet · Your plans · Your network</small>
                  </div>
                  <Icon name="CheckCircle2" size={21} />
                </div>
                <div className={s.artNumbers}>
                  <span><strong>12</strong><small>plan choices</small></span>
                  <span><strong>45</strong><small>automatic credits</small></span>
                  <span><strong>3</strong><small>referral levels</small></span>
                </div>
              </div>
            </section>
            <section id="how-it-works" className={s.landingSection}>
              <div className={s.landingSectionHeading}>
                <span className={s.eyebrow}>THOUGHTFULLY SIMPLE</span>
                <h2>Less guesswork.<br />More perspective.</h2>
                <p>A clear path from your first transfer to a connected view of your account.</p>
              </div>
              <div className={s.landingSteps}>
                {[
                  ["01", "Wallet", "A place for every movement.", "Deposit funds and withdrawable earnings stay in separate wallets, with a record of every movement."],
                  ["02", "Layers", "A plan with clear terms.", "Review the purchase price, daily credit, and exact total before activation. Your first earning arrives immediately."],
                  ["03", "Network", "Connections, accounted for.", "Invite people you know and track approved deposit commissions across three referral levels."],
                ].map(([number, icon, title, text]) => (
                  <Card key={number}>
                    <div className={s.sectionHead}><Tile icon={icon} /><span className={s.landingStepNumber}>{number}</span></div>
                    <h3>{title}</h3><p>{text}</p>
                  </Card>
                ))}
              </div>
            </section>
            <section id="our-approach" className={s.landingApproach}>
              <div>
                <span className={s.eyebrow}>OUR APPROACH</span>
                <h2>The details matter.<br />So we keep them clear.</h2>
                <p>Manual payment reviews. Separate wallets. An exact history of your plans and credits. Built to give you a clearer view of where you stand.</p>
                <Link className={s.primary} to={user ? "/" : "/register"}>Make room for what’s next <Icon name="ArrowRight" size={17} /></Link>
              </div>
              <div>
                {[
                  ["ShieldCheck", "Manual, human-reviewed payments", "Submit your Easypaisa receipt. An administrator verifies deposits and processes withdrawals manually."],
                  ["Clock", "A schedule you can follow", "One immediate credit, followed by 44 daily credits. All earnings are recorded automatically."],
                  ["MessageSquare", "A conversation when you need it", "Open a support request and keep every reply together in your workspace."],
                ].map(([icon, title, text]) => (
                  <div className={s.approachRow} key={title}><Tile icon={icon} /><div><h3>{title}</h3><p>{text}</p></div></div>
                ))}
              </div>
            </section>
          </>
        )}
      </Load>
      <footer className={s.publicFooter}>
        <Brand />
        <span>© {new Date().getFullYear()} RobotNetwork. A considered way forward.</span>
        <Link to="/login">Member sign-in <Icon name="ArrowUpRight" size={14} /></Link>
      </footer>
    </div>
  );
}
export function Auth({ register = false, admin = false }) {
  const { user, login, notify, logout } = useApp(),
    navigate = useNavigate(),
    useAdminStyle = admin || !register;
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [show, setShow] = useState(false);
  if (user && (!admin || user.role === "admin"))
    return <Navigate to={admin ? "/admin" : "/"} replace />;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const data = await api(`/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body,
      });
      if (admin && data.user.role !== "admin") {
        setError("This account does not have administrator access.");
        return;
      }
      login(data);
      notify(
        register
          ? "Welcome to RobotNetwork. Your workspace is ready."
          : "Welcome back.",
      );
      navigate(admin ? "/admin" : "/");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={`${s.auth} ${useAdminStyle ? s.adminAuth : ""}`}>
      <section className={s.authStory}>
        <Brand admin={admin} />
        <div>
          <span className={s.eyebrow}>
            {admin
              ? "ROBOTNETWORK · ADMINISTRATION"
              : "A FRESH PERSPECTIVE"}
          </span>
          <h1>
            {admin ? (
              <>
                Thoughtful oversight.
                <br />A clearer picture.
              </>
            ) : (
              <>
                Make room
                <br />for what’s next.
              </>
            )}
          </h1>
          <p>
            {admin
              ? "Your members, payment reviews, and platform records. Connected in one dedicated operations workspace."
              : "A calm, considered space for your wallet, your plans, and the people in your network."}
          </p>
          <div className={s.authOrbit}>
            <Orbit />
          </div>
          <div className={s.authStoryFoot}>
            <Icon name={admin ? "ShieldCheck" : "Leaf"} size={18} />
            <span>
              {admin
                ? "YOUR DEDICATED OPERATIONS CONSOLE"
                : "YOUR NEXT CHAPTER STARTS WITH CLARITY"}
            </span>
          </div>
        </div>
        <small>© {new Date().getFullYear()} RobotNetwork</small>
      </section>
      <section className={s.authPanel}>
        <div className={s.authForm}>
          <span className={s.authIcon}>
            <Icon
              name={admin ? "ShieldCheck" : register ? "Sparkles" : "Leaf"}
              size={28}
            />
          </span>
          <span className={s.eyebrow}>
            {admin
              ? "ADMINISTRATOR SIGN-IN"
              : register
                ? "A NEW BEGINNING"
                : "YOUR PERSONAL WORKSPACE"}
          </span>
          <h1>
            {admin
              ? "Welcome to operations."
              : register
                ? "Let’s begin your next chapter."
                : "Good to see you again."}
          </h1>
          <p>
            {admin
              ? "Sign in with your administrator account."
              : register
                ? "Create an account. A little clarity awaits."
                : "Sign in and pick up where you left off."}
          </p>
          {user && admin ? (
            <Info>
              You are signed in as a member.{" "}
              <button className={s.textButton} onClick={logout}>
                Sign out to use an administrator account
              </button>
            </Info>
          ) : (
            <form onSubmit={submit}>
              {register && (
                <Field
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  maxLength={160}
                  required
                />
              )}
              <Field
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={160}
                required
              />
              <Field
                label="Password"
                hint={
                  register
                    ? "At least 10 characters. Keep it unique."
                    : undefined
                }
              >
                <div className={s.passwordField}>
                  <input
                    aria-label="Password"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    minLength={10}
                    maxLength={128}
                    required
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    <Icon name={show ? "EyeOff" : "Eye"} size={18} />
                  </button>
                </div>
              </Field>
              {register && (
                <Field
                  label="Referral code (optional)"
                  name="referralCode"
                  defaultValue={
                    new URLSearchParams(window.location.search).get("ref") || ""
                  }
                  maxLength={24}
                />
              )}
              <ErrorText message={error} />
              <button className={s.primary} disabled={busy}>
                {busy
                  ? "Opening your workspace…"
                  : register
                    ? "Create my account"
                    : admin
                      ? "Open operations console"
                      : "Sign in to RobotNetwork"}
                <Icon name="ArrowRight" size={17} />
              </button>
            </form>
          )}
          {!admin && (
            <div className={s.authSwitch}>
              {register ? "Already have a workspace?" : "A new chapter ahead?"}
              <Link to={register ? "/login" : "/register"}>
                {register ? "Sign in" : "Create an account"}
              </Link>
            </div>
          )}
          <div className={s.authSecurity}>
            <Icon name="Lock" size={14} />
            <span>
              Protected by secure sign-in and encrypted transport when served
              over HTTPS.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
export function NotFound() {
  return (
    <div className={s.notFound}>
      <Brand />
      <span className={s.eyebrow}>A SMALL DETOUR</span>
      <h1>
        This page has taken
        <br />a different path.
      </h1>
      <p>Let’s get you back to somewhere familiar.</p>
      <Link className={s.primary} to="/">
        Back to my workspace
        <Icon name="ArrowRight" size={17} />
      </Link>
    </div>
  );
}
