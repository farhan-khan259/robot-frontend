import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Layers,
  Wallet,
  Users,
  History,
  LifeBuoy,
  Settings,
  LogOut,
  Leaf,
  Menu,
  X,
  Check,
  Copy,
  ShieldCheck,
  TrendingUp,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff,
  Bell,
  Search,
  SlidersHorizontal,
  Download,
  MessageSquare,
  FileText,
  Globe,
  CheckCircle2,
  Upload,
  Lock,
  Mail,
  Phone,
  UserRound,
  Sparkles,
  Link2,
  Send,
  AlertCircle,
  ExternalLink,
  BarChart3,
  Coins,
  Network,
  ChevronDown,
} from "lucide-react";
import { api, currency, date } from "./api";
import s from "./App.module.css";
export { s, currency, date };
const institutionDomains = {
  easypaisa: "easypaisa.com.pk", jazzcash: "jazzcash.com.pk", sadapay: "sadapay.pk", nayapay: "nayapay.com", zindigi: "zindigi.pk", upaisa: "upaisa.com", hblkonnect: "hbl.com", ublomni: "ubl.com.pk", alfawallet: "bankalfalah.com", keenu: "keenu.com", simsim: "simsim.com.pk", digikhata: "digikhata.pk", finja: "finja.pk", oneload: "oneload.com.pk", hbl: "hbl.com", ubl: "ubl.com.pk", mcb: "mcb.com.pk", meezan: "meezanbank.com", allied: "abl.com", alfalah: "bankalfalah.com", bankalhabib: "bankalhabib.com", askari: "askaribank.com", faysal: "faysalbank.com", standardchartered: "sc.com", nbp: "nbp.com.pk", bop: "bop.com.pk", bok: "bok.com.pk", sindh: "sindhbank.com.pk", soneri: "soneribank.com", js: "jsbl.com", habibmetro: "habibmetro.com", dubaiislamic: "dibpak.com", albaraka: "albaraka.com.pk", bankislami: "bankislami.com.pk", mcbislamic: "mcbislamicbank.com", firstwomen: "fwbl.com.pk", ztbl: "ztbl.com.pk", sme: "smebank.org", ppcb: "ppcbl.com.pk", citi: "citi.com", deutsche: "db.com", bankofchina: "bankofchina.com", icbc: "icbc.com.cn", easypaisabank: "easypaisa.com.pk", mashreq: "mashreq.com", raqami: "raqamidigital.com",
};
const institutionLogoSources = {
  easypaisa:
    "https://images.seeklogo.com/logo-png/51/1/easypaisa-logo-png_seeklogo-512220.png",
  jazzcash:
    "https://images.seeklogo.com/logo-png/61/1/jazz-cash-new-logo-png_seeklogo-613046.png",
  hbl: "https://www.hbl.com/assets/images/HBL-Device-Logo-full_colour.png",
  mcb: "https://companieslogo.com/img/orig/MCB.PK-369cfa52.png?t=1720244492",
};
export function InstitutionMark({ institution, monogram, label }) {
  const [failed, setFailed] = useState(false);
  const source = institutionLogoSources[institution] || (institutionDomains[institution] ? `https://www.google.com/s2/favicons?domain=${institutionDomains[institution]}&sz=128` : null);
  return (
    <span className={s.institutionMark} title={label || institution}>
      {source && !failed ? (
        <img
          src={source}
          alt={`${label || institution} logo`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{monogram || "PK"}</span>
      )}
    </span>
  );
}
export function InstitutionPicker({ institutions, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = institutions.find((institution) => institution.id === value);
  return (
    <div className={s.institutionPicker}>
      <button type="button" className={s.institutionPickerTrigger} onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open}>
        <InstitutionMark {...selected} institution={selected?.id} />
        <span>{selected?.name || "Choose a bank or wallet"}</span>
        <Icon name="ChevronDown" size={18} />
      </button>
      {open && <div className={s.institutionPickerMenu} role="listbox">
        {institutions.map((institution) => (
          <button type="button" role="option" aria-selected={institution.id === value} key={institution.id} className={institution.id === value ? s.institutionPickerActive : ""} onClick={() => { onChange(institution.id); setOpen(false); }}>
            <InstitutionMark {...institution} institution={institution.id} />
            <span>{institution.name}</span>
            {institution.id === value && <Icon name="Check" size={17} />}
          </button>
        ))}
      </div>}
    </div>
  );
}
const icons = {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Layers,
  Wallet,
  Users,
  History,
  LifeBuoy,
  Settings,
  LogOut,
  Leaf,
  Menu,
  X,
  Check,
  Copy,
  ShieldCheck,
  TrendingUp,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff,
  Bell,
  Search,
  SlidersHorizontal,
  Download,
  MessageSquare,
  FileText,
  Globe,
  CheckCircle2,
  Upload,
  Lock,
  Mail,
  Phone,
  UserRound,
  Sparkles,
  Link2,
  Send,
  AlertCircle,
  ExternalLink,
  BarChart3,
  Coins,
  Network,
  ChevronDown,
};
export function Icon({ name, size = 19, ...props }) {
  const Component = icons[name] || Leaf;
  return (
    <Component size={size} strokeWidth={1.7} aria-hidden="true" {...props} />
  );
}
const Context = createContext();
export const useApp = () => useContext(Context);
export function Provider({ children }) {
  const [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState(null);
  const notify = useCallback(
    (message, error = false) => setNotice({ message, error }),
    [],
  );
  const refresh = useCallback(async () => {
    const u = await api("/me");
    setUser(u);
    return u;
  }, []);
  useEffect(() => {
    let alive = true;
    const token = sessionStorage.getItem("rn_token");
    if (token)
      api("/me")
        .then((u) => alive && setUser(u))
        .catch(() => {
          if (alive) sessionStorage.removeItem("rn_token");
        })
        .finally(() => alive && setReady(true));
    else setReady(true);
    const expired = () => {
      sessionStorage.removeItem("rn_token");
      setUser(null);
    };
    window.addEventListener("rn-session-expired", expired);
    return () => {
      alive = false;
      window.removeEventListener("rn-session-expired", expired);
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);
  const login = (data) => {
    sessionStorage.setItem("rn_token", data.token);
    setUser(data.user);
  };
  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
    } finally {
      sessionStorage.removeItem("rn_token");
      setUser(null);
    }
  };
  if (!ready)
    return (
      <div className={s.splash}>
        <Mark />
        <h1>RobotNetwork</h1>
        <p>Preparing your workspace</p>
        <span className={s.loadingLine} />
      </div>
    );
  return (
    <Context.Provider value={{ user, setUser, refresh, notify, login, logout }}>
      {children}
      {notice && (
        <div
          className={`${s.toast} ${notice.error ? s.toastError : ""}`}
          role={notice.error ? "alert" : "status"}
        >
          <Icon name={notice.error ? "AlertCircle" : "CheckCircle2"} />
          <span>{notice.message}</span>
          <button
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useData(path, poll = 0) {
  const [state, setState] = useState({ data: null, error: "", loading: true }),
    [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    setState({ data: null, error: "", loading: true });
    async function fetchData() {
      if (!path) {
        if (alive) setState({ data: null, error: "", loading: false });
        return;
      }
      try {
        const data = await api(path, { signal: controller.signal });
        if (alive) setState({ data, error: "", loading: false });
      } catch (e) {
        if (alive && e.name !== "AbortError")
          setState((prev) => ({ ...prev, error: e.message, loading: false }));
      }
    }
    fetchData();
    const timer = poll
      ? setInterval(() => {
          if (document.visibilityState === "visible") fetchData();
        }, poll)
      : null;
    return () => {
      alive = false;
      controller.abort();
      if (timer) clearInterval(timer);
    };
  }, [path, version, poll]);
  return { ...state, reload };
}
export function Load({ state, children }) {
  if (state.loading)
    return (
      <div className={s.loader} role="status">
        <span className={s.spinner} />
        <span>Loading your workspace…</span>
      </div>
    );
  if (state.error)
    return (
      <div className={s.empty}>
        <Tile icon="AlertCircle" tone="rose" />
        <h3>We couldn’t load this section.</h3>
        <p>{state.error}</p>
        <button className={s.secondary} onClick={state.reload}>
          <Icon name="RefreshCw" size={16} />
          Try again
        </button>
      </div>
    );
  return children(state.data);
}
export function Mark() {
  return (
    <span className={s.brandMark}>
      <Icon name="Network" size={24} />
    </span>
  );
}
export function Brand({ admin = false }) {
  return (
    <Link to={admin ? "/admin" : "/"} className={s.brand}>
      <Mark />
      <span>
        Robot<span>Network</span>
        <small>{admin ? "OPERATIONS CONSOLE" : "A CLEARER WAY FORWARD"}</small>
      </span>
    </Link>
  );
}
const memberNav = [
  ["/", "Overview", "LayoutDashboard"],
  ["/plans", "Discover plans", "Layers"],
  ["/my-plans", "My portfolio", "Wallet"],
  ["/earnings", "Earnings", "TrendingUp"],
  ["/team", "My network", "Users"],
  ["/deposit", "Add funds", "ArrowDownLeft"],
  ["/withdraw", "Withdraw", "ArrowUpRight"],
  ["/activity", "Transactions", "History"],
  ["/account", "My account", "UserRound"],
  ["/support", "Help & support", "LifeBuoy"],
];
const adminNav = [
  ["/admin", "Overview", "LayoutDashboard"],
  ["/admin/users", "Members", "Users"],
  ["/admin/plans", "Plan collection", "Layers"],
  ["/admin/deposits", "Deposit requests", "ArrowDownLeft"],
  ["/admin/withdrawals", "Withdrawal requests", "ArrowUpRight"],
  ["/admin/transactions", "Transaction ledger", "History"],
  ["/admin/commissions", "Commissions", "Network"],
  ["/admin/reports", "Reports", "BarChart3"],
  ["/admin/content", "Website content", "Globe"],
  ["/admin/tickets", "Support inbox", "MessageSquare"],
  ["/admin/settings", "Payment settings", "Settings"],
];
export function Shell({ admin = false }) {
  const { user, refresh, logout, notify } = useApp(),
    location = useLocation();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 800px)").matches);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 800px)");
    const update = () => { setCompact(media.matches); setOpen(false); };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const firstNav = useRef(null);
  const drawer = useRef(null);
  const notifications = useData(admin ? null : "/notifications", 30000);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    refresh().catch((e) => notify(e.message, true));
  }, [location.pathname, refresh, notify]);
  useEffect(() => {
    if (!open) return;
    const prior = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector("a,button")?.focus();
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const focusable = [...drawer.current.querySelectorAll('a[href],button:not(:disabled)')]
          .filter((element) => element.getClientRects().length);
        const first = focusable[0], last = focusable.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", close);
      prior?.focus?.();
    };
  }, [open]);
  const nav = admin ? adminNav : memberNav;
  const current =
    nav.find(([path]) => location.pathname === path) ||
    nav
      .filter(([path]) => path !== "/" && location.pathname.startsWith(path))
      .sort((a, b) => b[0].length - a[0].length)[0];
  useEffect(() => {
    document.title = `${current?.[1] || "Details"} · RobotNetwork${admin ? " Admin" : ""}`;
  }, [current?.[1], admin]);
  if (!user) return <Navigate to={admin ? "/admin/login" : "/login"} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return (
    <div className={s.app}>
      <a href="#main-content" className={s.skip}>
        Skip to content
      </a>
      {open && (
        <button
          className={s.scrim}
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        ref={drawer}
        id="workspace-navigation"
        inert={compact && !open}
        className={`${s.sidebar} ${open ? s.sidebarOpen : ""}`}
        aria-label={admin ? "Administrator navigation" : "Member navigation"}
      >
        <div className={s.sidebarBrand}>
          <Brand admin={admin} />
          <button
            className={s.drawerClose}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="X" />
          </button>
        </div>
        <span className={s.navCaption}>
          {admin ? "CONTROL CENTER" : "YOUR WORKSPACE"}
        </span>
        <nav ref={firstNav} tabIndex={-1}>
          {nav.map(([path, label, icon], i) => (
            <React.Fragment key={path}>
              {!admin && i === 5 && (
                <span className={s.navCaption}>MONEY & ACCOUNT</span>
              )}
              <NavLink
                to={path}
                end={path === "/" || path === "/admin"}
                className={({ isActive }) =>
                  `${s.navLink} ${isActive ? s.navActive : ""}`
                }
              >
                <span>
                  <Icon name={icon} size={18} />
                </span>
                {label}
                <Icon name="ChevronRight" size={13} />
              </NavLink>
            </React.Fragment>
          ))}
        </nav>
        <div className={s.sidebarFoot}>
          <div className={s.sidebarNote}>
            <Icon name={admin ? "ShieldCheck" : "Leaf"} size={25} />
            <strong>
              {admin ? "Everything, in balance." : "A little room to grow."}
            </strong>
            <p>
              {admin
                ? "Thoughtful oversight. Clear records."
                : "Every plan. Every credit. All connected."}
            </p>
          </div>
          <button className={s.signout} onClick={logout}>
            <Icon name="LogOut" size={17} />
            Sign out
          </button>
          <Link
            to={admin ? "/admin/settings" : "/account"}
            className={s.sidebarProfile}
          >
            <Avatar name={user.name} />
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
          </Link>
        </div>
      </aside>
      <div className={s.main} inert={compact && open}>
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <button
              className={s.menuButton}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="workspace-navigation"
              aria-label="Open navigation"
            >
              <Icon name="Menu" size={23} />
            </button>
            <span className={s.breadcrumb}>
              <b>{current?.[1] || "Details"}</b>
            </span>
          </div>
          <div className={s.topbarActions}>
            <span className={s.today}>
              {new Date().toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Karachi",
              })}
            </span>
            {!admin && (
              <Link
                to="/notifications"
                className={s.notificationButton}
                aria-label="Notifications"
              >
                <Icon name="Bell" size={20} />
                {notifications.data?.unread > 0 && <i />}
              </Link>
            )}
            <Link
              to={admin ? "/admin/settings" : "/account"}
              className={s.headerProfile}
            >
              <Avatar name={user.name} />
              <span>
                <b>{user.name}</b>
                <small>{admin ? "Administrator" : "Member account"}</small>
              </span>
              <Icon name="ChevronDown" size={13} />
            </Link>
          </div>
        </header>
        <main id="main-content" className={s.content}>
          <Outlet />
        </main>
        {admin && (
          <footer className={s.footer}>
            <span>© {new Date().getFullYear()} RobotNetwork</span>
            <span>
              Operations, with clarity.
              <Icon name="Leaf" size={13} />
            </span>
          </footer>
        )}
      </div>
      <nav className={s.mobileNav} aria-label="Mobile navigation" inert={compact && open}>
        {(admin
          ? [adminNav[0], adminNav[1], adminNav[3], adminNav[4]]
          : [memberNav[0], memberNav[1], memberNav[2], memberNav[4]]
        ).map(([path, label, icon]) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/" || path === "/admin"}
            className={({ isActive }) => (isActive ? s.mobileActive : "")}
          >
            <Icon name={icon} size={20} />
            <span>
              {label
                .replace("Discover ", "")
                .replace(" requests", "")
                .replace("My ", "")}
            </span>
          </NavLink>
        ))}
        <button onClick={() => setOpen(!open)} aria-label="More navigation" aria-expanded={open} aria-controls="workspace-navigation">
          <Icon name="Menu" size={20} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
export function Avatar({ name = "", large = false }) {
  return (
    <span className={`${s.avatar} ${large ? s.avatarLarge : ""}`}>
      {name
        .trim()
        .split(/\s+/)
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </span>
  );
}
export function Heading({
  eyebrow = "YOUR ROBOTNETWORK WORKSPACE",
  title,
  description,
  action,
  back,
}) {
  return (
    <div className={s.heading}>
      <div>
        {back && (
          <Link to={back} className={s.backLink}>
            <Icon name="ArrowLeft" size={15} />
            Back
          </Link>
        )}
        <span className={s.eyebrow}>{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className={s.headingAction}>{action}</div>}
    </div>
  );
}
export function Card({ children, className = "", ...props }) {
  return (
    <section className={`${s.card} ${className}`} {...props}>
      {children}
    </section>
  );
}
export function SectionTitle({ title, description, action }) {
  return (
    <div className={s.sectionHead}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Tile({ icon = "Leaf", tone = "green", size = "normal" }) {
  return (
    <span
      className={`${s.tile} ${s["tile_" + tone] || ""} ${size === "large" ? s.tileLarge : ""}`}
    >
      <Icon name={icon} size={size === "large" ? 29 : 20} />
    </span>
  );
}
export function Empty({
  icon = "Layers",
  title = "Nothing here yet",
  text = "Your records will appear here.",
  action,
}) {
  return (
    <div className={s.empty}>
      <span className={s.emptyOrbit}>
        <Tile icon={icon} size="large" />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Badge({ status }) {
  return (
    <span
      className={`${s.badge} ${["rejected", "blocked", "closed"].includes(status) ? s.badgeRose : status === "pending" ? s.badgeAmber : ""}`}
    >
      <i />
      {status}
    </span>
  );
}
export function Stat({ label, value, icon = "Wallet", note, tone = "green" }) {
  return (
    <Card className={s.stat}>
      <div className={s.statTop}>
        <Tile icon={icon} tone={tone} />
        <span className={s.statDecoration} />
      </div>
      <span className={s.statLabel}>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </Card>
  );
}
export function Info({ children, icon = "ShieldCheck", tone = "" }) {
  return (
    <div className={`${s.info} ${tone ? s.infoWarning : ""}`}>
      <Icon name={icon} size={18} />
      <div>{children}</div>
    </div>
  );
}
export function Field({ label, hint, children, ...props }) {
  return (
    <label className={s.field}>
      <span>{label}</span>
      {children || <input {...props} />}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function ErrorText({ message }) {
  return message ? (
    <p className={s.formError} role="alert">
      <Icon name="AlertCircle" size={17} />
      {message}
    </p>
  ) : null;
}
export function Tabs({ items, value, onChange, label = "Filter" }) {
  return (
    <div className={s.tabs} role="group" aria-label={label}>
      {items.map((x) => (
        <button
          key={x.value}
          className={value === x.value ? s.tabActive : ""}
          aria-pressed={value === x.value}
          onClick={() => onChange(x.value)}
        >
          {x.label}
          {x.count !== undefined && <span>{x.count}</span>}
        </button>
      ))}
    </div>
  );
}
export function PlanTabs() {
  return (
    <nav className={s.planTabs} aria-label="Plan pages">
      <NavLink to="/plans" end>
        Discover plans
      </NavLink>
      <NavLink to="/my-plans">My portfolio</NavLink>
    </nav>
  );
}
export function Pager({ data, page, setPage }) {
  return data.pages > 1 ? (
    <div className={s.pager}>
      <span>{data.total} records</span>
      <div>
        <button
          className={s.iconButton}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
        >
          <Icon name="ChevronLeft" size={17} />
        </button>
        <span>
          {page} / {data.pages}
        </span>
        <button
          className={s.iconButton}
          disabled={page >= data.pages}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
        >
          <Icon name="ChevronRight" size={17} />
        </button>
      </div>
    </div>
  ) : null;
}
export function Modal({ title, close, children, wide = false, className = "" }) {
  const ref = useRef();
  useEffect(() => {
    const prior = document.activeElement,
      old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector("button,input,select,textarea,a")?.focus();
    const key = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const all = [
          ...ref.current.querySelectorAll(
            "button:not(:disabled),input,select,textarea,a[href]",
          ),
        ];
        const first = all[0],
          last = all.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      prior?.focus?.();
    };
  }, [close]);
  return (
    <div className={s.modalBackdrop} onMouseDown={close}>
      <section
        ref={ref}
        className={`${s.modal} ${wide ? s.modalWide : ""} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.modalHead}>
          <h2>{title}</h2>
          <button
            className={s.iconButton}
            onClick={close}
            aria-label="Close dialog"
          >
            <Icon name="X" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Transactions({ items, admin = false }) {
  return items?.length ? (
    <div className={s.transactionList}>
      {items.map((t) => (
        <div className={s.transaction} key={t._id}>
          <Tile
            icon={
              t.kind === "commission"
                ? "Network"
                : t.kind === "earning"
                  ? "TrendingUp"
                  : t.direction === "in"
                    ? "ArrowDownLeft"
                    : "ArrowUpRight"
            }
            tone={t.direction === "in" ? "green" : "neutral"}
          />
          <div className={s.transactionBody}>
            <strong>{t.note}</strong>
            <small>
              {admin && t.user?.name ? `${t.user.name} · ` : ""}
              {date(t.createdAt)}
            </small>
            <span className={s.transactionMeta}>
              {t.kind} · {t.wallet} wallet
            </span>
          </div>
          <div className={s.transactionAmount}>
            <b className={t.direction === "in" ? s.positive : ""}>
              {t.direction === "in" ? "+" : "−"}
              {currency(t.amount)}
            </b>
            <small>{t.direction === "in" ? "Credited" : "Debited"}</small>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Empty
      icon="History"
      title="A clear beginning"
      text="Your wallet movements will appear here as they happen."
    />
  );
}
export function Orbit({ small = false }) {
  return (
    <div
      aria-hidden="true"
      className={`${s.orbit} ${small ? s.orbitSmall : ""}`}
    >
      <div className={s.orbitRing} />
      <div className={s.orbitRing} />
      <span className={s.orbitCoin}>
        <Icon name="Leaf" size={small ? 26 : 42} />
      </span>
      <i />
      <i />
      <i />
    </div>
  );
}
export function ActionCard({ to, icon, title, description, tone = "green" }) {
  return (
    <Link to={to} className={`${s.actionCard} ${s["action_" + tone] || ""}`}>
      <Tile icon={icon} tone={tone} />
      <h3>{title}</h3>
      <p>{description}</p>
      <Icon name="ArrowUpRight" size={17} />
    </Link>
  );
}
export async function copyText(text, notify) {
  try {
    await navigator.clipboard.writeText(text);
    notify("Copied to clipboard");
  } catch {
    notify("Copy the text from the displayed field.", true);
  }
}
