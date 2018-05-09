package stivik.vv.p00.models;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="MealyMachineInput")
public class InputSymbol {
    @XmlAttribute(name="_refSymbol")
    private String symbolRef;

    private InputSymbol() {

    }

    public Symbol getSymbol() {
        return Symbol.findSymbolByRef(symbolRef);
    }
}
