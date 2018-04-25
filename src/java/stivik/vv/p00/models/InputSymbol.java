package stivik.vv.p00.models;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="MealyMachineInput")
public class InputSymbol {
    @XmlAttribute(name="_refSymbol")
    private String symbolRef = "60e53b93";
    private Symbol symbol;

    public InputSymbol() {
        symbol = Symbol.findSymbolByRef(symbolRef);
    }

    public Symbol getSymbol() {
        return symbol;
    }

    public String toString() {
        return "ref: " + symbolRef + ", symbol:" + symbol;
    }
}
