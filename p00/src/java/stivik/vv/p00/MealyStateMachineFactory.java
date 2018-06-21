package stivik.vv.p00;

import stivik.vv.p00.models.MealyStateMachineFile;
import stivik.vv.p00.models.Transition;

/**
 * @Purpose creates from the XML model MealyStateMachineFile an MealyStateMachine
 */
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
