import { ClientSession, Mongoose } from 'mongoose';
import { Inject, Service } from 'typedi';


export interface TransactionServiceInterface {
  startTransaction();
  commitTransaction(session: ClientSession);
  abortTransaction(session: ClientSession);
}

@Service()
export class MockTransactionService implements TransactionServiceInterface {
  async startTransaction() { return undefined; }
  async commitTransaction(session: ClientSession) {}
  async abortTransaction(session: ClientSession) {}
}

@Service()
export class TransactionService {
  @Inject('Mongoose')
  private Mongoose: Mongoose;

  /**
   * Starts a new transaction session.
   */
  async startTransaction() {
    const session = await this.Mongoose.startSession();
    session.startTransaction();
    return session;
  }

  /**
   * Commits a pending transaction.
   * @param session An existing transaction session.
   */
  async commitTransaction(session: ClientSession) {
    await session.commitTransaction();
    session.endSession();
  }

  /**
   * Aborts a transaction and ends the underlying session.
   * @param session An existing transaction session.
   */
  async abortTransaction(session: ClientSession) {
    await session.abortTransaction();
    session.endSession();
  }
}
