package stivik.vv.p00.models;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlType;
import java.util.LinkedList;
import java.util.List;

@XmlType(propOrder = {"name", "_referenceId"})
public class Symbol {
    private static int lastId = 0;
    private static List<Symbol> symbols = new LinkedList<>();
    public static Symbol findSymbolByRef(String ref) {
        Symbol result = null;
        for (Symbol symbol : symbols) {
            if (symbol.get_referenceId().equalsIgnoreCase(ref)) {
                result = symbol;
                break;
            }
        }

        return result;
    }

    private int id = ++Symbol.lastId;
    @XmlID
    @XmlAttribute(name = "_referenceId")
    private String _referenceId;
    @XmlAttribute(name = "name")
    private String name;

    public Symbol() {
        symbols.add(this);
    }

    public String get_referenceId() {
        return _referenceId;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
