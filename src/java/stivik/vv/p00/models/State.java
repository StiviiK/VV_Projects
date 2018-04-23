package stivik.vv.p00.models;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "state")
@XmlType(propOrder = {"name", "isEnd", "_refrenceId"})
public class State {
    private static int lastId = 0;
    private int id = ++State.lastId;
    @XmlID
    @XmlAttribute(name = "_referenceId")
    private String _refrenceId;
    @XmlAttribute(name = "name")
    public String name;
    @XmlAttribute(name = "isEnd")
    public boolean isEnd;

    public State() { }

    public State(String name) {
        _refrenceId = getUniqueReference();

        this.name = name;
    }

    public State(String name, Boolean isEnd) {
        _refrenceId = getUniqueReference();

        this.name = name;
        this.isEnd = isEnd;
    }

    private String getUniqueReference() {
        return Integer.toHexString(hashCode());
    }

    public String get_refrenceId() {
        return _refrenceId;
    }

    public String getName() {
        return name;
    }

    public boolean getIsEnd() {
        return isEnd;
    }

}
