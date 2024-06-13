SELECT t.transaction_id, t.account_id, t.transaction_type, t.amount, t.transaction_date
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
WHERE a.account_number = :account_number
AND t.transaction_date >= TO_TIMESTAMP(:start_date, 'YYYY-MM-DD HH24:MI:SS')
AND t.transaction_date <= TO_TIMESTAMP(:end_date, 'YYYY-MM-DD HH24:MI:SS');
