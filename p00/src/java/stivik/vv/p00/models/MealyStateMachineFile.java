package stivik.vv.p00.models;

import javax.xml.bind.annotation.*;

/**
 * @Purpose XML model for MealyStateMachine
 */
@XmlRootElement(name = "MealyStateMachine")
public class MealyStateMachineFile {
    @XmlElementWrapper(name = "states")
    @XmlElement(name = "state")
    private State[] states;

    @XmlElementWrapper(name = "symbols")
    @XmlElement(name = "symbol")
    private  Symbol[] symbols;

    @XmlElementWrapper(name = "transitions")
    @XmlElement(name = "transition")
    private Transition[] transitions;

    private MealyStateMachineFile() {

    }

    public Symbol[] getSymbols() {
        return symbols;
    }

    public State[] getStates() {
        return states;
    }

    public Transition[] getTransitions() {
        return transitions;
    }
}
