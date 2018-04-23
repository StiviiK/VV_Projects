package stivik.vv.p00.models;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlType;

@XmlType(propOrder = {"name", "_referenceId"})
public class Symbol {
    private static int lastId = 0;
    private int id = ++Symbol.lastId;
    @XmlID
    @XmlAttribute(name = "_referenceId")
    private String _referenceId;
    @XmlAttribute(name = "name")
    private String name;

    public Symbol() {}

    public Symbol(String name) {
        this._referenceId = getUniqueReference();
        this.name = name;
    }

    private String getUniqueReference() {
        return Integer.toHexString(hashCode());
    }

    private String get_referenceId() {
        return _referenceId;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
