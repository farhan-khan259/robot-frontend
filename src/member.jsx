import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api, proof } from "./api";
import {
  useApp,
  useData,
  Load,
  Icon,
  s,
  currency,
  date,
  Heading,
  Card,
  SectionTitle,
  Tile,
  Empty,
  Badge,
  Stat,
  Info,
  Field,
  ErrorText,
  Tabs,
  PlanTabs,
  Pager,
  Modal,
  Transactions,
  Orbit,
  Mark,
  ActionCard,
  Avatar,
  InstitutionMark,
  InstitutionPicker,
  copyText,
} from "./core";
const planIcons = {
  RN01: "Leaf",
  RN02: "Sparkles",
  RN03: "TrendingUp",
  RN04: "Zap",
  RN05: "Coins",
  RN06: "ShieldCheck",
  RN07: "Network",
  RN08: "BarChart3",
  RN09: "Clock",
  RN10: "Rocket",
  RN11: "Crown",
  RN12: "Gem",
};
const planIcon = (plan) => planIcons[plan.code] || "Layers";
const whatsappUrl = (number) => {
  const digits = String(number || "").replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
};
export function Overview() {
  const state = useData("/overview", 20000),
    content = useData("/public/content"),
    { notify } = useApp();
  const [visible, setVisible] = useState(true),
    [channelPopup, setChannelPopup] = useState(
      () => sessionStorage.getItem("rn_channel_popup_seen") !== "1",
    );
  const closeChannelPopup = () => {
    sessionStorage.setItem("rn_channel_popup_seen", "1");
    setChannelPopup(false);
  };
  return (
    <Load state={state}>
      {(d) => (
        <>
          {channelPopup && <ChannelPopup close={closeChannelPopup} />}
          <Heading
            eyebrow="YOUR PERSONAL OVERVIEW"
            title={`Welcome back, ${d.user.name.split(" ")[0]}.`}
          />
          {content.data?.announcementEnabled && (
            <Announcement content={content.data} />
          )}
          <section className={s.balanceHero}>
              <div className={s.balanceHeroTop}>
                <span>
                  <i />
                  YOUR AVAILABLE EARNINGS
                </span>
                <button
                  aria-label={visible ? "Hide balance" : "Show balance"}
                  onClick={() => setVisible(!visible)}
                >
                  <Icon name={visible ? "Eye" : "EyeOff"} size={19} />
                </button>
              </div>
              <span className={s.heroLabel}>Withdrawable wallet</span>
              <h2>
                {visible ? currency(d.user.withdrawableBalance) : "••••••"}
              </h2>
              <p>
                Plan earnings and network commissions.
                <br />
                Ready for your next move.
              </p>
              <div className={s.heroButtons}>
                <Link className={s.heroPrimary} to="/deposit">
                  <Icon name="Plus" size={17} />
                  Add funds
                </Link>
                <Link className={s.heroSecondary} to="/withdraw">
                  Withdraw
                  <Icon name="ArrowUpRight" size={17} />
                </Link>
              </div>
              <div className={s.heroDivider} />
              <div className={s.heroWalletRow}>
                <span>
                  <Icon name="Lock" size={14} />
                  Deposit wallet{" "}
                  <strong>
                    {visible ? currency(d.user.depositBalance) : "••••"}
                  </strong>
                </span>
                <small>For plan purchases only</small>
              </div>
              <Orbit />
          </section>
          <div className={s.statsGrid}>
            <Stat
              label="Deposit wallet"
              value={currency(d.user.depositBalance)}
              icon="Wallet"
            />
            <Stat
              label="Plan earnings"
              value={currency(d.totalEarnings)}
              icon="TrendingUp"
            />
            <Stat
              label="Network rewards"
              value={currency(d.totalCommissions)}
              icon="Network"
              tone="sand"
            />
            <Stat
              label="Active plans"
              value={String(d.activePlans).padStart(2, "0")}
              icon="Layers"
              tone="neutral"
            />
          </div>
          <div className={s.dashboardBottom}>
            <Card>
              <SectionTitle
                title="Your latest movements"
                description="A little clarity on every credit and debit."
                action={
                  <Link className={s.textLink} to="/activity">
                    View all
                    <Icon name="ArrowRight" size={15} />
                  </Link>
                }
              />
              <Transactions items={d.recent} />
            </Card>
            <div className={s.dashboardAside}>
              <Card className={s.inviteMini}>
                <Tile icon="Users" tone="sand" />
                <span className={s.eyebrow}>BETTER, CONNECTED</span>
                <h2>
                  Your network.
                  <br />
                  New possibilities.
                </h2>
                <p>Invite people you know with your personal link.</p>
                <div className={s.referralMini}>
                  <span>{d.user.referralCode}</span>
                  <button
                    aria-label="Copy invitation link"
                    onClick={() =>
                      copyText(
                        `${window.location.origin}/register?ref=${d.user.referralCode}`,
                        notify,
                      )
                    }
                  >
                    <Icon name="Copy" size={16} />
                  </button>
                </div>
                <Link className={s.textLink} to="/team">
                  Explore my network
                  <Icon name="ArrowRight" size={16} />
                </Link>
              </Card>
              <Link to="/support" className={s.supportMini}>
                <Tile icon="LifeBuoy" tone="neutral" />
                <div>
                  <strong>A hand when you need it.</strong>
                  <small>Visit the help center</small>
                </div>
                <Icon name="ArrowUpRight" size={18} />
              </Link>
            </div>
          </div>
        </>
      )}
    </Load>
  );
}
function ChannelPopup({ close }) {
  return (
    <Modal title="Stay connected with RobotNetwork" close={close} className={s.channelPopup}>
      <div className={s.channelPopupHero}>
        <Mark />
        <span className={s.channelPopupBadge}>
          <Icon name="CheckCircle2" size={14} />
          Clear updates, in one place
        </span>
        <h2>A little more clarity.</h2>
        <p>Follow our WhatsApp channel for short updates on your plans, wallet, and network.</p>
      </div>
      <div className={s.channelPopupPoints}>
        <span><Icon name="CheckCircle2" size={15} />Plan updates</span>
        <span><Icon name="CheckCircle2" size={15} />Wallet reminders</span>
        <span><Icon name="CheckCircle2" size={15} />Member news</span>
      </div>
      <a
        className={s.channelPopupCta}
        href="https://whatsapp.com/channel/0029VbDtAc4HrDZdLMeIgo1v"
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="MessageSquare" size={19} />
        Follow our WhatsApp channel
        <Icon name="ExternalLink" size={16} />
      </a>
      <button className={s.channelPopupContinue} onClick={close}>
        Continue to dashboard
      </button>
    </Modal>
  );
}
export function Announcement({ content }) {
  const [dismissed, setDismissed] = useState(false);
  return !dismissed ? (
    <div className={s.announcement}>
      <Tile icon="Sparkles" tone="sand" />
      <div>
        <strong>{content.announcementTitle}</strong>
        <p>{content.announcementBody}</p>
        {content.announcementLink && (
          <Link className={s.textLink} to={content.announcementLink}>
            Learn more
            <Icon name="ArrowRight" size={14} />
          </Link>
        )}
      </div>
      <button
        className={s.iconButton}
        aria-label="Dismiss announcement"
        onClick={() => setDismissed(true)}
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  ) : null;
}
export function usePurchase() {
  const { refresh, notify } = useApp(),
    navigate = useNavigate();
  const [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [key, setKey] = useState("");
  const choose = (p) => {
    setSelected(p);
    setKey(crypto.randomUUID());
    setError("");
  };
  const close = useCallback(() => {
    if (!busy) setSelected(null);
  }, [busy]);
  async function buy() {
    setBusy(true);
    setError("");
    try {
      await api("/purchases", {
        method: "POST",
        body: { planId: selected._id },
        headers: { "Idempotency-Key": key },
      });
      setSelected(null);
      await refresh();
      notify("Plan activated. Your first earning is now in your wallet.");
      navigate("/my-plans");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const modal = selected ? (
    <Modal
      title="A new chapter starts here."
      close={close}
      className={s.purchaseModal}
    >
      <div className={s.confirmPlan}>
        <Tile icon={planIcon(selected)} size="large" />
        <div>
          <span className={s.eyebrow}>{selected.code}</span>
          <h3>{selected.name}</h3>
        </div>
        <strong>{currency(selected.price)}</strong>
      </div>
      <div className={s.detailRows}>
        <Detail label="Paid from" value="Deposit wallet" />
        <Detail
          label="First earning, credited now"
          value={currency(selected.daily)}
        />
        <Detail label="Number of credits" value="45" />
        <Detail
          label="Total scheduled earnings"
          value={currency(selected.total)}
        />
      </div>
      <Info>
        The purchase is deducted from your deposit wallet. Earnings are credited
        to your withdrawable wallet. The final credit reconciles the exact
        total.
      </Info>
      <ErrorText message={error} />
      <button className={s.primary} onClick={buy} disabled={busy}>
        {busy ? "Activating your plan…" : "Confirm & activate"}
        <Icon name="ArrowRight" size={17} />
      </button>
    </Modal>
  ) : null;
  return { choose, modal };
}
export function Detail({ label, value }) {
  return (
    <div className={s.detailRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
export function PlanCard({ plan: p, onChoose }) {
  return (
    <Card className={s.planCard}>
      <div className={s.planCardTop}>
        <Tile icon={planIcon(p)} tone={p.price >= 2500000 ? "sand" : "green"} />
        <span className={s.planCode}>{p.code}</span>
      </div>
      <div className={s.planCardName}>
        <h2>{p.name}</h2>
        <span>A considered step forward</span>
      </div>
      <div className={s.planCost}>
        <small>ONE-TIME PURCHASE</small>
        <strong>{currency(p.price)}</strong>
      </div>
      <div className={s.planMetrics}>
        <div>
          <span>Daily earning</span>
          <strong>{currency(p.daily)}</strong>
        </div>
        <div>
          <span>Your cycle</span>
          <strong>
            45 <small>credits</small>
          </strong>
        </div>
      </div>
      <div className={s.planTotal}>
        <span>Total scheduled earnings</span>
        <strong>{currency(p.total)}</strong>
      </div>
      <button className={s.primary} onClick={() => onChoose(p)}>
        Choose this plan
        <Icon name="ArrowUpRight" size={16} />
      </button>
      <Link to={`/plans/${p._id}`} className={s.planDetailLink}>
        A closer look
        <Icon name="ArrowRight" size={14} />
      </Link>
    </Card>
  );
}
export function Plans() {
  const state = useData("/plans"),
    purchase = usePurchase();
  return (
    <>
      <Heading
        eyebrow="THE PLAN COLLECTION"
        title="Find your next beginning."
        description="Twelve ways to start. One clear view of every term."
      />
      <PlanTabs />
      <div className={s.collectionBanner}>
        <div>
          <span className={s.eyebrow}>DESIGNED TO BE SIMPLE</span>
          <h2>Let your plan do the everyday work.</h2>
          <p>
            Your first credit arrives on activation. The next 44 follow every 24
            hours.
          </p>
        </div>
        <div className={s.collectionBadges}>
          <span>
            <Icon name="Clock" />
            45 credits
          </span>
          <span>
            <Icon name="RefreshCw" />
            Automatic earnings
          </span>
          <span>
            <Icon name="ShieldCheck" />
            Clear terms
          </span>
        </div>
      </div>
      <Load state={state}>
        {(plans) => (
          <div className={s.planGrid}>
            {plans.map((p) => (
              <PlanCard key={p._id} plan={p} onChoose={purchase.choose} />
            ))}
          </div>
        )}
      </Load>
      <Info className={s.pageFooterSpace}>
        The final daily credit adjusts by a few paisa where needed, so your
        total matches the amount shown exactly.
      </Info>
      {purchase.modal}
    </>
  );
}
export function PlanDetail() {
  const { id } = useParams(),
    state = useData(`/plans/${id}`),
    purchase = usePurchase();
  return (
    <Load state={state}>
      {(p) => (
        <>
          <Heading
            eyebrow="A CLOSER LOOK"
            title={p.name}
            description={
              p.description ||
              "Everything you need to know before your next step."
            }
            back="/plans"
          />
          <div className={s.detailLayout}>
            <div>
              <section className={`${s.balanceHero} ${s.planDetailHero}`}>
                <span className={s.heroLabel}>
                  {p.code} · THE ROBOTNETWORK COLLECTION
                </span>
                <h2>{currency(p.price)}</h2>
                <p>One purchase. 45 automatic credits.</p>
                <div className={s.heroTags}>
                  <span>{currency(p.daily)} daily</span>
                  <span>45-credit cycle</span>
                </div>
                <Orbit small />
              </section>
              <Card>
                <SectionTitle
                  title="Every term, clearly explained."
                  description="Your purchase keeps the terms shown when you activate it."
                />
                <div className={s.detailRows}>
                  <Detail label="Purchase amount" value={currency(p.price)} />
                  <Detail
                    label="First credit"
                    value={`${currency(p.daily)} immediately`}
                  />
                  <Detail
                    label="Credits 2–44"
                    value={`${currency(p.daily)} every 24 hours`}
                  />
                  <Detail
                    label="Final credit"
                    value={currency(p.total - p.daily * 44)}
                  />
                  <Detail
                    label="Total scheduled earnings"
                    value={currency(p.total)}
                  />
                  <Detail
                    label="Cycle completes"
                    value="After credit 45, 44 days after activation"
                  />
                  <Detail label="Purchase wallet" value="Deposit balance" />
                  <Detail
                    label="Earnings wallet"
                    value="Withdrawable wallet"
                  />
                </div>
              </Card>
            </div>
            <aside>
              <Card className={s.stickyCard}>
                <Tile icon={planIcon(p)} size="large" />
                <h2>Ready for what’s next?</h2>
                <p>
                  Review your purchase once more before activating your plan.
                </p>
                <button
                  className={s.primary}
                  onClick={() => purchase.choose(p)}
                >
                  Review & activate
                  <Icon name="ArrowRight" size={17} />
                </button>
                <Link className={s.textLink} to="/deposit">
                  Need to add funds?
                  <Icon name="Plus" size={14} />
                </Link>
              </Card>
              <Info className={s.teamFooterSpace}>
                Day 1 is included in the 45 credits. Your next earning is due 24
                hours after purchase.
              </Info>
            </aside>
          </div>
          {purchase.modal}
        </>
      )}
    </Load>
  );
}
export function MyPlans() {
  const state = useData("/purchases", 20000);
  const [tab, setTab] = useState("active");
  return (
    <>
      <Heading
        eyebrow="YOUR PERSONAL COLLECTION"
        title="Your progress, in perspective."
        description="A day-by-day view of the plans you’ve made your own."
      />
      <PlanTabs />
      <Load state={state}>
        {(items) => (
          <>
            <Tabs
              label="Plan status"
              value={tab}
              onChange={setTab}
              items={["active", "completed"].map((value) => ({
                value,
                label: value === "active" ? "In progress" : "Completed",
                count: items.filter((p) => p.status === value).length,
              }))}
            />
            {items.filter((p) => p.status === tab).length ? (
              <div className={s.portfolioGrid}>
                {items
                  .filter((p) => p.status === tab)
                  .map((p) => (
                    <Card className={s.portfolioCard} key={p._id}>
                      <div className={s.sectionHead}>
                        <div className={s.inline}>
                          <Tile icon="Layers" />
                          <div>
                            <span className={s.eyebrow}>YOUR PLAN</span>
                            <h2>{p.name}</h2>
                          </div>
                        </div>
                        <Badge status={p.status} />
                      </div>
                      <span className={s.statLabel}>Earned so far</span>
                      <div className={s.portfolioEarned}>
                        {currency(p.paid)}
                        <small>of {currency(p.total)}</small>
                      </div>
                      <div className={s.progress}>
                        <span
                          style={{
                            width: `${(p.creditedDays / p.duration) * 100}%`,
                          }}
                        />
                      </div>
                      <div className={s.progressCaption}>
                        <span>
                          Credit {p.creditedDays} of {p.duration}
                        </span>
                        <strong>
                          {Math.round((p.creditedDays / p.duration) * 100)}%
                        </strong>
                      </div>
                      <div className={s.detailRows}>
                        <Detail label="Purchased" value={date(p.createdAt)} />
                        <Detail
                          label="Next credit"
                          value={
                            p.status === "completed"
                              ? "Cycle complete"
                              : date(p.nextCreditAt)
                          }
                        />
                        <Detail
                          label="Daily earning"
                          value={currency(p.daily)}
                        />
                      </div>
                      <Link className={s.textLink} to="/earnings">
                        View earnings history
                        <Icon name="ArrowRight" size={16} />
                      </Link>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <Empty
                  title={
                    tab === "active"
                      ? "A fresh page, ready for your first plan."
                      : "Your completed cycles will live here."
                  }
                  text={
                    tab === "active"
                      ? "Explore the collection and choose the plan that suits your next step."
                      : "Keep track of each plan as its 45-credit cycle reaches completion."
                  }
                  action={
                    <Link className={s.primary} to="/plans">
                      Explore plans
                      <Icon name="ArrowRight" size={16} />
                    </Link>
                  }
                />
              </Card>
            )}
          </>
        )}
      </Load>
    </>
  );
}
export function Records({ type = "transactions" }) {
  const [page, setPage] = useState(1),
    [kind, setKind] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  const query = new URLSearchParams({
    page,
    ...(kind ? { kind } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  });
  const state = useData(`/${type}?${query}`, 20000);
  return (
    <>
      <Heading
        eyebrow={
          type === "earnings"
            ? "THE EARNINGS JOURNAL"
            : "YOUR FINANCIAL JOURNAL"
        }
        title={
          type === "earnings"
            ? "Every credit tells a story."
            : "The details make the difference."
        }
        description={
          type === "earnings"
            ? "Follow every automatic plan credit, from day one to completion."
            : "A connected record of your deposits, plans, earnings, commissions and withdrawals."
        }
      />
      {type === "transactions" && (
        <>
          <Tabs
            value={kind}
            onChange={(v) => {
              setKind(v);
              setPage(1);
            }}
            label="Transaction type"
            items={[
              ["", "All movements"],
              ["deposit", "Deposits"],
              ["withdrawal", "Withdrawals"],
              ["purchase", "Plans"],
              ["earning", "Earnings"],
              ["commission", "Commissions"],
              ["refund", "Refunds"],
            ].map(([value, label]) => ({ value, label }))}
          />
          <div className={s.filterBar}>
            <Icon name="SlidersHorizontal" size={17} />
            <Field label="From date">
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPage(1);
                }}
              />
            </Field>
            <Field label="To date">
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPage(1);
                }}
              />
            </Field>
            {(from || to) && (
              <button
                className={s.textButton}
                onClick={() => {
                  setFrom("");
                  setTo("");
                  setPage(1);
                }}
              >
                Reset dates
              </button>
            )}
          </div>
        </>
      )}
      <Card>
        <Load state={state}>
          {(d) => (
            <>
              {type === "transactions" ? (
                <Transactions items={d.items} />
              ) : d.items.length ? (
                <div className={s.transactionList}>
                  {d.items.map((e) => (
                    <div className={s.transaction} key={e._id}>
                      <Tile icon="TrendingUp" />
                      <div className={s.transactionBody}>
                        <strong>Day {e.day} · Automatic plan earning</strong>
                        <small>{date(e.earnedAt)}</small>
                        <span className={s.transactionMeta}>
                          Plan reference {e.purchase.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className={s.transactionAmount}>
                        <b className={s.positive}>+{currency(e.amount)}</b>
                        <small>Credited</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  icon="TrendingUp"
                  title="Your first credit is the beginning."
                  text="Activate a plan to receive your first earning immediately."
                  action={
                    <Link className={s.primary} to="/plans">
                      Discover plans
                      <Icon name="ArrowRight" size={16} />
                    </Link>
                  }
                />
              )}
              <Pager data={d} page={page} setPage={setPage} />
            </>
          )}
        </Load>
      </Card>
    </>
  );
}
export function Team() {
  const state = useData("/team", 30000),
    [level, setLevel] = useState(1),
    { notify } = useApp();
  return (
    <>
      <Heading
        eyebrow="YOUR PEOPLE, YOUR POSSIBILITIES"
        title="A network worth nurturing."
        description="Invite people you know. Keep every connection in perspective."
      />
      <Load state={state}>
        {(d) => {
          const url = `${window.location.origin}/register?ref=${d.referralCode}`,
            selected = d.levels.find((l) => l.level === level);
          return (
            <>
              <div className={s.networkTop}>
                <section className={`${s.balanceHero} ${s.referralHero}`}>
                  <span className={s.heroLabel}>YOUR PERSONAL INVITATION</span>
                  <h2>{d.referralCode}</h2>
                  <p>A small invitation. A new connection.</p>
                  <div className={s.copyInput}>
                    <input aria-label="Invitation link" readOnly value={url} />
                    <button
                      onClick={() => copyText(url, notify)}
                      aria-label="Copy invitation link"
                    >
                      <Icon name="Copy" size={17} />
                    </button>
                  </div>
                  <div className={s.heroButtons}>
                    <button
                      className={s.heroPrimary}
                      onClick={() => copyText(url, notify)}
                    >
                      <Icon name="Link2" size={16} />
                      Copy invitation
                    </button>
                    <Link className={s.heroSecondary} to="/faq">
                      How it works
                      <Icon name="ArrowUpRight" size={16} />
                    </Link>
                  </div>
                  <Orbit small />
                </section>
                <Card className={s.networkRewards}>
                  <Tile icon="Network" tone="sand" />
                  <span className={s.eyebrow}>NETWORK COMMISSIONS</span>
                  <h2>{currency(d.totalCommissions)}</h2>
                  <p>
                    Credited from approved deposits across three referral
                    levels.
                  </p>
                  <div className={s.rateRow}>
                    {d.levels.map((l) => (
                      <div key={l.level}>
                        <strong>{l.rate}%</strong>
                        <small>Level {l.level}</small>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div className={s.statsGridThree}>
                {d.levels.map((l) => (
                  <Stat
                    key={l.level}
                    label={`Level ${l.level} connections`}
                    value={l.count}
                    icon="Users"
                    note={`${l.rate}% on approved deposits`}
                    tone={l.level === 3 ? "sand" : "green"}
                  />
                ))}
              </div>
              <Card>
                <SectionTitle
                  title="The people in your network"
                  description="Three levels, one connected view."
                />
                <Tabs
                  label="Network level"
                  value={level}
                  onChange={setLevel}
                  items={d.levels.map((l) => ({
                    value: l.level,
                    label: `Level ${l.level}`,
                    count: l.count,
                  }))}
                />
                {selected.members.length ? (
                  <div className={s.memberGrid}>
                    {selected.members.map((m) => (
                      <div className={s.memberItem} key={m._id}>
                        <Avatar name={m.name} />
                        <div>
                          <strong>{m.name}</strong>
                          <small>Joined {date(m.createdAt)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    icon="Users"
                    title={`Your level ${level} connections start here.`}
                    text="Share your personal invitation link to begin growing your network."
                  />
                )}
              </Card>
              <Info className={s.teamFooterSpace}>
                Commissions are credited only when a deposit is approved. Daily
                plan earnings do not generate team commissions.
              </Info>
            </>
          );
        }}
      </Load>
    </>
  );
}
export function DepositPage() {
  const settings = useData("/public/settings"),
    recent = useData("/deposits?page=1", 20000),
    { notify } = useApp();
  const [step, setStep] = useState(1),
    [amount, setAmount] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fileName, setFileName] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = new FormData(e.currentTarget);
    body.set("amount", amount);
    const file = body.get("screenshot");
    if (file?.size > 5 * 1024 * 1024) {
      setError("Choose a screenshot smaller than 5MB.");
      setBusy(false);
      return;
    }
    try {
      await api("/deposits", { method: "POST", body });
      setStep(3);
      recent.reload();
      notify("Your deposit is submitted for manual review.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="ADD FUNDS, WITH CLARITY"
        title="Your next step starts here."
        description="A simple Easypaisa transfer. A manual review. A clear record."
      />
      <div className={s.paymentLayout}>
        <div>
          <div className={s.stepper}>
            {["Choose amount", "Transfer & submit", "Under review"].map(
              (x, i) => (
                <div key={x} className={step >= i + 1 ? s.stepActive : ""}>
                  <span>
                    {step > i + 1 ? <Icon name="Check" size={13} /> : i + 1}
                  </span>
                  <strong>{x}</strong>
                </div>
              ),
            )}
          </div>
          <Card className={s.paymentForm}>
            {step === 1 ? (
              <>
                <SectionTitle
                  title="How much would you like to add?"
                  description="Your deposit wallet is reserved for plan purchases."
                />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                    setError("");
                  }}
                >
                  <div className={s.paymentMethod}>
                    <InstitutionMark
                      institution="easypaisa"
                      monogram="EP"
                      label="Easypaisa"
                    />
                    <div>
                      <strong>Easypaisa</strong>
                      <small>Manual bank transfer</small>
                    </div>
                    <Icon name="CheckCircle2" size={22} />
                  </div>
                  <Field label="Amount in PKR">
                    <div className={s.amountInput}>
                      <span>Rs</span>
                      <input
                        aria-label="Deposit amount"
                        type="number"
                        min="0.01"
                        max="10000000"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </Field>
                  <div className={s.presets}>
                    {[500, 800, 1500, 5000, 10000, 25000].map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={Number(amount) === v ? s.presetActive : ""}
                        onClick={() => setAmount(String(v))}
                      >
                        {v.toLocaleString("en-PK")}
                      </button>
                    ))}
                  </div>
                  <Info>
                    Transfer only the amount you submit. You’ll add your
                    transaction ID and screenshot in the next step.
                  </Info>
                  <button
                    className={s.primary}
                    disabled={Number(amount) < 500}
                  >
                    Continue to transfer details
                    <Icon name="ArrowRight" size={17} />
                  </button>
                </form>
              </>
            ) : step === 2 ? (
              <>
                <SectionTitle
                  title="Make your Easypaisa transfer."
                  description="Use the account details below, then send your payment proof."
                />
                <Load state={settings}>
                  {(d) => (
                    <div className={s.receivingAccount}>
                      <div className={s.inline}>
                        <InstitutionMark
                          institution="easypaisa"
                          monogram="EP"
                          label="Easypaisa"
                        />
                        <strong>Easypaisa receiving account</strong>
                      </div>
                      <Detail label="Account title" value={d.accountName} />
                      <div className={s.accountNumber}>
                        <span>{d.accountNumber}</span>
                        <button
                          aria-label="Copy receiving account number"
                          onClick={() => copyText(d.accountNumber, notify)}
                        >
                          <Icon name="Copy" size={17} />
                        </button>
                      </div>
                      <Detail
                        label="Transfer amount"
                        value={currency(Math.round(Number(amount) * 100))}
                      />
                    </div>
                  )}
                </Load>
                <form onSubmit={submit}>
                  <Field
                    label="Transaction ID (TID)"
                    name="tid"
                    pattern={"[A-Za-z0-9\\-]{5,80}"}
                    required
                    maxLength={80}
                    hint="Use the transaction ID from your Easypaisa receipt."
                  />
                  <Field
                    label="Payment screenshot"
                    hint="PNG, JPEG or WebP. Up to 5MB."
                  >
                    <div className={s.fileUpload}>
                      <Icon name="Upload" size={25} />
                      <strong>
                        {fileName || "Choose your transfer receipt"}
                      </strong>
                      <span>Click to browse your files</span>
                      <input
                        aria-label="Payment screenshot"
                        name="screenshot"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        required
                        onChange={(e) =>
                          setFileName(e.target.files?.[0]?.name || "")
                        }
                      />
                    </div>
                  </Field>
                  <ErrorText message={error} />
                  <div className={s.formActions}>
                    <button
                      className={s.secondary}
                      type="button"
                      disabled={busy}
                      onClick={() => setStep(1)}
                    >
                      <Icon name="ArrowLeft" size={16} />
                      Back
                    </button>
                    <button className={s.primary} disabled={busy}>
                      {busy ? "Submitting receipt…" : "Submit for review"}
                      <Icon name="ArrowRight" size={17} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <Empty
                icon="CheckCircle2"
                title="Your transfer is in good hands."
                text="Your deposit request is recorded. An administrator will verify the transfer before updating your deposit wallet."
                action={
                  <>
                    <Link className={s.primary} to="/deposits/history">
                      Track my deposit
                      <Icon name="ArrowRight" size={16} />
                    </Link>
                    <button
                      className={s.textButton}
                      onClick={() => {
                        setStep(1);
                        setAmount("");
                        setFileName("");
                      }}
                    >
                      Make another deposit
                    </button>
                  </>
                }
              />
            )}
          </Card>
          <Info>
            Deposit principal cannot be withdrawn. Approved funds can only be
            used to buy plans.
          </Info>
        </div>
        <aside>
          <Card className={s.paymentAside}>
            <Tile icon="ShieldCheck" size="large" />
            <h2>
              Simple. Manual.
              <br />
              Always recorded.
            </h2>
            <p>
              We keep a record of your transfer, review decision, and wallet
              credit.
            </p>
            <ol>
              <li>Transfer using Easypaisa</li>
              <li>Submit your receipt & TID</li>
              <li>Admin verifies your request</li>
            </ol>
          </Card>
          <Link className={s.listLink} to="/deposits/history">
            <Tile icon="History" />
            <div>
              <strong>Deposit history</strong>
              <small>Every request and its status</small>
            </div>
            <Icon name="ChevronRight" size={16} />
          </Link>
          <Link className={s.listLink} to="/support">
            <Tile icon="LifeBuoy" tone="neutral" />
            <div>
              <strong>A question about your transfer?</strong>
              <small>We’re here to help</small>
            </div>
            <Icon name="ChevronRight" size={16} />
          </Link>
        </aside>
      </div>
      <Card>
        <SectionTitle
          title="Recent deposit requests"
          action={
            <Link className={s.textLink} to="/deposits/history">
              View all
              <Icon name="ArrowRight" size={15} />
            </Link>
          }
        />
        <Load state={recent}>
          {(d) => <PaymentRows items={d.items.slice(0, 4)} type="deposits" />}
        </Load>
      </Card>
    </>
  );
}
export function WithdrawPage() {
  const state = useData("/overview", 15000),
    institutions = useData("/institutions"),
    { refresh, notify } = useApp();
  const [bank, setBank] = useState("easypaisa"),
    [amount, setAmount] = useState(""),
    [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [key, setKey] = useState("");
  const close = useCallback(() => {
    if (!busy) setSelected(null);
  }, [busy]);
  async function request() {
    setBusy(true);
    setError("");
    try {
      await api("/withdrawals", {
        method: "POST",
        body: selected,
        headers: { "Idempotency-Key": key },
      });
      setSelected(null);
      setAmount("");
      state.reload();
      await refresh();
      notify(
        "Withdrawal requested. Your funds are reserved for manual processing.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="EARNINGS, ON YOUR TERMS"
        title="Make your next move."
        description="Request a manual withdrawal to your Pakistani bank or wallet, any time."
      />
      <Load state={state}>
        {(d) => (
          <div className={s.paymentLayout}>
            <div>
              <section className={`${s.balanceHero} ${s.withdrawHero}`}>
                <span className={s.heroLabel}>AVAILABLE TO WITHDRAW</span>
                <h2>{currency(d.user.withdrawableBalance)}</h2>
                <p>Your plan earnings and referral commissions.</p>
                <div className={s.heroTags}>
                  <span>
                    <Icon name="Clock" size={13} />
                    Open 24/7
                  </span>
                  <span>Minimum Rs 200</span>
                </div>
                <Orbit small />
              </section>
              <Card className={s.paymentForm}>
                <SectionTitle
                  title="Where should your earnings go?"
                  description="Check your account details before submitting."
                />
                {d.activePlans === 0 && (
                  <Info tone="warning">
                    An active plan is required.{" "}
                    <Link className={s.textLink} to="/plans">
                      Explore plans
                      <Icon name="ArrowRight" size={14} />
                    </Link>
                  </Info>
                )}
                <Load state={institutions}>
                  {(banks) => (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = Object.fromEntries(
                          new FormData(e.currentTarget),
                        );
                        form.amount = Number(form.amount);
                        setSelected(form);
                        setKey(crypto.randomUUID());
                        setError("");
                      }}
                    >
                      <Field label="Amount in PKR">
                        <div className={s.amountInput}>
                          <span>Rs</span>
                          <input
                            aria-label="Withdrawal amount"
                            type="number"
                            name="amount"
                            min="200"
                            max={d.user.withdrawableBalance / 100}
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      </Field>
                      <button
                        type="button"
                        className={s.textButton}
                        onClick={() =>
                          setAmount(String(d.user.withdrawableBalance / 100))
                        }
                      >
                        Use available balance
                      </button>
                      <Field label="Bank or wallet">
                        <InstitutionPicker
                          institutions={banks}
                          value={bank}
                          onChange={setBank}
                        />
                        <input type="hidden" name="institution" value={bank} />
                      </Field>
                      <div className={s.bankSelected}>
                        <InstitutionMark
                          institution={bank}
                          monogram={banks.find((b) => b.id === bank)?.monogram}
                          label={banks.find((b) => b.id === bank)?.name}
                        />
                        <strong>
                          {banks.find((b) => b.id === bank)?.name}
                        </strong>
                        <Icon name="CheckCircle2" size={18} />
                      </div>
                      <div className={s.formGrid}>
                        <Field
                          label="Account holder name"
                          name="accountName"
                          maxLength={160}
                          required
                        />
                        <Field
                          label="Account number or IBAN"
                          name="accountNumber"
                          pattern={"[A-Za-z0-9 \\-]{6,40}"}
                          maxLength={40}
                          required
                        />
                      </div>
                      <button
                        className={s.primary}
                        disabled={
                          d.activePlans === 0 ||
                          d.user.withdrawableBalance < 20000
                        }
                      >
                        Review withdrawal
                        <Icon name="ArrowUpRight" size={17} />
                      </button>
                      {d.user.withdrawableBalance < 20000 && (
                        <p className={s.formFootnote}>
                          You need at least Rs 200 in your withdrawable wallet.
                        </p>
                      )}
                    </form>
                  )}
                </Load>
              </Card>
            </div>
            <aside>
              <Card className={s.paymentAside}>
                <Tile icon="Clock" tone="sand" size="large" />
                <h2>
                  Your request.
                  <br />A human review.
                </h2>
                <p>
                  Requests are open 24/7. An administrator checks and pays your
                  nominated account manually.
                </p>
                <div className={s.detailRows}>
                  <Detail label="Minimum amount" value="Rs 200" />
                  <Detail label="Eligibility" value="An active plan" />
                  <Detail label="Source wallet" value="Withdrawable only" />
                </div>
              </Card>
              <Info>
                Funds are reserved when you submit. If a request is rejected,
                the full reserved amount returns to your withdrawable wallet.
              </Info>
              <Link to="/withdrawals/history" className={s.listLink}>
                <Tile icon="History" />
                <div>
                  <strong>Withdrawal history</strong>
                  <small>Track every request</small>
                </div>
                <Icon name="ChevronRight" size={16} />
              </Link>
              <Link to="/support" className={s.listLink}>
                <Tile icon="LifeBuoy" tone="neutral" />
                <div>
                  <strong>Need a hand?</strong>
                  <small>Talk to support</small>
                </div>
                <Icon name="ChevronRight" size={16} />
              </Link>
            </aside>
          </div>
        )}
      </Load>
      {selected && (
        <Modal title="One last look." close={close}>
          <p className={s.modalDescription}>
            Make sure the destination is correct before reserving your earnings
            for withdrawal.
          </p>
          <div className={s.confirmAmount}>
            {currency(Math.round(selected.amount * 100))}
            <small>MANUAL WITHDRAWAL</small>
          </div>
          <div className={s.detailRows}>
            <Detail
              label="Bank or wallet"
              value={
                selected.customInstitution ||
                institutions.data?.find((b) => b.id === selected.institution)
                  ?.name
              }
            />
            <Detail label="Account holder" value={selected.accountName} />
            <Detail label="Account / IBAN" value={selected.accountNumber} />
          </div>
          <Info>
            Your earnings are reserved when you confirm. Deposit funds remain
            separate and cannot be withdrawn.
          </Info>
          <ErrorText message={error} />
          <button className={s.primary} onClick={request} disabled={busy}>
            {busy ? "Submitting…" : "Confirm withdrawal"}
            <Icon name="ArrowRight" size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
export function PaymentRows({ items, type }) {
  const [image, setImage] = useState(""),
    { notify } = useApp();
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image);
    },
    [image],
  );
  return (
    <>
      {items.length ? (
        <div className={s.transactionList}>
          {items.map((x) => (
            <div className={s.transaction} key={x._id}>
              <Tile
                icon={type === "deposits" ? "ArrowDownLeft" : "ArrowUpRight"}
                tone={x.status === "rejected" ? "neutral" : "green"}
              />
              <div className={s.transactionBody}>
                <strong>
                  {type === "deposits"
                    ? "Easypaisa deposit"
                    : "Manual withdrawal"}
                </strong>
                <small>
                  {date(x.createdAt)} · {x.tid || x.accountNumber}
                </small>
                <span className={s.transactionMeta}>
                  Ref {x._id.slice(-8).toUpperCase()}
                </span>
                {x.note && <p className={s.reviewNote}>{x.note}</p>}
                {type === "deposits" && (
                  <button
                    className={s.inlineButton}
                    onClick={async () => {
                      try {
                        setImage(await proof(x._id));
                      } catch (e) {
                        notify(e.message, true);
                      }
                    }}
                  >
                    View receipt
                    <Icon name="ExternalLink" size={12} />
                  </button>
                )}
              </div>
              <div className={s.transactionAmount}>
                <b>{currency(x.amount)}</b>
                <Badge status={x.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon="History"
          title="Your records start with your first request."
          text="Every request and its review status will be available here."
        />
      )}
      {image && (
        <Modal title="Your payment receipt" close={() => setImage("")}>
          <img
            className={s.proofImage}
            src={image}
            alt="Uploaded payment receipt"
          />
        </Modal>
      )}
    </>
  );
}
export function PaymentHistory({ type }) {
  const [page, setPage] = useState(1),
    [status, setStatus] = useState("");
  const state = useData(
      `/${type}?page=${page}${status ? `&status=${status}` : ""}`,
      15000,
    ),
    summary = useData("/me/summary", 15000);
  return (
    <>
      <Heading
        eyebrow="YOUR PAYMENT JOURNAL"
        title={
          type === "deposits"
            ? "Every transfer, in one place."
            : "Follow your earnings home."
        }
        description="Your requests, review decisions, and payment records."
        back={type === "deposits" ? "/deposit" : "/withdraw"}
        action={
          <Link
            className={s.primary}
            to={type === "deposits" ? "/deposit" : "/withdraw"}
          >
            <Icon name="Plus" size={16} />
            New request
          </Link>
        }
      />
      {summary.data && (
        <div className={s.statsGridThree}>
          {(type === "deposits"
            ? ["pending", "approved", "rejected"]
            : ["pending", "paid", "rejected"]
          ).map((status, i) => {
            const row = summary.data[type].find((x) => x._id === status);
            return (
              <Stat
                key={status}
                label={
                  status === "pending"
                    ? "Awaiting review"
                    : status === "rejected"
                      ? "Rejected requests"
                      : type === "deposits"
                        ? "Approved deposits"
                        : "Paid withdrawals"
                }
                value={currency(row?.amount || 0)}
                note={`${row?.count || 0} requests`}
                icon={i === 0 ? "Clock" : i === 1 ? "CheckCircle2" : "History"}
                tone={i === 0 ? "sand" : i === 1 ? "green" : "neutral"}
              />
            );
          })}
        </div>
      )}
      <Tabs
        value={status}
        onChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
        items={[
          "",
          "pending",
          type === "deposits" ? "approved" : "paid",
          "rejected",
        ].map((value) => ({ value, label: value || "All requests" }))}
      />
      <Card>
        <Load state={state}>
          {(d) => (
            <>
              <PaymentRows items={d.items} type={type} />
              <Pager data={d} page={page} setPage={setPage} />
            </>
          )}
        </Load>
      </Card>
      <Info>
        {type === "deposits"
          ? "Only approved deposits are added to your deposit balance."
          : "Pending withdrawals are reserved. Rejected requests are refunded once. Paid requests record an externally completed payment."}
      </Info>
    </>
  );
}
export function Account() {
  const { user, logout } = useApp();
  return (
    <>
      <Heading
        eyebrow="YOUR ACCOUNT"
        title="A space that feels like you."
        description="Your details, preferences, and everyday essentials."
      />
      <section className={s.profileHero}>
        <Avatar name={user.name} src={user.avatar} large />
        <div>
          <span className={s.eyebrow}>ROBOTNETWORK MEMBER</span>
          <h2>{user.name}</h2>
          <p>{user.phone || "Phone number not added"}</p>
          <Badge status="active" />
        </div>
        <div className={s.profileSince}>
          <Icon name="Leaf" size={28} />
          <small>Member since</small>
          <strong>
            {new Date(user.createdAt).toLocaleDateString("en-PK", {
              month: "long",
              year: "numeric",
            })}
          </strong>
        </div>
      </section>
      <div className={s.quickGrid}>
        <ActionCard
          to="/deposit"
          icon="ArrowDownLeft"
          title="Add funds"
          description="A manual Easypaisa transfer"
        />
        <ActionCard
          to="/withdraw"
          icon="ArrowUpRight"
          title="Withdraw earnings"
          description="To your bank or wallet"
          tone="neutral"
        />
        <ActionCard
          to="/activity"
          icon="History"
          title="See your activity"
          description="All your wallet movements"
          tone="sand"
        />
      </div>
      <div className={s.accountGrid}>
        <Card>
          <SectionTitle
            title="Your essentials"
            description="Everything you need, within reach."
          />
          {[
            [
              "/account/profile",
              "UserRound",
              "Personal details",
              "Manage your name and phone number",
            ],
            [
              "/account/security",
              "ShieldCheck",
              "Sign-in & security",
              "Update your password",
            ],
            [
              "/notifications",
              "Bell",
              "Notifications",
              "Payment requests and review updates",
            ],
          ].map(([to, icon, title, description]) => (
            <LinkRow key={to} {...{ to, icon, title, description }} />
          ))}
        </Card>
        <Card>
          <SectionTitle
            title="Your workspace"
            description="Keep a closer eye on what matters."
          />
          {[
            [
              "/my-plans",
              "Layers",
              "My portfolio",
              "Active and completed plans",
            ],
            [
              "/deposits/history",
              "ArrowDownLeft",
              "Deposit history",
              "Your transfers and approvals",
            ],
            [
              "/withdrawals/history",
              "ArrowUpRight",
              "Withdrawal history",
              "Track your manual payouts",
            ],
            [
              "/team",
              "Network",
              "My network",
              "Your invitation and connections",
            ],
          ].map(([to, icon, title, description]) => (
            <LinkRow key={to} {...{ to, icon, title, description }} />
          ))}
        </Card>
      </div>
      <Card>
        <SectionTitle title="A little guidance" />
        {[
          ["/support", "LifeBuoy", "Help & support", "Get help from the team"],
          [
            "/faq",
            "MessageSquare",
            "Frequently asked questions",
            "Clear answers about how things work",
          ],
        ].map(([to, icon, title, description]) => (
          <LinkRow key={to} {...{ to, icon, title, description }} />
        ))}
      </Card>
      <button className={s.logoutWide} onClick={logout}>
        <Icon name="LogOut" size={17} />
        Sign out of RobotNetwork
      </button>
    </>
  );
}
function LinkRow({ to, icon, title, description }) {
  return (
    <Link to={to} className={s.linkRow}>
      <Tile icon={icon} />
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
      <Icon name="ChevronRight" size={16} />
    </Link>
  );
}
export function Profile() {
  const { user, refresh, notify } = useApp(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [photo, setPhoto] = useState(null),
    [photoPreview, setPhotoPreview] = useState("");
  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  async function savePhoto() {
    if (!photo) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("avatar", photo);
      await api("/me/avatar", { method: "POST", body });
      setPhoto(null);
      await refresh();
      notify("Your profile photo has been saved.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/me", {
        method: "PATCH",
        body: Object.fromEntries(new FormData(e.currentTarget)),
      });
      await refresh();
      notify("Your personal details have been updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="YOUR PERSONAL DETAILS"
        title="The person behind the plan."
        description="Keep your account details up to date."
        back="/account"
      />
      <div className={s.profileLayout}>
        <Card className={s.profileSummary}>
          <div className={s.profilePhotoEditor}>
            <Avatar name={user.name} src={photoPreview || user.avatar} large />
            <label className={s.profilePhotoButton} title="Change profile photo">
              <Icon name="Camera" size={16} />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <h2>{user.name}</h2>
          <p>{user.phone || "Phone number not added"}</p>
          {photo && (
            <button
              type="button"
              className={s.secondary}
              onClick={savePhoto}
              disabled={busy}
            >
              {busy ? "Saving…" : "Save profile photo"}
              <Icon name="Check" size={16} />
            </button>
          )}
          <div className={s.referralMini}>
            <span>{user.referralCode}</span>
            <Icon name="Network" size={17} />
          </div>
          <small>Your personal referral code</small>
        </Card>
        <Card>
          <SectionTitle title="Personal information" />
          <form onSubmit={save}>
            <Field
              label="Full name"
              name="name"
              defaultValue={user.name}
              required
              maxLength={160}
            />
            <Field
              label="Phone number"
              name="phone"
              defaultValue={user.phone}
              pattern={"[+0-9 \\(\\)\\-]{0,24}"}
              maxLength={24}
            />
            <ErrorText message={error} />
            <button className={s.primary} disabled={busy}>
              {busy ? "Saving…" : "Save my details"}
              <Icon name="Check" size={16} />
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
export function Security() {
  const { notify } = useApp(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save(e) {
    e.preventDefault();
    const form = e.currentTarget,
      body = Object.fromEntries(new FormData(form));
    if (body.newPassword !== body.confirm) {
      setError("The new passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    delete body.confirm;
    try {
      const data = await api("/me/password", { method: "POST", body });
      sessionStorage.setItem("rn_token", data.token);
      form.reset();
      notify("Password updated. Previous sessions have been signed out.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="SIGN-IN & SECURITY"
        title="A little peace of mind."
        description="Take care of the key to your workspace."
        back="/account"
      />
      <div className={s.paymentLayout}>
        <Card>
          <SectionTitle
            title="Update your password"
            description="Choose a unique password with at least 10 characters."
          />
          <form onSubmit={save}>
            <Field
              label="Current password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />
            <Field
              label="New password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
            <Field
              label="Confirm new password"
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
            <ErrorText message={error} />
            <button className={s.primary} disabled={busy}>
              {busy ? "Updating…" : "Update password"}
              <Icon name="ShieldCheck" size={17} />
            </button>
          </form>
        </Card>
        <Card className={s.paymentAside}>
          <Tile icon="Lock" size="large" />
          <h2>
            Your workspace.
            <br />
            Your responsibility.
          </h2>
          <p>
            Never share your password, even with someone who says they’re from
            support.
          </p>
          <Info>
            Changing your password invalidates previous sign-in tokens. Your
            current browser receives a new session.
          </Info>
        </Card>
      </div>
    </>
  );
}
export function Notifications() {
  const state = useData("/notifications", 15000),
    { notify } = useApp();
  async function read() {
    try {
      await api("/notifications/read", { method: "POST" });
      state.reload();
      notify("You’re all caught up.");
    } catch (e) {
      notify(e.message, true);
    }
  }
  return (
    <>
      <Heading
        eyebrow="KEEPING YOU IN THE LOOP"
        title="Your latest updates."
        description="Payment requests and review decisions, in one place."
        action={
          <button className={s.secondary} onClick={read}>
            <Icon name="Check" size={16} />
            Mark all as read
          </button>
        }
      />
      <Card>
        <Load state={state}>
          {(d) =>
            d.items.length ? (
              <div className={s.notificationList}>
                {d.items.map((n) => (
                  <Link
                    to={n.link}
                    key={n._id}
                    className={`${s.notificationRow} ${!n.read ? s.notificationUnread : ""}`}
                  >
                    <Tile
                      icon={
                        n.title.includes("rejected") ? "AlertCircle" : "Bell"
                      }
                      tone={n.title.includes("rejected") ? "rose" : "green"}
                    />
                    <div>
                      <strong>{n.title}</strong>
                      <p>{n.body}</p>
                      <small>{date(n.at)}</small>
                    </div>
                    {!n.read && <i />}
                    <Icon name="ChevronRight" size={15} />
                  </Link>
                ))}
              </div>
            ) : (
              <Empty
                icon="Bell"
                title="A little quiet, for now."
                text="Updates will arrive as your payment requests move forward."
              />
            )
          }
        </Load>
      </Card>
    </>
  );
}
export function Support() {
  const contacts = useData("/public/settings"),
    [page, setPage] = useState(1),
    tickets = useData(`/tickets?page=${page}`, 20000),
    [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    { notify } = useApp(),
    navigate = useNavigate();
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const t = await api("/tickets", {
        method: "POST",
        body: Object.fromEntries(new FormData(e.currentTarget)),
      });
      setOpen(false);
      notify("Your message is on its way to the support team.");
      navigate(`/support/${t._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="THE HELP CENTER"
        title="A real person. A little guidance."
        description="Questions about your wallet, plans, or payments? Let’s work through them."
        action={
          <button
            className={s.primary}
            onClick={() => {
              setOpen(true);
              setError("");
            }}
          >
            <Icon name="Plus" size={16} />
            New support request
          </button>
        }
      />
      <div className={s.supportGrid}>
        <Card>
          <SectionTitle
            title="Your conversations"
            description="A record of every question and reply."
          />
          <Load state={tickets}>
            {(d) => (
              <>
                {d.items.length ? (
                  <div>
                    {d.items.map((t) => (
                      <Link
                        to={`/support/${t._id}`}
                        className={s.ticketRow}
                        key={t._id}
                      >
                        <Tile icon="MessageSquare" />
                        <div>
                          <strong>{t.subject}</strong>
                          <small>
                            {t.category} · {date(t.updatedAt)}
                          </small>
                        </div>
                        <Badge status={t.status} />
                        <Icon name="ChevronRight" size={15} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty
                    icon="MessageSquare"
                    title="We’re ready when you need us."
                    text="Open a support request and tell us what’s on your mind."
                    action={
                      <button
                        className={s.primary}
                        onClick={() => setOpen(true)}
                      >
                        Start a conversation
                        <Icon name="Plus" size={16} />
                      </button>
                    }
                  />
                )}
                <Pager data={d} page={page} setPage={setPage} />
              </>
            )}
          </Load>
        </Card>
        <aside>
          <Card className={s.paymentAside}>
            <Tile icon="LifeBuoy" tone="sand" size="large" />
            <h2>
              A direct line
              <br />
              to a little help.
            </h2>
            <Load state={contacts}>
              {(d) => (
                <div className={s.contactLinks}>
                  {d.supportEmail && (
                    <a href={`mailto:${d.supportEmail}`}>
                      <Icon name="Mail" size={17} />
                      {d.supportEmail}
                    </a>
                  )}
                  {d.supportPhone && (
                    <a
                      className={s.whatsappSupportButton}
                      href={whatsappUrl(d.supportPhone)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name="MessageSquare" size={17} />
                      <span>
                        <strong>Chat on WhatsApp</strong>
                        <small>{d.supportPhone}</small>
                      </span>
                      <Icon name="ExternalLink" size={16} />
                    </a>
                  )}
                </div>
              )}
            </Load>
            <Info>
              Include the transaction ID or request reference when asking about
              a payment. Never send your password.
            </Info>
          </Card>
          <Link className={s.listLink} to="/faq">
            <Tile icon="MessageSquare" />
            <div>
              <strong>Good questions. Clear answers.</strong>
              <small>Read our FAQs</small>
            </div>
            <Icon name="ChevronRight" size={16} />
          </Link>
        </aside>
      </div>
      {open && (
        <Modal title="How can we help?" close={() => !busy && setOpen(false)}>
          <form onSubmit={create}>
            <Field
              label="Subject"
              name="subject"
              minLength={3}
              maxLength={160}
              required
            />
            <Field label="Category">
              <select name="category">
                {["account", "deposit", "withdrawal", "plan", "other"].map(
                  (x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Your message">
              <textarea
                name="message"
                minLength={5}
                maxLength={4000}
                rows={5}
                required
              />
            </Field>
            <ErrorText message={error} />
            <button className={s.primary} disabled={busy}>
              {busy ? "Sending…" : "Send request"}
              <Icon name="Send" size={16} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function TicketThread({ admin = false }) {
  const { id } = useParams(),
    state = useData(`${admin ? "/admin" : ""}/tickets/${id}`, 15000),
    { notify } = useApp(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function reply(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    try {
      await api(`${admin ? "/admin" : ""}/tickets/${id}/replies`, {
        method: "POST",
        body: { message: new FormData(form).get("message") },
      });
      form.reset();
      state.reload();
      notify("Your reply has been sent.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function toggle(status) {
    try {
      await api(`/admin/tickets/${id}`, { method: "PATCH", body: { status } });
      state.reload();
    } catch (e) {
      notify(e.message, true);
    }
  }
  return (
    <Load state={state}>
      {(t) => (
        <>
          <Heading
            eyebrow={admin ? "SUPPORT INBOX" : "YOUR SUPPORT CONVERSATION"}
            title={t.subject}
            description={`${t.category} · Opened ${date(t.createdAt)}`}
            back={admin ? "/admin/tickets" : "/support"}
            action={
              admin ? (
                <button
                  className={s.secondary}
                  onClick={() =>
                    toggle(t.status === "open" ? "closed" : "open")
                  }
                >
                  {t.status === "open" ? "Close request" : "Reopen request"}
                </button>
              ) : (
                <Badge status={t.status} />
              )
            }
          />
          <Card className={s.threadCard}>
            {admin && (
              <Info>
                {t.user?.name}
              </Info>
            )}
            <div className={s.messages}>
              {t.messages.map((m) => (
                <div
                  key={m._id}
                  className={`${s.message} ${m.role === "admin" ? s.messageAdmin : ""}`}
                >
                  <span>
                    {m.role === "admin" ? "RobotNetwork support" : "Member"}
                    <small>{date(m.createdAt)}</small>
                  </span>
                  <p>{m.body}</p>
                </div>
              ))}
            </div>
            {t.status === "open" ? (
              <form onSubmit={reply}>
                <Field label="Your reply">
                  <textarea
                    name="message"
                    rows={4}
                    minLength={1}
                    maxLength={4000}
                    required
                  />
                </Field>
                <ErrorText message={error} />
                <button className={s.primary} disabled={busy}>
                  {busy ? "Sending…" : "Send reply"}
                  <Icon name="Send" size={16} />
                </button>
              </form>
            ) : (
              <Info>
                This conversation is closed.{" "}
                {admin
                  ? "You can reopen it using the button above."
                  : "Open a new support request if you need more help."}
              </Info>
            )}
          </Card>
        </>
      )}
    </Load>
  );
}
export function FAQ() {
  const state = useData("/public/content");
  return (
    <>
      <Heading
        eyebrow="GOOD QUESTIONS. CLEAR ANSWERS."
        title="A little more clarity."
        description="Understand your wallet, your plans, and the way everything connects."
        back="/support"
      />
      <Load state={state}>
        {(d) => (
          <div className={s.faqLayout}>
            <aside>
              <Tile icon="MessageSquare" size="large" />
              <h2>
                Here to make
                <br />
                things simpler.
              </h2>
              <p>Still have a question? Our support team can help.</p>
              <a
                className={s.primary}
                href="https://wa.me/923248008331"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp customer support
                <Icon name="ExternalLink" size={16} />
              </a>
            </aside>
            <div>
              {[...new Set(d.faqs.map((f) => f.category))].map((category) => (
                <section className={s.faqGroup} key={category}>
                  <span className={s.eyebrow}>{category}</span>
                  <Card>
                    {d.faqs
                      .filter((f) => f.category === category)
                      .map((f, i) => (
                        <details key={i}>
                          <summary>
                            {f.question}
                            <Icon name="Plus" size={17} />
                          </summary>
                          <p>{f.answer}</p>
                        </details>
                      ))}
                  </Card>
                </section>
              ))}
            </div>
          </div>
        )}
      </Load>
    </>
  );
}
