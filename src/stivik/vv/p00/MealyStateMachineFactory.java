package stivik.vv.p00;

import java.io.File;

public class MealyStateMachineFactory {

    public static MealyStateMachine build(MealyStateMachineFile construct) {
        return new MealyStateMachine(null, null);
    }

}
