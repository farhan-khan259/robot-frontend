import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useApp, Shell, SettingsMenu, s, Icon } from "./core";
import { Auth, ForgotPassword, NotFound } from "./public";
import {
  Overview,
  Plans,
  PlanDetail,
  MyPlans,
  Records,
  Team,
  DepositPage,
  WithdrawPage,
  PaymentHistory,
  Account,
  Profile,
  Security,
  Notifications,
  Support,
  TicketThread,
  FAQ,
} from "./member";
import {
  AdminOverview,
  AdminUsers,
  AdminPlans,
  Reviews,
  AdminLedger,
  AdminReports,
  AdminContent,
  AdminTickets,
  PaymentSettings,
} from "./admin";
function Router() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/welcome" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Auth register />} />
      <Route path="/admin/login" element={<Auth admin />} />
      <Route element={user ? <Shell /> : <Navigate to="/login" replace />}>
        <Route index element={<Overview />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/:id" element={<PlanDetail />} />
        <Route path="my-plans" element={<MyPlans />} />
        <Route path="earnings" element={<Records type="earnings" />} />
        <Route path="activity" element={<Records />} />
        <Route path="team" element={<Team />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route
          path="deposits/history"
          element={<PaymentHistory type="deposits" />}
        />
        <Route
          path="withdrawals/history"
          element={<PaymentHistory type="withdrawals" />}
        />
        <Route path="account" element={<Account />} />
        <Route path="account/profile" element={<Profile />} />
        <Route path="account/security" element={<Security />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="support" element={<Support />} />
        <Route path="support/:id" element={<TicketThread />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="settings" element={<SettingsMenu />} />
      </Route>
      <Route
        element={
          user?.role === "admin" ? (
            <Shell admin />
          ) : (
            <Navigate to={user ? "/" : "/admin/login"} replace />
          )
        }
      >
        <Route path="admin" element={<AdminOverview />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/plans" element={<AdminPlans />} />
        <Route path="admin/deposits" element={<Reviews type="deposits" />} />
        <Route
          path="admin/withdrawals"
          element={<Reviews type="withdrawals" />}
        />
        <Route path="admin/transactions" element={<AdminLedger />} />
        <Route
          path="admin/commissions"
          element={<AdminLedger key="commissions" commissions />}
        />
        <Route path="admin/reports" element={<AdminReports />} />
        <Route path="admin/content" element={<AdminContent />} />
        <Route path="admin/tickets" element={<AdminTickets />} />
        <Route path="admin/tickets/:id" element={<TicketThread admin />} />
        <Route path="admin/settings" element={<PaymentSettings />} />
        <Route path="admin/menu" element={<SettingsMenu admin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <div className={s.splash}>
          <Icon name="AlertCircle" size={34} />
          <h1>Let’s try that again.</h1>
          <p>
            The page couldn’t finish opening. Reload your workspace to continue.
          </p>
          <button
            className={s.primary}
            onClick={() => window.location.reload()}
          >
            Reload workspace
          </button>
        </div>
      );
    return this.props.children;
  }
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Provider>
          <Router />
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
