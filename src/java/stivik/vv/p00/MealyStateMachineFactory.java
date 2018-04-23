package stivik.vv.p00;

import java.io.File;

public class MealyStateMachineFactory {
    public static MealyStateMachine build(MealyStateMachineFile construct) {
        MealyStateMachine machine = new MealyStateMachine(construct.getStates(), construct.getSymbols());

        return machine;
    }

    private MealyStateMachineFactory() {}
}
