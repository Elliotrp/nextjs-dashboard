import { openDb } from "../database/db";

const db = await openDb();

async function listInvoices() {
	const data = await db.all(`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `);

	return data;
}

export async function GET() {
	try {
		return Response.json(await listInvoices());
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
