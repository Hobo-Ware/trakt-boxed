import { BehaviorSubject } from 'rxjs';
import type { LogTarget } from './LogTarget.ts';

export type LogComposerState =
  | { mode: 'picker' }
  | { mode: 'compose'; target: LogTarget }
  | null;

function createLogComposerStore() {
  const subject = new BehaviorSubject<LogComposerState>(null);

  return {
    state: subject.asObservable(),
    openPicker: () => subject.next({ mode: 'picker' }),
    compose: (target: LogTarget) => subject.next({ mode: 'compose', target }),
    close: () => subject.next(null),
  };
}

export const logComposerStore = createLogComposerStore();
