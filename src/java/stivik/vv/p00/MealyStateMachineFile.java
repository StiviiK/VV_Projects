package stivik.vv.p00;

import javax.xml.bind.annotation.*;

@XmlRootElement(name = "MealyStateMachine")
public class MealyStateMachineFile {

    @XmlElementWrapper(name = "states")
    @XmlElement(name = "state")
    public State[] states = { new State("S_i"), new State("S_0"), new State("S_1"), new State("S_2"), new State("S_3", true) };

    @XmlElementWrapper(name = "symbols")
    @XmlElement(name = "symbol")
    private  Symbol[] symbols = { new Symbol("0"), new Symbol("1"), new Symbol("2") };

    @XmlElementWrapper(name = "transitions")
    @XmlElement(name = "transition")
    public Transition[] transitions = {
            new Transition(states[0], symbols[0], states[1], symbols[0])
    };

    public MealyStateMachineFile() {}

    public Symbol[] getSymbols() {
        return symbols;
    }

    public State[] getStates() {
        return states;
    }
}
