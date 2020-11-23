import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface DeleteTransactionServiceDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: DeleteTransactionServiceDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.find({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
