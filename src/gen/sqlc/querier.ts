import { D1Database, D1Result } from "@cloudflare/workers-types/2022-11-30"
import { Account, Org } from "./models"

const getAccountQuery = `-- name: GetAccount :one
SELECT pk, id, display_name, email
FROM account
WHERE id = ?1`;

export type GetAccountParams = {
  id: string;
};

export type GetAccountRow = {
  pk: number;
  id: string;
  displayName: string;
  email: string | null;
};

type RawGetAccountRow = {
  pk: number;
  id: string;
  display_name: string;
  email: string | null;
};

export async function getAccount(
  d1: D1Database,
  args: GetAccountParams
): Promise<GetAccountRow | null> {
  return await d1
    .prepare(getAccountQuery)
    .bind(args.id)
    .first<RawGetAccountRow | null>()
    .then((raw: RawGetAccountRow | null) => raw ? {
      pk: raw.pk,
      id: raw.id,
      displayName: raw.display_name,
      email: raw.email,
    } : null);
}

const listAccountsQuery = `-- name: ListAccounts :many
SELECT pk, id, display_name, email
FROM account`;

export type ListAccountsRow = {
  pk: number;
  id: string;
  displayName: string;
  email: string | null;
};

type RawListAccountsRow = {
  pk: number;
  id: string;
  display_name: string;
  email: string | null;
};

export async function listAccounts(
  d1: D1Database
): Promise<D1Result<ListAccountsRow>> {
  return await d1
    .prepare(listAccountsQuery)
    .all<RawListAccountsRow>()
    .then((r: D1Result<RawListAccountsRow>) => { return {
      ...r,
      results: r.results ? r.results.map((raw: RawListAccountsRow) => { return {
        pk: raw.pk,
        id: raw.id,
        displayName: raw.display_name,
        email: raw.email,
      }}) : undefined,
    }});
}

const createAccountQuery = `-- name: CreateAccount :exec
INSERT INTO account (id, display_name, email)
VALUES (?1, ?2, ?3)`;

export type CreateAccountParams = {
  id: string;
  displayName: string;
  email: string | null;
};

export async function createAccount(
  d1: D1Database,
  args: CreateAccountParams
): Promise<D1Result> {
  return await d1
    .prepare(createAccountQuery)
    .bind(args.id, args.displayName, args.email)
    .run();
}

const updateAccountDisplayNameQuery = `-- name: UpdateAccountDisplayName :one
UPDATE account
SET display_name = ?1
WHERE id = ?2
RETURNING pk, id, display_name, email`;

export type UpdateAccountDisplayNameParams = {
  displayName: string;
  id: string;
};

export type UpdateAccountDisplayNameRow = {
  pk: number;
  id: string;
  displayName: string;
  email: string | null;
};

type RawUpdateAccountDisplayNameRow = {
  pk: number;
  id: string;
  display_name: string;
  email: string | null;
};

export async function updateAccountDisplayName(
  d1: D1Database,
  args: UpdateAccountDisplayNameParams
): Promise<UpdateAccountDisplayNameRow | null> {
  return await d1
    .prepare(updateAccountDisplayNameQuery)
    .bind(args.displayName, args.id)
    .first<RawUpdateAccountDisplayNameRow | null>()
    .then((raw: RawUpdateAccountDisplayNameRow | null) => raw ? {
      pk: raw.pk,
      id: raw.id,
      displayName: raw.display_name,
      email: raw.email,
    } : null);
}

const deleteAccountQuery = `-- name: DeleteAccount :exec
DELETE FROM account
WHERE id = ?1`;

export type DeleteAccountParams = {
  id: string;
};

export async function deleteAccount(
  d1: D1Database,
  args: DeleteAccountParams
): Promise<D1Result> {
  return await d1
    .prepare(deleteAccountQuery)
    .bind(args.id)
    .run();
}

const createOrgQuery = `-- name: CreateOrg :exec
INSERT INTO org (id, display_name)
VALUES (?1, ?2)`;

export type CreateOrgParams = {
  id: string;
  displayName: string;
};

export async function createOrg(
  d1: D1Database,
  args: CreateOrgParams
): Promise<D1Result> {
  return await d1
    .prepare(createOrgQuery)
    .bind(args.id, args.displayName)
    .run();
}

const createOrgAccountQuery = `-- name: CreateOrgAccount :exec
INSERT INTO org_account (org_pk, account_pk)
VALUES (?1, ?2)`;

export type CreateOrgAccountParams = {
  orgPk: number;
  accountPk: number;
};

export async function createOrgAccount(
  d1: D1Database,
  args: CreateOrgAccountParams
): Promise<D1Result> {
  return await d1
    .prepare(createOrgAccountQuery)
    .bind(args.orgPk, args.accountPk)
    .run();
}

const getOrgAccountQuery = `-- name: GetOrgAccount :one
SELECT account.pk AS account_pk, account.id AS account_id, account.display_name AS account_display_name, account.email AS account_email,
  org.pk AS org_pk, org.id AS org_id, org.display_name AS org_display_name
FROM account
  JOIN org_account ON account.pk = org_account.account_pk
  JOIN org ON org_account.org_pk = org.pk
WHERE org.id = ?1
  AND account.id = ?2`;

export type GetOrgAccountParams = {
  orgId: string;
  accountId: string;
};

export type GetOrgAccountRow = {
  account: Account;
  org: Org;
};

type RawGetOrgAccountRow = {
  account_pk: number;
  account_id: string;
  account_display_name: string;
  account_email: string | null;
  org_pk: number;
  org_id: string;
  org_display_name: string;
};

export async function getOrgAccount(
  d1: D1Database,
  args: GetOrgAccountParams
): Promise<GetOrgAccountRow | null> {
  return await d1
    .prepare(getOrgAccountQuery)
    .bind(args.orgId, args.accountId)
    .first<RawGetOrgAccountRow | null>()
    .then((raw: RawGetOrgAccountRow | null) => raw ? {
      account: {
        pk: raw.account_pk,
        id: raw.account_id,
        displayName: raw.account_display_name,
        email: raw.account_email,
      },
      org: {
        pk: raw.org_pk,
        id: raw.org_id,
        displayName: raw.org_display_name,
      },
    } : null);
}

