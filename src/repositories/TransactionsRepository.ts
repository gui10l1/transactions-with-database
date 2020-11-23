import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactionsValues: number[] = [];
    const outcomeTransactionsValues: number[] = [];
    let incomeTotalValue = 0;
    let outcomeTotalValue = 0;

    const transactions = await this.find();

    transactions.map(transaction => {
      if (transaction.type === 'income') {
        return incomeTransactionsValues.push(transaction.value);
      }

      return outcomeTransactionsValues.push(transaction.value);
    });

    if (incomeTransactionsValues.length > 0) {
      incomeTotalValue = incomeTransactionsValues.reduce((acc, cur) => {
        return acc + cur;
      });
    }

    if (outcomeTransactionsValues.length > 0) {
      outcomeTotalValue = outcomeTransactionsValues.reduce((acc, cur) => {
        return acc + cur;
      });
    }

    const balance: Balance = {
      income: incomeTotalValue,
      outcome: outcomeTotalValue,
      total: incomeTotalValue - outcomeTotalValue,
    };

    return balance;
  }
}

export default TransactionsRepository;
