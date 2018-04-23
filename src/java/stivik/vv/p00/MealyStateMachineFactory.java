package stivik.vv.p00;

public class MealyStateMachineFactory {
    public static MealyStateMachine build(MealyStateMachineFile construct) {
        MealyStateMachine machine = new MealyStateMachine(construct.getStates(), construct.getSymbols());
        for (Transition transition: construct.getTransitions()) {
            machine.addTransition(transition);
        }

        return machine;
    }

    private MealyStateMachineFactory() {}
}
