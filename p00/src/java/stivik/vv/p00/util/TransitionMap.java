package stivik.vv.p00.util;

import stivik.vv.p00.models.State;
import stivik.vv.p00.models.Symbol;

import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;

/**
 * @Purpose Map structure to hold "State + Symbol -> K" transitions
 *          Underlying "holder" type is an (hash) map which uses the hash of the private class Input (State + Symbol) as index to the target K
 **/
public class TransitionMap<K> {
    private class Input {
        private State m_State;
        private Symbol m_Symbol;

        private Input(State state, Symbol symbol) {
            m_State = state;
            m_Symbol = symbol;
        }

        @Override
        public int hashCode() {
            return 17 * m_State.hashCode() + 17 * m_Symbol.hashCode();
        }
    }

    private Map<Integer, K> transitions = new HashMap<>();

    public void put(State currentState, Symbol inputSymbol, K output) {
        transitions.put(new Input(currentState, inputSymbol).hashCode(), output);
    }

    public K get(State currentState, Symbol inputSymbol) {
        return transitions.get(new Input(currentState, inputSymbol).hashCode());
    }
}