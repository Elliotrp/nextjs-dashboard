import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Database } from "sqlite";

export async function openDb(): Promise<Database> {
	return open({
		filename: process.env.SQLITE_DATABASE ?? ":memory:",
		driver: sqlite3.Database,
	});
}
