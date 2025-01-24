import bcrypt from "bcrypt";
import { openDb } from "../database/db";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

const db = await openDb();

async function seedUsers() {
	await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

	const insertedUsers = await Promise.all(
		users.map(async (user) => {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			return db.exec(`
        INSERT INTO users (name, email, password)
        VALUES ('${user.name}', '${user.email}', '${hashedPassword}');
      `);
		})
	);

	return insertedUsers;
}

async function seedInvoices() {
	await db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      status VARCHAR(255) NOT NULL,
      date TEXT NOT NULL
    );
  `);

	const insertedInvoices = await Promise.all(
		invoices.map((invoice) =>
			db.exec(`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, '${invoice.amount}', '${invoice.status}', '${invoice.date}');
      `)
		)
	);

	return insertedInvoices;
}

async function seedCustomers() {
	await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);

	const insertedCustomers = await Promise.all(
		customers.map((customer) =>
			db.exec(`
        INSERT INTO customers (name, email, image_url)
        VALUES ('${customer.name}', '${customer.email}', '${customer.image_url}');
      `)
		)
	);

	return insertedCustomers;
}

async function seedRevenue() {
	await db.exec(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INTEGER NOT NULL
    );
  `);

	const insertedRevenue = await Promise.all(
		revenue.map((rev) =>
			db.exec(`
        INSERT INTO revenue (month, revenue)
        VALUES ('${rev.month}', '${rev.revenue}')
        ON CONFLICT (month) DO NOTHING;
      `)
		)
	);

	return insertedRevenue;
}

export async function GET() {
	try {
		await db.exec(`BEGIN`);
		await seedUsers();
		await seedCustomers();
		await seedInvoices();
		await seedRevenue();
		await db.exec(`COMMIT`);

		return Response.json({ message: "Database seeded successfully" });
	} catch (error) {
		// await db.exec(`ROLLBACK`);
		return Response.json({ error }, { status: 500 });
	}
}
