import type { Db } from '../db.ts';
import type { Server } from '../sdam/server.ts';
import type { ClientSession } from '../sessions.ts';
import type { Callback } from '../utils.ts';
import { CommandOperation, CommandOperationOptions } from './command.ts';
import { Aspect, defineAspects } from './operation.ts';

/** @public */
export type RemoveUserOptions = CommandOperationOptions;

/** @internal */
export class RemoveUserOperation extends CommandOperation<boolean> {
  override options: RemoveUserOptions;
  username: string;

  constructor(db: Db, username: string, options: RemoveUserOptions) {
    super(db, options);
    this.options = options;
    this.username = username;
  }

  override execute(
    server: Server,
    session: ClientSession | undefined,
    callback: Callback<boolean>
  ): void {
    super.executeCommand(server, session, { dropUser: this.username }, err => {
      callback(err, err ? false : true);
    });
  }
}

defineAspects(RemoveUserOperation, [Aspect.WRITE_OPERATION]);
