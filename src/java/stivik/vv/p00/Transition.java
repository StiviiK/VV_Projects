package stivik.vv.p00;

import javax.xml.bind.annotation.*;

@XmlRootElement(name = "transition")
public class Transition {
    @XmlIDREF
    @XmlAttribute(name = "from")
    public State fromState;

    @XmlIDREF
    @XmlAttribute(name = "input")
    private Symbol inputSymbol;

    @XmlIDREF
    @XmlAttribute(name = "to")
    private State toState;

    @XmlIDREF
    @XmlAttribute(name = "output")
    private Symbol outputSymbol;

    public Transition() {}
    public Transition(State from, Symbol input, State to, Symbol output) {
        fromState = from;
        inputSymbol = input;
        toState = to;
        outputSymbol = output;
    }
}
