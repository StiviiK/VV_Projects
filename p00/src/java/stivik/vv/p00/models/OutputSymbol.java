package stivik.vv.p00.models;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="MealyMachineOutput")
public class OutputSymbol {
    @XmlAttribute(name="_refSymbol")
    private String symbolRef;

    private OutputSymbol() {}
    public OutputSymbol(Symbol output) {
        symbolRef = output.get_referenceId();
    }
}
