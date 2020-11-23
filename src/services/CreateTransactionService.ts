import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CreateTransactionServiceDTO {
  title: string;
  type: 'outcome' | 'income';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category: categoryTitle,
  }: CreateTransactionServiceDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const balance = await transactionsRepository.getBalance();

    if (!title || !type || !value || !categoryTitle) {
      throw new AppError(
        'Insufficient informations to create a new transaction!',
      );
    }

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Not enough balance!');
    }

    const categoryByName = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!categoryByName) {
      const category = categoriesRepository.create({
        title: categoryTitle,
      });

      await categoriesRepository.save(category);

      const transaction = transactionsRepository.create({
        title,
        type,
        value,
        category_id: category.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryByName.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
