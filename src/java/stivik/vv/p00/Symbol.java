package stivik.vv.p00;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlID;

public class Symbol {
    private static int lastId = 0;

    @XmlID
    @XmlAttribute(name = "_referenceId")
    private String _refrenceId;

    @XmlAttribute(name = "id")
    public int m_Id = ++Symbol.lastId;

    @XmlAttribute(name = "name")
    public String m_Name;

    public Symbol() {}
    public Symbol(String name) {
        _refrenceId = getUniqueReference();

        m_Name = name;
    }

    private String getUniqueReference() {
        return Integer.toString(hashCode());
    }
}
