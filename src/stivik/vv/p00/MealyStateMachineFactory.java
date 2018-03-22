package stivik.vv.p00;

public class MealyStateMachineFactory {
    public State[] states;
    public Symbol[] symbols;
    public int[][] transitions;

    public MealyStateMachineFactory(State[] states, Symbol[] symbols) {
        this.states = states;
        this.symbols = symbols;

        transitions = new int[3][3];
    }

    public MealyStateMachine build() {
        return new MealyStateMachine(states, symbols);
    };
}
