import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { healthCheck } from "../../../handlers/health";
import { validateParams } from "../../../middlewares/validation";
import { createKYC } from "../../../handlers/kyc/create-kyc";
import { fetchKYC } from "../../../handlers/kyc/fetch-kyc";
import { createBankAccount } from "../../../handlers/bank-accounts/create-bank-account";
import { deleteBankAccount } from "../../../handlers/bank-accounts/delete-bank-account";
import { fetchBankAccount } from "../../../handlers/bank-accounts/fetch-bank-account";
import { fetchLiquidationAddress } from "../../../handlers/liquidation-address/route";
import { fetchWithdrawals } from "../../../handlers/withdrawals/fetch-withdrawals";
import { updateUser } from "../../../handlers/users/me/update-user";
import { createDeposit } from "../../../handlers/deposits/create-deposit";
import { fetchReferrals } from "../../../handlers/referrals/fetch-referrals";
import { fetchValueChart } from "../../../handlers/portfolio/fetch-value-chart";
import { fetchProfitAndLoss } from "../../../handlers/portfolio/fetch-profit-and-loss";
import { fetchCurrentValue } from "../../../handlers/portfolio/fetch-current-value";
//import { createWithdrawal } from "../../../handlers/withdrawals/create-withdrawal";

const router = Router();

// Define routes with their specific handlers and middleware
const routes = [
  {
    path: "/health",
    method: "get",
    handler: healthCheck,
    middleware: [],
  },
  {
    path: "/kyc",
    method: "post",
    handler: createKYC,
    middleware: [authMiddleware],
  },
  {
    path: "/kyc",
    method: "get",
    handler: fetchKYC,
    middleware: [authMiddleware],
  },
  {
    path: "/bank-accounts",
    method: "get",
    handler: fetchBankAccount,
    middleware: [authMiddleware],
  },
  {
    path: "/bank-accounts",
    method: "post",
    handler: createBankAccount,
    middleware: [authMiddleware],
  },
  {
    path: "/bank-accounts",
    method: "delete",
    handler: deleteBankAccount,
    middleware: [authMiddleware],
  },
  {
    path: "/liquidation-address",
    method: "get",
    handler: fetchLiquidationAddress,
    middleware: [authMiddleware],
  },
  {
    path: "/withdrawals",
    method: "get",
    handler: fetchWithdrawals,
    middleware: [authMiddleware],
  },
  {
    path: "/users/me",
    method: "put",
    handler: updateUser,
    middleware: [authMiddleware],
  },
  {
    path: "/deposits",
    method: "post",
    handler: createDeposit,
    middleware: [authMiddleware],
  },
  {
    path: "/referrals",
    method: "get",
    handler: fetchReferrals,
    middleware: [authMiddleware],
  },
  {
    path: "/portfolio/value-chart",
    method: "get",
    handler: fetchValueChart,
    middleware: [authMiddleware],
  },
  {
    path: "/portfolio/profit-and-loss",
    method: "get",
    handler: fetchProfitAndLoss,
    middleware: [authMiddleware],
  },
  {
    path: "/portfolio/current-value",
    method: "get",
    handler: fetchCurrentValue,
    middleware: [authMiddleware],
  }
  /*
  {
    path: "/withdraws",
    method: "post",
    handler: createWithdraw,
    middleware: [authMiddleware],
  },
  
];

// Register routes
routes.forEach((route) => {
  const { method, path, handler, middleware } = route;
  (router[method as keyof Router] as Function)(path, ...middleware, handler);
});

export default router;
