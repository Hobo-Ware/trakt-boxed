import { BehaviorSubject } from 'rxjs';
import type { ComposerTarget } from '../models/ComposerTarget.ts';

type ComposerState = {
  isOpen: boolean;
  target: ComposerTarget | null;
};

const state = new BehaviorSubject<ComposerState>({ isOpen: false, target: null });

export const composerStore = {
  subscribe: state.subscribe.bind(state),
  open(target: ComposerTarget) {
    state.next({ isOpen: true, target });
  },
  close() {
    state.next({ isOpen: false, target: null });
  },
};
