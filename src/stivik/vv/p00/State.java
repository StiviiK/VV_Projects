package stivik.vv.p00;

public class State {
    private static int lastId = 0;

    public int m_Id = ++State.lastId;
    public String m_Name;
    public boolean m_End = false;

    public State(String name) {
        m_Name = name;
    }

    public State(String name, Boolean isEnd) {
        m_Name = name;
        m_End = isEnd;
    }
}
