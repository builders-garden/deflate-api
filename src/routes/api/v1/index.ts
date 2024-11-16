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
    path: "/kyc/:id",
    method: "get",
    handler: fetchKYC,
    middleware: [validateParams(["id"]), authMiddleware],
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
    path: "/bank-accounts/:id",
    method: "delete",
    handler: deleteBankAccount,
    middleware: [validateParams(["id"]), authMiddleware],
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
];

// Register routes
routes.forEach((route) => {
  const { method, path, handler, middleware } = route;
  (router[method as keyof Router] as Function)(path, ...middleware, handler);
});

export default router;
