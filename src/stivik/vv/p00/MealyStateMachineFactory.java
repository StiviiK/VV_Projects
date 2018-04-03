package stivik.vv.p00;

public class MealyStateMachineFactory {

    public MealyStateMachineFactory(MealyStateMachineFile construct) {

    }

    public MealyStateMachine build() {
        return new MealyStateMachine(null, null);
    };
}
