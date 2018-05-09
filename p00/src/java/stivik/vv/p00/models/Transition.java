package stivik.vv.p00.models;

import javax.xml.bind.annotation.*;

@XmlRootElement(name = "transition")
public class Transition {
    @XmlIDREF
    @XmlAttribute(name = "_refFrom")
    public State fromState;

    @XmlIDREF
    @XmlAttribute(name = "_refInput")
    private Symbol inputSymbol;

    @XmlIDREF
    @XmlAttribute(name = "_refTo")
    private State toState;

    @XmlIDREF
    @XmlAttribute(name = "_refOutput")
    private Symbol outputSymbol;

    public Transition() {}
    public Transition(State from, Symbol input, State to, Symbol output) {
        fromState = from;
        inputSymbol = input;
        toState = to;
        outputSymbol = output;
    }

    public State getFromState() {
        return fromState;
    }

    public Symbol getInputSymbol() {
        return inputSymbol;
    }

    public State getToState() {
        return toState;
    }

    public Symbol getOutputSymbol() {
        return outputSymbol;
    }
}
