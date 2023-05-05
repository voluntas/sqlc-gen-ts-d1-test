CREATE TABLE org (
  pk INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL
);

CREATE TABLE account (
  pk INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT
);

CREATE TABLE org_account (
  org_pk INTEGER NOT NULL,
  account_pk INTEGER NOT NULL,
  PRIMARY KEY (org_pk, account_pk),
  FOREIGN KEY (org_pk) REFERENCES org (pk) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (account_pk) REFERENCES account (pk) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE account_log (
  pk INTEGER PRIMARY KEY AUTOINCREMENT,
  tag TEXT NOT NULL,
  time TEXT DEFAULT CURRENT_TIMESTAMP,
  -- JSON 型は非対応
  -- data JSON NOT NULL
  data TEXT NOT NULL
)