import { Queue } from "../queue";
import { Request, Response } from "express";

export type PendingRequests = {
  [key: string]: Queue<[Request, Response, string]>;
};

export type AppNameFinder = { [key: string]: string };

export const pendingRequests: PendingRequests = {};
export const appNameFinder: AppNameFinder = {};
export const clientAddress: { [key: string]: string } = {};
