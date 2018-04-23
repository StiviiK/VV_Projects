package stivik.vv.p00;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "state")
public class State {
    private static int lastId = 0;

    @XmlID
    @XmlAttribute(name = "_referenceId")
    private String _refrenceId;

    @XmlAttribute(name = "id")
    public int m_Id = ++State.lastId;

    @XmlAttribute(name = "name")
    public String m_Name;

    @XmlAttribute(name = "end")
    public boolean m_End;

    public State() {}
    public State(String name) {
        _refrenceId = getUniqueReference();

        m_Name = name;
    }
    public State(String name, Boolean isEnd) {
        _refrenceId = getUniqueReference();

        m_Name = name;
        m_End = isEnd;
    }


    private String getUniqueReference() {
        return Integer.toString(hashCode());
    }
}
