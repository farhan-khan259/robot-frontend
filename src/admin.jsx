import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { api, proof, downloadCsv } from "./api";
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
  Pager,
  Modal,
  Transactions,
  Avatar,
  InstitutionMark,
  Orbit,
} from "./core";
import { Detail } from "./member";
const WalletChart = lazy(() => import("./WalletChart"));
function OverviewMetric({ label, value, to, emphasis = false }) {
  const content = (
    <div className={`${s.adminOverviewMetric} ${emphasis ? s.adminOverviewMetricEmphasis : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {to && <Icon name="ChevronRight" size={18} />}
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function RegistrationTrend({ data }) {
  const points = data.length
    ? data
    : Array.from({ length: 7 }, (_, index) => ({ date: String(index), count: 0 }));
  const max = Math.max(...points.map((point) => point.count), 1);
  return (
    <div className={s.registrationTrend} aria-label="User registrations for the last seven days">
      {points.map((point) => (
        <div key={point.date}>
          <i style={{ height: `${Math.max(8, (point.count / max) * 100)}%` }} />
          <small>{point.date.slice(5)}</small>
        </div>
      ))}
    </div>
  );
}
export function AdminOverview() {
  const state = useData("/admin/overview", 15000);
  return (
    <>
      <Heading
        eyebrow="SUPER ADMIN"
        title="Platform overview"
        description="Monitor accounts, requests, rewards and platform activity."
        action={
          <button className={s.secondary} onClick={state.reload}>
            <Icon name="RefreshCw" size={16} />
            Refresh overview
          </button>
        }
      />
      <Load state={state}>
        {(d) => (
          <>
            <section className={s.adminOverviewSection}>
              <SectionTitle title="Today’s activity" description="TODAY · PAKISTAN TIME" />
              <div className={s.adminTodayGrid}>
                <OverviewMetric label="Today deposit" value={currency(d.today.deposits)} to="/admin/deposits" />
                <OverviewMetric label="Today withdrawal" value={currency(d.today.withdrawals)} to="/admin/withdrawals" />
                <OverviewMetric label="Today investment" value={currency(d.today.investment)} />
                <OverviewMetric label="Today user joined" value={d.today.users} to="/admin/users" />
              </div>
            </section>
            <section className={s.adminOverviewSection}>
              <SectionTitle title="Platform finances" description="ALL-TIME TOTALS" />
              <div className={s.adminFinanceGrid}>
                <OverviewMetric label="Total deposit" value={currency(d.totals.deposits)} />
                <OverviewMetric label="Total withdrawal" value={currency(d.totals.withdrawals)} />
                <OverviewMetric label="Total earnings paid" value={currency(d.totals.earnings)} />
                <OverviewMetric label="Total commissions" value={currency(d.totals.commissions)} />
                <OverviewMetric label="Platform balance" value={currency(d.balances.deposits + d.balances.withdrawable)} emphasis />
              </div>
            </section>
            <section className={s.adminOverviewSection}>
              <SectionTitle title="Operations at a glance" description="LIVE PLATFORM TOTALS" />
              <div className={s.adminOperationsGrid}>
                <OverviewMetric label="Registered users" value={d.users} to="/admin/users" />
                <OverviewMetric label="Active paid plans" value={d.activePlans} />
                <OverviewMetric label="Pending deposits" value={d.pendingDeposits} to="/admin/deposits" />
                <OverviewMetric label="Pending withdrawals" value={d.pendingWithdrawals} to="/admin/withdrawals" />
              </div>
            </section>
            <div className={s.adminDashboardGrid}>
              <Card>
                <SectionTitle
                  title="Approved cash activity"
                  description="LAST 30 DAYS · DEPOSITS AND WITHDRAWALS"
                  action={<Badge status="PKR" />}
                />
                {d.chart.length ? (
                  <div className={s.chart}>
                    <Suspense
                      fallback={<div className={s.loader}>Opening chart…</div>}
                    >
                      <WalletChart data={d.chart} />
                    </Suspense>
                  </div>
                ) : (
                  <Empty
                    icon="BarChart3"
                    title="Every movement adds perspective."
                    text="The chart will fill with real transaction data as members use the platform."
                  />
                )}
              </Card>
              <Card>
                <SectionTitle
                  title="User registrations"
                  description="LAST 7 DAYS"
                />
                <RegistrationTrend data={d.registrations} />
              </Card>
            </div>
          </>
        )}
      </Load>
    </>
  );
}
export function AdminUsers() {
  const [page, setPage] = useState(1),
    [q, setQ] = useState(""),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState(null),
    [balanceAction, setBalanceAction] = useState(null),
    [deleteUser, setDeleteUser] = useState(null),
    [busy, setBusy] = useState("");
  const state = useData(
      `/admin/users?page=${page}&q=${encodeURIComponent(query)}`,
      20000,
    ),
    detail = useData(selected ? `/admin/users/${selected._id}/detail` : null),
    { notify, impersonate } = useApp();
  async function loginAsMember(member) {
    setBusy(member._id);
    try {
      await impersonate(member._id);
      notify(`Opened ${member.name}'s member account.`);
    } catch (e) {
      notify(e.message, true);
    } finally {
      setBusy("");
    }
  }
  async function adjustBalance(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(balanceAction.user._id);
    try {
      await api(`/admin/users/${balanceAction.user._id}/balance`, {
        method: "POST",
        body: { wallet: form.get("wallet"), direction: balanceAction.direction, amount: Number(form.get("amount")) },
      });
      setBalanceAction(null);
      state.reload();
      notify("Member balance updated.");
    } catch (e) { notify(e.message, true); } finally { setBusy(""); }
  }
  async function removeUser() {
    setBusy(deleteUser._id);
    try {
      await api(`/admin/users/${deleteUser._id}`, { method: "DELETE" });
      setDeleteUser(null);
      setSelected(null);
      state.reload();
      notify("Member and related records deleted.");
    } catch (e) { notify(e.message, true); } finally { setBusy(""); }
  }
  return (
    <>
      <Heading
        eyebrow="MEMBER MANAGEMENT"
        title="Your members, clearly managed."
        description="Search accounts, manage access, and maintain member wallet balances."
      />
      <Card>
        <div className={s.tableToolbar}>
          <div>
            <h2>Member directory</h2>
            <p>{state.data?.total ?? "—"} registered accounts</p>
          </div>
          <form
            className={s.searchForm}
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(q);
            }}
          >
            <Icon name="Search" size={17} />
            <input
              aria-label="Search members by name or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or email"
              maxLength={160}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <Load state={state}>
          {(d) => (
            <>
              {d.items.length ? (
                <div className={s.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Status</th>
                        <th>Registered</th>
                        <th>Balance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((u) => (
                        <tr key={u._id}>
                          <td data-label="Member">
                            <div className={s.tablePerson}>
                              <Avatar name={u.name} />
                              <span>
                                <strong>{u.name}</strong>
                                <small>{u.email}</small>
                                <small>{u.role}</small>
                              </span>
                            </div>
                          </td>
                          <td data-label="Status">
                            <Badge status={u.blocked ? "blocked" : "active"} />
                          </td>
                          <td data-label="Registered">{date(u.createdAt)}</td>
                          <td data-label="Balance">{currency(u.depositBalance + u.withdrawableBalance)}</td>
                          <td data-label="Actions">
                            <div className={s.tableActions}>
                              <button
                                onClick={() => loginAsMember(u)}
                                className={s.smallButton}
                                disabled={busy === u._id}
                              >
                                {busy === u._id ? "Opening…" : "Login"}
                              </button>
                              <button onClick={() => setBalanceAction({ user: u, direction: "add" })} className={s.smallButton}>Add balance</button>
                              <button onClick={() => setBalanceAction({ user: u, direction: "remove" })} className={s.smallButton}>Remove balance</button>
                              <button onClick={() => setDeleteUser(u)} className={s.dangerButton}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  icon="Search"
                  title="No matching members."
                  text="Try a different name or email address."
                />
              )}
              <Pager data={d} page={page} setPage={setPage} />
            </>
          )}
        </Load>
      </Card>
      {selected && (
        <Modal
          title="A closer look at this member."
          wide
          close={() => setSelected(null)}
        >
          <Load state={detail}>
            {(d) => (
              <>
                <div className={s.memberDetailHero}>
                  <Avatar name={d.user.name} large />
                  <div>
                    <h2>{d.user.name}</h2>
                    <p>{d.user.email}</p>
                    <small>Joined {date(d.user.createdAt)}</small>
                  </div>
                  <Badge status={d.user.blocked ? "blocked" : "active"} />
                </div>
                <div className={s.statsGridTwo}>
                  <Stat
                    label="Deposit wallet"
                    value={currency(d.user.depositBalance)}
                    icon="Wallet"
                  />
                  <Stat
                    label="Withdrawable wallet"
                    value={currency(d.user.withdrawableBalance)}
                    icon="TrendingUp"
                  />
                </div>
                <div className={s.detailRows}>
                  <Detail label="Referral code" value={d.user.referralCode} />
                  <Detail
                    label="Invited by"
                    value={d.user.referredBy?.name || "Direct registration"}
                  />
                  <Detail
                    label="Phone number"
                    value={d.user.phone || "Not provided"}
                  />
                </div>
                <SectionTitle title="Recent plans" />
                {d.plans.length ? (
                  <div>
                    {d.plans.map((p) => (
                      <div className={s.detailRow} key={p._id}>
                        <span>
                          {p.name} · {p.creditedDays}/45 credits
                        </span>
                        <strong>
                          {currency(p.paid)} · {p.status}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={s.muted}>No plan purchases yet.</p>
                )}
                <SectionTitle title="Latest wallet activity" />
                <Transactions items={d.transactions} />
              </>
            )}
          </Load>
        </Modal>
      )}
      {balanceAction && (
        <Modal title={`${balanceAction.direction === "add" ? "Add" : "Remove"} balance`} close={() => setBalanceAction(null)}>
          <form className={s.formStack} onSubmit={adjustBalance}>
            <p className={s.muted}>{balanceAction.user.name}</p>
            <Field label="Wallet"><select name="wallet" defaultValue="deposit"><option value="deposit">Deposit wallet</option><option value="withdrawable">Withdrawable wallet</option></select></Field>
            <Field label="Amount in PKR"><input name="amount" type="number" min="0.01" step="0.01" required autoFocus /></Field>
            <button className={s.primary} disabled={busy === balanceAction.user._id}>{busy ? "Saving…" : "Confirm adjustment"}</button>
          </form>
        </Modal>
      )}
      {deleteUser && (
        <Modal title="Delete member?" close={() => setDeleteUser(null)}>
          <p className={s.modalText}>This permanently deletes {deleteUser.name} and their related plans, payments, and transactions.</p>
          <div className={s.modalActions}><button className={s.secondary} onClick={() => setDeleteUser(null)}>Cancel</button><button className={s.dangerButton} disabled={busy === deleteUser._id} onClick={removeUser}>Delete member</button></div>
        </Modal>
      )}
    </>
  );
}
export function AdminPlans() {
  const state = useData("/admin/plans"),
    [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    { notify } = useApp();
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await api(`/admin/plans/${selected._id}`, {
        method: "PATCH",
        body: {
          name: form.get("name"),
          description: form.get("description"),
          enabled: form.has("enabled"),
        },
      });
      setSelected(null);
      state.reload();
      notify("Plan presentation and availability updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="THE PLAN COLLECTION"
        title="Every detail, considered."
        description="Manage presentation and availability while keeping every plan’s financial terms intact."
      />
      <Info>
        Prices, daily earnings, totals, duration, and purchased plan terms
        remain unchanged. Pausing a plan affects new purchases only.
      </Info>
      <Load state={state}>
        {(plans) => (
          <div className={s.planGrid}>
            {plans.map((p) => (
              <Card key={p._id} className={s.adminPlanCard}>
                <div className={s.sectionHead}>
                  <Tile icon="Layers" tone={p.enabled ? "green" : "neutral"} />
                  <Badge status={p.enabled ? "available" : "paused"} />
                </div>
                <span className={s.eyebrow}>{p.code}</span>
                <h2>{p.name}</h2>
                <strong className={s.adminPlanPrice}>
                  {currency(p.price)}
                </strong>
                <Detail label="Daily earning" value={currency(p.daily)} />
                <Detail label="Total scheduled" value={currency(p.total)} />
                <Detail label="Cycle" value="45 credits" />
                <button
                  className={s.secondary}
                  onClick={() => {
                    setSelected(p);
                    setError("");
                  }}
                >
                  <Icon name="Settings" size={16} />
                  Manage plan
                </button>
              </Card>
            ))}
          </div>
        )}
      </Load>
      {selected && (
        <Modal
          title={`Manage ${selected.code}`}
          close={() => !busy && setSelected(null)}
        >
          <form onSubmit={save}>
            <Field
              label="Plan display name"
              name="name"
              defaultValue={selected.name}
              maxLength={160}
              required
            />
            <Field label="Plan description">
              <textarea
                name="description"
                defaultValue={selected.description || ""}
                maxLength={500}
                rows={3}
              />
            </Field>
            <label className={s.checkbox}>
              <input
                type="checkbox"
                name="enabled"
                defaultChecked={selected.enabled}
              />
              <span>Available for new purchases</span>
            </label>
            <Info>
              Existing purchases retain their recorded terms and name.
            </Info>
            <ErrorText message={error} />
            <button className={s.primary} disabled={busy}>
              {busy ? "Saving…" : "Save plan settings"}
              <Icon name="Check" size={16} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Reviews({ type }) {
  const [page, setPage] = useState(1),
    [status, setStatus] = useState("pending"),
    [selected, setSelected] = useState(null),
    [action, setAction] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [image, setImage] = useState("");
  const state = useData(
      `/admin/${type}?page=${page}${status ? `&status=${status}` : ""}`,
      20000,
    ),
    banks = useData("/institutions"),
    { notify } = useApp();
  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image);
    },
    [image],
  );
  const close = useCallback(() => {
    if (!busy) setSelected(null);
  }, [busy]);
  async function review(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(`/admin/${type}/${selected._id}/review`, {
        method: "POST",
        body: { action, note: new FormData(e.currentTarget).get("note") },
      });
      setSelected(null);
      state.reload();
      notify("The review is recorded and the member’s account is updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function viewReceipt(id) {
    try {
      setImage(await proof(id));
    } catch (e) {
      notify(e.message, true);
    }
  }
  return (
    <>
      <Heading
        eyebrow={
          type === "deposits"
            ? "MANUAL DEPOSIT REVIEWS"
            : "MANUAL WITHDRAWAL PROCESSING"
        }
        title={
          type === "deposits"
            ? "Every transfer deserves a closer look."
            : "Help earnings find their way home."
        }
        description={
          type === "deposits"
            ? "Match the Easypaisa transfer, receipt, and transaction ID before approving funds."
            : "Review the account details and pay externally before marking a request paid."
        }
      />
      <Tabs
        label="Request status"
        value={status}
        onChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
        items={[
          "pending",
          type === "deposits" ? "approved" : "paid",
          "rejected",
          "",
        ].map((value) => ({ value, label: value || "All requests" }))}
      />
      <Load state={state}>
        {(d) => (
          <>
            {d.items.length ? (
              <div className={s.reviewTableWrap}>
                <table className={s.adminListTable}>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Submitted</th>
                      <th>{type === "deposits" ? "Transaction ID" : "Destination"}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.items.map((x) => (
                      <tr key={x._id}>
                        <td>
                          <div className={s.tablePerson}>
                            <Avatar name={x.user?.name} />
                            <span>
                              <strong>{x.user?.name || "Member"}</strong>
                              <small>{x.user?.email}</small>
                            </span>
                          </div>
                        </td>
                        <td><Badge status={x.status} /></td>
                        <td><strong>{currency(x.amount)}</strong></td>
                        <td>{date(x.createdAt)}</td>
                        <td>
                          {type === "deposits" ? (
                            <span className={s.monoValue}>{x.tid}</span>
                          ) : (
                            <span className={s.destinationValue}>
                              {x.customInstitution ||
                                banks.data?.find((b) => b.id === x.institution)?.name ||
                                x.institution}
                              <small>{x.accountName} · {x.accountNumber}</small>
                            </span>
                          )}
                        </td>
                        <td>
                          <div className={s.tableActions}>
                            {type === "deposits" && (
                              <button className={s.smallButton} onClick={() => viewReceipt(x._id)}>
                                Receipt
                              </button>
                            )}
                            {x.status === "pending" && (
                              <>
                                <button
                                  className={s.smallButton}
                                  onClick={() => {
                                    setSelected(x);
                                    setAction(type === "deposits" ? "approved" : "paid");
                                    setError("");
                                  }}
                                >
                                  {type === "deposits" ? "Approve" : "Mark paid"}
                                </button>
                                <button
                                  className={s.dangerButton}
                                  onClick={() => {
                                    setSelected(x);
                                    setAction("rejected");
                                    setError("");
                                  }}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card>
                <Empty
                  icon="CheckCircle2"
                  title="A clear desk, for now."
                  text="There are no requests matching this review status."
                />
              </Card>
            )}
            <Pager data={d} page={page} setPage={setPage} />
          </>
        )}
      </Load>
      {selected && (
        <Modal
          title={
            action === "rejected"
              ? "Record your decision."
              : action === "paid"
                ? "Confirm the external payment."
                : "Approve this verified transfer."
          }
          close={close}
        >
          <div className={s.confirmAmount}>
            {currency(selected.amount)}
            <small>{selected.user?.name}</small>
          </div>
          <p className={s.modalDescription}>
            {action === "approved"
              ? "The member’s deposit wallet will be credited and the three-level deposit commissions will be distributed together."
              : action === "paid"
                ? "Confirm that you have already sent this amount to the nominated bank or wallet. This action records your payment; it does not transfer money."
                : type === "withdrawals"
                  ? "The reserved withdrawal amount will return to the member’s withdrawable wallet exactly once."
                  : "This deposit will be rejected without adding funds to the member’s wallet."}
          </p>
          <form onSubmit={review}>
            <Field
              label={
                action === "rejected" ? "Reason for rejection" : "Review note"
              }
            >
              <textarea
                name="note"
                rows={3}
                maxLength={500}
                required={action === "rejected"}
              />
            </Field>
            {action === "paid" && (
              <label className={s.checkbox}>
                <input type="checkbox" required />
                <span>I have verified the external payment is complete.</span>
              </label>
            )}
            <ErrorText message={error} />
            <button className={s.primary} disabled={busy}>
              {busy ? "Recording review…" : "Confirm decision"}
              <Icon name="Check" size={16} />
            </button>
          </form>
        </Modal>
      )}
      {image && (
        <Modal title="Submitted payment receipt" close={() => setImage("")}>
          <img
            className={s.proofImage}
            src={image}
            alt="Member-submitted Easypaisa transfer receipt"
          />
        </Modal>
      )}
    </>
  );
}
export function AdminLedger({ commissions = false }) {
  const [page, setPage] = useState(1),
    [kind, setKind] = useState(commissions ? "commission" : ""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [busy, setBusy] = useState(false);
  const params = new URLSearchParams({
      page,
      ...(kind ? { kind } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    }),
    state = useData(`/admin/transactions?${params}`, 20000),
    totals = useData(commissions ? "/admin/commissions" : null, 20000),
    { notify } = useApp();
  async function exportRows() {
    setBusy(true);
    try {
      await downloadCsv(
        `/admin/transactions/export?${params}`,
        "robotnetwork-ledger.csv",
      );
      notify("The filtered ledger has been downloaded.");
    } catch (e) {
      notify(e.message, true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow={commissions ? "THE REFERRAL LEDGER" : "THE PLATFORM LEDGER"}
        title={
          commissions
            ? "Every connection, accounted for."
            : "A record you can follow."
        }
        description={
          commissions
            ? "Three levels. Approved deposits only. Every commission preserved."
            : "Browse the real financial ledger across every member and wallet."
        }
        action={
          <button className={s.secondary} disabled={busy} onClick={exportRows}>
            <Icon name="Download" size={16} />
            {busy ? "Preparing export…" : "Export CSV"}
          </button>
        }
      />
      {commissions && (
        <Load state={totals}>
          {(d) => (
            <div className={s.statsGridThree}>
              {d.levels.map((l) => (
                <Stat
                  key={l.level}
                  label={`Level ${l.level} · ${l.rate}%`}
                  value={currency(l.total)}
                  note={`${l.count} commission records`}
                  icon="Network"
                  tone={l.level === 3 ? "sand" : "green"}
                />
              ))}
            </div>
          )}
        </Load>
      )}
      {!commissions && (
        <Tabs
          value={kind}
          onChange={(v) => {
            setPage(1);
            setKind(v);
          }}
          label="Ledger type"
          items={[
            ["", "All entries"],
            ["deposit", "Deposits"],
            ["withdrawal", "Withdrawals"],
            ["purchase", "Purchases"],
            ["earning", "Earnings"],
            ["commission", "Commissions"],
            ["refund", "Refunds"],
          ].map(([value, label]) => ({ value, label }))}
        />
      )}
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
            Reset
          </button>
        )}
      </div>
      <Card>
        <SectionTitle
          title={commissions ? "Commission movements" : "Ledger movements"}
          description="Amounts are recorded in the wallet where each movement occurred."
        />
        <Load state={state}>
          {(d) => (
            <>
              <Transactions items={d.items} admin />
              <Pager data={d} page={page} setPage={setPage} />
            </>
          )}
        </Load>
      </Card>
    </>
  );
}
export function AdminReports() {
  const state = useData("/admin/reports", 30000);
  return (
    <>
      <Heading
        eyebrow="PLATFORM PERSPECTIVE"
        title="The bigger picture, clearly seen."
        description="Real totals, earning cycles, and a view of your platform’s financial records."
      />
      <Load state={state}>
        {(d) => (
          <>
            <div className={s.statsGridThree}>
              <Stat
                label="Plan earnings credited"
                value={currency(d.earnings.paid)}
                icon="TrendingUp"
                note={`${d.earnings.credits} automatic credits`}
              />
              <Stat
                label="Purchased plan value"
                value={currency(
                  d.purchases.reduce((s, x) => s + x.purchased, 0),
                )}
                icon="Layers"
                note={`${d.purchases.reduce((s, x) => s + x.count, 0)} plan purchases`}
              />
              <Stat
                label="Pending withdrawals"
                value={currency(
                  d.requests.find((x) => x._id === "pending")?.amount || 0,
                )}
                icon="Clock"
                tone="sand"
                note={`${d.requests.find((x) => x._id === "pending")?.count || 0} requests awaiting review`}
              />
            </div>
            <div className={s.twoColumns}>
              <Card>
                <SectionTitle
                  title="The wallet ledger"
                  description="Totals by movement type and wallet."
                />
                {d.flow.length ? (
                  d.flow.map((x, i) => (
                    <div className={s.reportRow} key={i}>
                      <Tile
                        icon={
                          x._id.direction === "in"
                            ? "ArrowDownLeft"
                            : "ArrowUpRight"
                        }
                      />
                      <div>
                        <strong>{x._id.kind}</strong>
                        <small>
                          {x._id.wallet} wallet · {x.count} records
                        </small>
                      </div>
                      <b>{currency(x.amount)}</b>
                    </div>
                  ))
                ) : (
                  <Empty
                    icon="BarChart3"
                    title="The story is yet to begin."
                    text="Financial activity will appear here."
                  />
                )}
              </Card>
              <div>
                <Card>
                  <SectionTitle title="Plan cycles" />
                  {d.purchases.length ? (
                    d.purchases.map((x) => (
                      <div className={s.reportRow} key={x._id}>
                        <Tile icon="Layers" />
                        <div>
                          <strong>{x._id}</strong>
                          <small>
                            {x.count} plans · {currency(x.paid)} credited
                          </small>
                        </div>
                        <b>{currency(x.purchased)}</b>
                      </div>
                    ))
                  ) : (
                    <Empty
                      icon="Layers"
                      title="No plan purchases yet."
                      text="Purchased plans will be summarized here."
                    />
                  )}
                </Card>
                <Card className={s.spaced}>
                  <SectionTitle title="Withdrawal outcomes" />
                  {d.requests.length ? (
                    d.requests.map((x) => (
                      <div className={s.reportRow} key={x._id}>
                        <Badge status={x._id} />
                        <div>
                          <small>{x.count} requests</small>
                        </div>
                        <b>{currency(x.amount)}</b>
                      </div>
                    ))
                  ) : (
                    <Empty
                      icon="History"
                      title="No withdrawal requests yet."
                      text="The outcomes of manual payment reviews will appear here."
                    />
                  )}
                </Card>
              </div>
            </div>
            <Info>
              Withdrawal ledger debits represent reserved funds. Rejection
              refunds are separate credits. These reports describe platform
              records and do not confirm external bank settlements.
            </Info>
          </>
        )}
      </Load>
    </>
  );
}
export function AdminContent() {
  const state = useData("/admin/content"),
    [draft, setDraft] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    { notify } = useApp();
  useEffect(() => {
    if (state.data) setDraft(structuredClone(state.data));
  }, [state.data]);
  function update(key, value) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const {
      heroTitle,
      heroSubtitle,
      announcementEnabled,
      announcementTitle,
      announcementBody,
      announcementLink,
      faqs,
    } = draft;
    try {
      const result = await api("/admin/content", {
        method: "PATCH",
        body: {
          heroTitle,
          heroSubtitle,
          announcementEnabled,
          announcementTitle,
          announcementBody,
          announcementLink,
          faqs,
        },
      });
      setDraft(result);
      notify(
        "Website content saved. Member pages now use the updated content.",
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
        eyebrow="THE EDITORIAL WORKSPACE"
        title="Make every word feel considered."
        description="Update the public introduction, dashboard announcement, and help center."
      />
      <Load state={state}>
        {() =>
          draft && (
            <form onSubmit={save}>
              <div className={s.twoColumns}>
                <Card>
                  <SectionTitle
                    title="Public welcome page"
                    description="Saved website copy."
                  />
                  <Field label="Hero heading">
                    <input
                      value={draft.heroTitle}
                      onChange={(e) => update("heroTitle", e.target.value)}
                      maxLength={160}
                      required
                    />
                  </Field>
                  <Field label="Hero introduction">
                    <textarea
                      rows={4}
                      value={draft.heroSubtitle}
                      onChange={(e) => update("heroSubtitle", e.target.value)}
                      maxLength={2000}
                      required
                    />
                  </Field>
                </Card>
                <Card>
                  <SectionTitle
                    title="Member announcement banner"
                    description="A dismissible message on the member overview."
                  />
                  <label className={s.checkbox}>
                    <input
                      type="checkbox"
                      checked={draft.announcementEnabled}
                      onChange={(e) =>
                        update("announcementEnabled", e.target.checked)
                      }
                    />
                    <span>Show announcement to members</span>
                  </label>
                  <Field label="Announcement heading">
                    <input
                      value={draft.announcementTitle}
                      onChange={(e) =>
                        update("announcementTitle", e.target.value)
                      }
                      maxLength={160}
                      required={draft.announcementEnabled}
                    />
                  </Field>
                  <Field label="Announcement message">
                    <textarea
                      rows={3}
                      value={draft.announcementBody}
                      onChange={(e) =>
                        update("announcementBody", e.target.value)
                      }
                      maxLength={2000}
                      required={draft.announcementEnabled}
                    />
                  </Field>
                  <Field
                    label="Internal link (optional)"
                    hint="Use a page path such as /plans."
                  >
                    <input
                      value={draft.announcementLink}
                      onChange={(e) =>
                        update("announcementLink", e.target.value)
                      }
                      maxLength={200}
                    />
                  </Field>
                </Card>
              </div>
              <Card>
                <SectionTitle
                  title="Frequently asked questions"
                  description="These answers appear in the member help center."
                  action={
                    <button
                      type="button"
                      className={s.secondary}
                      disabled={draft.faqs.length >= 30}
                      onClick={() =>
                        update("faqs", [
                          ...draft.faqs,
                          { category: "General", question: "", answer: "" },
                        ])
                      }
                    >
                      <Icon name="Plus" size={16} />
                      Add question
                    </button>
                  }
                />
                <div className={s.faqEditor}>
                  {draft.faqs.map((f, i) => (
                    <div key={i} className={s.faqEditorItem}>
                      <div className={s.sectionHead}>
                        <span className={s.eyebrow}>
                          QUESTION {String(i + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          className={s.inlineButton}
                          disabled={draft.faqs.length <= 1}
                          onClick={() =>
                            update(
                              "faqs",
                              draft.faqs.filter((_, j) => j !== i),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                      {["category", "question", "answer"].map((field) => (
                        <Field
                          key={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                        >
                          {field === "answer" ? (
                            <textarea
                              value={f[field]}
                              onChange={(e) =>
                                update(
                                  "faqs",
                                  draft.faqs.map((v, j) =>
                                    j === i
                                      ? { ...v, [field]: e.target.value }
                                      : v,
                                  ),
                                )
                              }
                              rows={3}
                              maxLength={2000}
                              required
                            />
                          ) : (
                            <input
                              value={f[field]}
                              onChange={(e) =>
                                update(
                                  "faqs",
                                  draft.faqs.map((v, j) =>
                                    j === i
                                      ? { ...v, [field]: e.target.value }
                                      : v,
                                  ),
                                )
                              }
                              maxLength={160}
                              required
                            />
                          )}
                        </Field>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
              <ErrorText message={error} />
              <div className={s.saveBar}>
                <span>
                  <Icon name="Globe" size={17} />
                  Changes become visible when saved.
                </span>
                <button className={s.primary} disabled={busy}>
                  {busy ? "Saving content…" : "Save website content"}
                  <Icon name="Check" size={16} />
                </button>
              </div>
            </form>
          )
        }
      </Load>
    </>
  );
}
export function AdminTickets() {
  const [page, setPage] = useState(1),
    [status, setStatus] = useState("open"),
    state = useData(
      `/admin/tickets?page=${page}${status ? `&status=${status}` : ""}`,
      15000,
    );
  return (
    <>
      <Heading
        eyebrow="THE SUPPORT INBOX"
        title="A little care goes a long way."
        description="Review member questions, reply, and keep each conversation on record."
      />
      <Tabs
        value={status}
        onChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
        items={[
          ["open", "Open requests"],
          ["closed", "Closed requests"],
          ["", "All requests"],
        ].map(([value, label]) => ({ value, label }))}
      />
      <Card>
        <Load state={state}>
          {(d) => (
            <>
              {d.items.length ? (
                d.items.map((t) => (
                  <Link
                    className={s.ticketRow}
                    key={t._id}
                    to={`/admin/tickets/${t._id}`}
                  >
                    <Tile icon="MessageSquare" />
                    <div>
                      <strong>{t.subject}</strong>
                      <small>
                        {t.user?.name} · {t.category} · {date(t.updatedAt)}
                      </small>
                    </div>
                    <Badge status={t.status} />
                    <Icon name="ChevronRight" size={15} />
                  </Link>
                ))
              ) : (
                <Empty
                  icon="MessageSquare"
                  title="A quiet inbox, for now."
                  text="Member support requests will appear here."
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
export function PaymentSettings() {
  const state = useData("/admin/settings"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    { notify } = useApp();
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/admin/settings", {
        method: "PATCH",
        body: Object.fromEntries(new FormData(e.currentTarget)),
      });
      notify("Payment and support settings saved.");
      state.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="THE OPERATIONAL DETAILS"
        title="Keep the essentials in good order."
        description="The receiving account and support contacts your members see."
      />
      <Load state={state}>
        {(d) => (
          <form onSubmit={save}>
            <div className={s.twoColumns}>
              <Card>
                <SectionTitle
                  title="Easypaisa receiving account"
                  description="Shown to members when they make a manual deposit."
                />
                <div className={s.paymentMethod}>
                  <InstitutionMark
                    institution="easypaisa"
                    monogram="EP"
                    label="Easypaisa"
                  />
                  <div>
                    <strong>Easypaisa</strong>
                    <small>Manual verification only</small>
                  </div>
                  <Icon name="ShieldCheck" size={21} />
                </div>
                <Field
                  label="Account holder name"
                  name="accountName"
                  defaultValue={d.accountName}
                  maxLength={160}
                  required
                />
                <Field
                  label="Receiving account number"
                  name="accountNumber"
                  defaultValue={d.accountNumber}
                  pattern="03[0-9]{9}"
                  maxLength={11}
                  required
                  hint="An 11-digit Pakistani mobile account number."
                />
              </Card>
              <Card>
                <SectionTitle
                  title="Support contacts"
                  description="A direct way for members to get help."
                />
                <Field
                  label="Support email (optional)"
                  name="supportEmail"
                  type="email"
                  defaultValue={d.supportEmail}
                  maxLength={160}
                />
                <Field
                  label="Support phone"
                  name="supportPhone"
                  defaultValue={d.supportPhone}
                  pattern={"[+0-9 \\(\\)\\-]{7,24}"}
                  maxLength={24}
                  required
                />
                <Info>
                  Updating these details changes the member-facing deposit and
                  support pages. It does not alter any existing payment records.
                </Info>
              </Card>
            </div>
            <ErrorText message={error} />
            <button className={s.primary} disabled={busy}>
              {busy ? "Saving settings…" : "Save payment settings"}
              <Icon name="Check" size={16} />
            </button>
          </form>
        )}
      </Load>
    </>
  );
}
